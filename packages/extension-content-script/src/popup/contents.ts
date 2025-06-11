import { detectExtensionPlatform } from '@vocably/browser';
import {
  AddCardPayload,
  GoogleLanguage,
  RateInteractionPayload,
  RemoveCardPayload,
} from '@vocably/model';
import { isString } from 'lodash-es';
import { api } from '../api';
import { contentScriptConfiguration } from '../configuration';
import { playAudioPronunciation } from '../playAudioPronunciation';

type Options = {
  popup: HTMLElement;
  source: string;
  detectedLanguage: GoogleLanguage | undefined;
  autoPlay: boolean;
  context?: string;
};

export type TearDown = () => void;

const getLocaleLanguage = (): string => {
  if (!window?.navigator?.language) {
    return 'en';
  }

  return window.navigator.language.substring(0, 2);
};

export const setContents = async ({
  popup,
  source,
  detectedLanguage,
  context,
  autoPlay,
}: Options): Promise<TearDown> => {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let waitForPaymentIntervalId: ReturnType<typeof setInterval> | null = null;
  let explicitlySetLanguage: GoogleLanguage | null = null;

  const tearDown = () => {
    clearInterval(intervalId);
    intervalId = null;
    clearInterval(waitForPaymentIntervalId);
    waitForPaymentIntervalId = null;
  };

  const setTranslation = async () => {
    const userKnowsHowToAdd = await api.isUserKnowsHowToAdd();
    const extensionPlatform = detectExtensionPlatform();
    const translation = document.createElement('vocably-translation');
    translation.phrase = source;
    translation.playAudioPronunciation = playAudioPronunciation;
    translation.showSaveHint = !userKnowsHowToAdd;
    translation.extensionPlatform = extensionPlatform;
    translation.canCongratulate =
      contentScriptConfiguration.allowFirstTranslationCongratulation &&
      !userKnowsHowToAdd;

    type AnalyzePayload = {
      sourceLanguage?: GoogleLanguage;
      targetLanguage?: GoogleLanguage;
    };

    const analyze = async ({
      sourceLanguage,
      targetLanguage,
    }: AnalyzePayload = {}) => {
      translation.loading = true;

      const [translationResult, maxCards] = await Promise.all([
        api.analyze({
          source,
          sourceLanguage,
          targetLanguage,
          context,
          initiator: 'content-script',
        }),
        api.getMaxCards(),
      ]);

      translation.maxCards = maxCards;
      translation.loading = false;

      if (translationResult.success === false) {
        console.error('Analyze error', translationResult);
      }

      if (contentScriptConfiguration.askForRatingEnabled) {
        api
          .askForRating({
            translationResult: translationResult,
            extensionPlatform: extensionPlatform.platform,
          })
          .then((result) => {
            translation.askForRating = result;
          });
      }

      translation.result = translationResult;
      if (translationResult.success === true) {
        translation.sourceLanguage =
          translationResult.value.translation.sourceLanguage;

        translation.targetLanguage =
          translationResult.value.translation.targetLanguage;

        if (autoPlay) {
          setTimeout(() => {
            translation.play();
          }, 50);
        }
      }

      const existingLanguagesResult = await api.listLanguages();
      translation.existingSourceLanguages = existingLanguagesResult.success
        ? existingLanguagesResult.value
        : [];
      const existingTargetLanguages = await api.listTargetLanguages();
      if (extensionPlatform.paymentLink === 'web') {
        translation.paymentLink = contentScriptConfiguration.webPaymentLink;
      } else if (isString(extensionPlatform.paymentLink)) {
        translation.paymentLink = extensionPlatform.paymentLink;
      } else {
        translation.paymentLink = '';
      }

      translation.existingTargetLanguages = existingTargetLanguages;
    };

    translation.updateCard = api.updateCard;
    translation.attachTag = api.attachTag;
    translation.detachTag = api.detachTag;
    translation.deleteTag = api.deleteTag;
    translation.updateTag = api.updateTag;

    translation.addEventListener(
      'changeSourceLanguage',
      ({ detail: sourceLanguage }: CustomEvent) => {
        if (translation.result && translation.result.success) {
          api.cleanUp(translation.result.value);
        }
        api.saveLocationLanguage([window.location.toString(), sourceLanguage]);
        translation.sourceLanguage = sourceLanguage;
        analyze({
          sourceLanguage,
        });
      }
    );

    translation.addEventListener('watchMePaying', () => {
      waitForPaymentIntervalId = setInterval(async () => {
        const maxCards = await api.getMaxCards();
        translation.maxCards = maxCards;
        if (maxCards === 'unlimited') {
          clearInterval(waitForPaymentIntervalId);
          waitForPaymentIntervalId = null;
        }
      }, 10_000);
    });

    translation.addEventListener(
      'changeTargetLanguage',
      ({ detail: targetLanguage }: CustomEvent) => {
        if (translation.result && translation.result.success) {
          api.cleanUp(translation.result.value);
        }
        translation.targetLanguage = targetLanguage;
        analyze({
          targetLanguage,
        });
      }
    );

    translation.addEventListener(
      'removeCard',
      async ({ detail: payload }: CustomEvent<RemoveCardPayload>) => {
        translation.isUpdating = payload.card;
        translation.result = await api.removeCard(payload);
        translation.isUpdating = null;
        await api.setUserKnowsHowToAdd(true);
      }
    );

    translation.addEventListener(
      'addCard',
      async ({ detail: payload }: CustomEvent<AddCardPayload>) => {
        translation.isUpdating = payload.card;
        translation.result = await api.addCard(payload);
        translation.isUpdating = null;
        await api.setUserKnowsHowToAdd(true);
      }
    );

    translation.addEventListener(
      'ratingInteraction',
      async ({ detail: payload }: CustomEvent<RateInteractionPayload>) => {
        await api.saveAskForRatingResponse({
          extensionPlatform: extensionPlatform.platform,
          rateInteraction: payload,
        });
      }
    );

    analyze({
      sourceLanguage: explicitlySetLanguage ?? detectedLanguage,
    });

    popup.innerHTML = '';
    popup.appendChild(translation);
  };

  let timerElapsed = false;

  const isAlright = (): Promise<
    [boolean, number, GoogleLanguage | null, GoogleLanguage | null]
  > => {
    return Promise.all([
      api.isLoggedIn(),
      api.getSecondsBeforeNextTranslation(),
      api.getInternalSourceLanguage(),
      api.getInternalProxyLanguage(),
    ]);
  };

  const [
    isLoggedIn,
    secondsBeforeNextTranslation,
    internalSourceLanguage,
    internalTargetLanguage,
  ] = await isAlright();

  if (
    isLoggedIn &&
    (secondsBeforeNextTranslation === 0 || timerElapsed) &&
    internalSourceLanguage &&
    internalTargetLanguage
  ) {
    await setTranslation();
    return tearDown;
  }

  const alert = document.createElement('div');

  const updateAlertMessage = async (
    isLoggedIn: boolean,
    secondsBeforeNextTranslation: number,
    internalSourceLanguage: GoogleLanguage | null,
    internalTargetLanguage: GoogleLanguage | null
  ) => {
    if (!isLoggedIn) {
      if (alert.dataset.message !== 'sign-in') {
        alert.dataset.message = 'sign-in';
        alert.innerHTML = '';
        const signInElement = document.createElement('vocably-sign-in');

        signInElement.addEventListener('confirm', () => {
          closeWindow();
          windowProxy = window.open(`${api.appBaseUrl}/hands-free`, '_blank');
          windowProxy.focus();
        });

        alert.appendChild(signInElement);
      }
      return;
    }

    if (secondsBeforeNextTranslation > 0) {
      if (alert.dataset.message !== 'subscribe') {
        alert.dataset.message = 'subscribe';
        alert.innerHTML = '';
        const subscribeElement = document.createElement(
          'vocably-subscription-timer'
        );
        // @ts-ignore
        subscribeElement.seconds = secondsBeforeNextTranslation;
        subscribeElement.addEventListener('elapsed', () => {
          timerElapsed = true;
        });
        alert.appendChild(subscribeElement);
      }
      return;
    }

    if (!internalSourceLanguage || !internalTargetLanguage) {
      if (alert.dataset.message !== 'proxy-language') {
        alert.dataset.message = 'proxy-language';
        alert.innerHTML = '';
        const languageForm = document.createElement('vocably-language');
        languageForm.sourceLanguage =
          internalSourceLanguage ?? detectedLanguage;
        languageForm.targetLanguage =
          internalTargetLanguage ?? getLocaleLanguage();

        languageForm.addEventListener('confirm', async (event: CustomEvent) => {
          languageForm.waiting = true;
          const { sourceLanguage, targetLanguage } = event.detail;
          explicitlySetLanguage = sourceLanguage;
          await Promise.all([
            api.setInternalSourceLanguage(sourceLanguage),
            api.setInternalProxyLanguage(targetLanguage),
          ]);
        });

        alert.appendChild(languageForm);
      }
    }
  };

  await updateAlertMessage(
    isLoggedIn,
    secondsBeforeNextTranslation,
    internalSourceLanguage,
    internalTargetLanguage
  );

  let windowProxy: WindowProxy | null = null;

  const closeWindow = () => {
    if (windowProxy !== null) {
      windowProxy.close();
      windowProxy = null;
    }
  };

  intervalId = setInterval(async () => {
    const [
      isLoggedIn,
      secondsBeforeNextTranslation,
      internalSourceLanguage,
      internalTargetLanguage,
    ] = await isAlright();
    if (
      isLoggedIn &&
      (secondsBeforeNextTranslation === 0 || timerElapsed) &&
      internalSourceLanguage &&
      internalTargetLanguage
    ) {
      clearInterval(intervalId);
      intervalId = null;
      await setTranslation();
      setTimeout(closeWindow, 3000);
    } else {
      await updateAlertMessage(
        isLoggedIn,
        secondsBeforeNextTranslation,
        internalSourceLanguage,
        internalTargetLanguage
      );
    }
  }, 1000);

  popup.innerHTML = '';
  popup.appendChild(alert);

  return tearDown;
};
