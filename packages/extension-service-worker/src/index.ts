import { Auth } from '@aws-amplify/auth';
import {
  analyze,
  configureApi,
  deleteLanguageDeck,
  loadLanguageDeck,
  playSound,
  postOnboardingAction,
  saveLanguageDeck,
} from '@vocably/api';
import { isItem, makeCreate, makeDelete, makeUpdate } from '@vocably/crud';
import {
  onAddCardRequest,
  onAnalyzeRequest,
  onAskForRating,
  onAttachTag,
  onCanPlayOffScreen,
  onCleanUpRequest,
  onDeleteTag,
  onDetachTag,
  onGetAudioPronunciation,
  onGetInternalProxyLanuage,
  onGetInternalSourceLanguage,
  onGetLanguagePairs,
  onGetLocationLanguageRequest,
  onGetProxyLanguage,
  onGetSettingsRequest,
  onGetSourceLanguage,
  onIsActiveRequest,
  onIsEligibleForTrialRequest,
  onIsLoggedInRequest,
  onIsUserKnowsHowToAdd,
  onListLanguagesRequest,
  onListTargetLanguagesRequest,
  onPing,
  onPingExternal,
  onPlayAudioPronunciation,
  onRemoveCardRequest,
  onSaveAskForRatingResponse,
  onSaveLocationLanguageRequest,
  onSetInternalProxyLanguage,
  onSetInternalSourceLanguage,
  onSetProxyLanguage,
  onSetSettingsRequest,
  onSetSourceLanguage,
  onSetUserKnowsHowToAdd,
  onUpdateCard,
  onUpdateTag,
  playAudioPronunciationOffscreen,
} from '@vocably/extension-messages';
import {
  Analysis,
  AnalyzePayload,
  Card,
  Facility,
  GoogleLanguage,
  isCardItem,
  isEligibleForTrial,
  LanguageDeck,
  mapUserAttributes,
  Result,
  TranslationCard,
  TranslationCards,
} from '@vocably/model';
import { buildTagMap } from '@vocably/model-operations';
import { createSrsItem } from '@vocably/srs';
import { get, isEqual, uniq } from 'lodash-es';
import posthog from 'posthog-js';
import { distinctUntilChanged, Observable, switchMap, timer } from 'rxjs';
import {
  getAskForRatingCounter,
  resetAskForRatingCounter,
  storeAskForRatingCounter,
} from './askForRatingCounter';
import { browserEnv, hasOffscreen } from './browserEnv';
import { createTranslationCards } from './createTranslationCards';
import './fixAuth';
import { getUserAttributes } from './getUserAttributes';
import { addLanguage, getUserLanguages, removeLanguage } from './languageList';
import { getLastUsedTagsIds, saveLastUsedTagsIds } from './lastUsedTagsIds';
import { getLocationLanguage, storeLocationLanguage } from './locationLanguage';
import {
  getLanguagePair,
  languagePairs,
} from './selectedLanguage/languagePairs';
import {
  getProxyLanguage,
  setProxyLanguage,
} from './selectedLanguage/proxyLanguage';
import {
  getSourceLanguage,
  setSourceLanguage,
} from './selectedLanguage/sourceLanguage';
import { getSettings, setSettings } from './settings';
import {
  getUserMetadata,
  invalidateUserMetadata,
  saveUserMetadata,
} from './userMetadata';

type RegisterServiceWorkerOptions = {
  auth: Parameters<typeof Auth.configure>[0];
  api: Parameters<typeof configureApi>[0];
  facility: 'chrome-or-safari' | 'ios-safari';
};

export const isLoggedIn$: Observable<boolean> = timer(0, 2000).pipe(
  switchMap(async () => {
    return await Auth.currentSession()
      .then(() => true)
      .catch(() => false);
  }),
  distinctUntilChanged()
);

export const registerServiceWorker = (
  registerServiceWorkerOptions: RegisterServiceWorkerOptions
) => {
  posthog.init('phc_vke56i7RTlBbFYHZHsoH7VhgWi2DwvKtEzusfcFemgT', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    persistence: 'memory',
  });

  Auth.configure(registerServiceWorkerOptions.auth);

  configureApi(registerServiceWorkerOptions.api);

  isLoggedIn$.subscribe(async (isLoggedIn) => {
    if (!isLoggedIn) {
      return;
    }

    const facility: Facility =
      registerServiceWorkerOptions.facility === 'ios-safari'
        ? 'ios-safari-extension'
        : browserEnv.runtime.getURL('/').startsWith('chrome-extension:')
        ? 'chrome-extension'
        : 'safari-extension';

    postOnboardingAction({
      name: 'userLoggedIn',
      payload: {
        facility,
      },
    }).then();
  });

  onIsLoggedInRequest(async (sendResponse) => {
    const isLoggedIn = await Auth.currentSession()
      .then(() => true)
      .catch(() => false);

    if (!posthog._isIdentified()) {
      getUserAttributes().then((result) => {
        if (!result.success) {
          return;
        }

        posthog.identify(result.value.sub, {
          email: result.value.email,
        });
      });
    }

    return sendResponse(isLoggedIn);
  });

  onIsActiveRequest(async (sendResponse) => {
    const user = await Auth.currentAuthenticatedUser().catch(() => false);

    if (!user) {
      return sendResponse(false);
    }

    return sendResponse(
      get(
        user,
        'signInUserSession.accessToken.payload.cognito:groups',
        []
      ).includes('paid')
    );
  });

  onIsEligibleForTrialRequest(async (sendResponse) => {
    const user = await Auth.currentAuthenticatedUser().catch(() => false);

    if (user === false) {
      return sendResponse(false);
    }

    const attributes = await Auth.userAttributes(user);

    const userData = mapUserAttributes({ user, attributes });
    return sendResponse(isEligibleForTrial(userData));
  });

  const getAnalysisAndCards = async (
    analyzePayload: AnalyzePayload
  ): Promise<[Result<Analysis>, Result<LanguageDeck>]> => {
    if (analyzePayload.sourceLanguage) {
      return Promise.all([
        analyze(analyzePayload),
        loadLanguageDeck(analyzePayload.sourceLanguage),
      ]);
    }

    const analysisResult = await analyze(analyzePayload);
    if (analysisResult.success === false) {
      return [
        analysisResult,
        {
          success: false,
          errorCode: 'LANGUAGE_DECK_LOAD_ERROR',
          reason: `The language deck can't be loaded because the source language is not specified and can't be detected.`,
        },
      ];
    }

    return [
      analysisResult,
      await loadLanguageDeck(analysisResult.value.translation.sourceLanguage),
    ];
  };

  onAnalyzeRequest(async (sendResponse, payload) => {
    if (payload.sourceLanguage) {
      await setSourceLanguage(payload.sourceLanguage);
    }

    if (payload.targetLanguage) {
      await setProxyLanguage(payload.targetLanguage);
    }

    const analyzePayload = {
      ...payload,
      sourceLanguage:
        payload.sourceLanguage ?? (await getSourceLanguage()) ?? 'en',
      targetLanguage:
        payload.targetLanguage ?? (await getProxyLanguage()) ?? 'en',
    };

    posthog.capture('analyze_requested', analyzePayload);

    try {
      const [analysisResult, loadLanguageDeckResult] =
        await getAnalysisAndCards(analyzePayload);

      if (analysisResult.success === false) {
        analysisResult.extra &&
          analysisResult.extra.body &&
          console.info(
            'Backend error body',
            analysisResult.extra.body.toString()
          );
        return sendResponse(analysisResult);
      }

      if (loadLanguageDeckResult.success === false) {
        return sendResponse(loadLanguageDeckResult);
      }

      const languageDeck = loadLanguageDeckResult.value;
      const cards = createTranslationCards(
        languageDeck.cards,
        analyzePayload,
        analysisResult.value
      );

      const value = {
        cards,
        explanation: analysisResult.value.explanation ?? '',
        source: analysisResult.value.source,
        translation: analysisResult.value.translation,
        tags: loadLanguageDeckResult.value.tags,
      };

      addLanguage(value.translation.sourceLanguage);
      return sendResponse({
        success: true,
        value,
      });
    } catch (e) {
      console.error('Cards creation error', e);

      return sendResponse({
        success: false,
        errorCode: 'EXTENSION_SERVICE_WORKER_ERROR_CREATING_CARDS',
        reason: `An unexpected error has occurred during the cards creation in service worker.`,
        extra: e,
      });
    }
  });

  onRemoveCardRequest(async (sendResponse, payload) => {
    const getLanguageDeckResult = await loadLanguageDeck(
      payload.translationCards.translation.sourceLanguage
    );

    if (getLanguageDeckResult.success === false) {
      return sendResponse(getLanguageDeckResult);
    }

    makeDelete(getLanguageDeckResult.value.cards)(payload.card.id);

    const saveLanguageDeckResult = await saveLanguageDeck(
      getLanguageDeckResult.value
    );

    if (saveLanguageDeckResult.success === false) {
      return sendResponse(saveLanguageDeckResult);
    }

    return sendResponse({
      success: true,
      value: {
        ...payload.translationCards,
        cards: payload.translationCards.cards.map((item) =>
          isEqual(item, payload.card)
            ? {
                data: item.data,
              }
            : item
        ),
      },
    });
  });

  onAddCardRequest(async (sendResponse, payload) => {
    const getLanguageDeckResult = await loadLanguageDeck(
      payload.translationCards.translation.sourceLanguage
    );

    posthog.capture('addCard', {
      card: payload.card,
    });

    if (getLanguageDeckResult.success === false) {
      return sendResponse(getLanguageDeckResult);
    }

    const tagMap = buildTagMap(getLanguageDeckResult.value.tags);
    const lastUsedTagsIds = await getLastUsedTagsIds();

    const tags = uniq(lastUsedTagsIds)
      .filter((tagId) => tagMap[tagId])
      .map((tagId) => tagMap[tagId]);

    await saveLastUsedTagsIds(tags.map((t) => t.id));

    const addedCard = makeCreate(getLanguageDeckResult.value.cards)({
      ...createSrsItem(),
      ...payload.card.data,
      tags,
    });

    const saveLanguageDeckResult = await saveLanguageDeck(
      getLanguageDeckResult.value
    );

    if (saveLanguageDeckResult.success === false) {
      return sendResponse(saveLanguageDeckResult);
    }

    return sendResponse({
      success: true,
      value: {
        ...payload.translationCards,
        cards: payload.translationCards.cards.map((item) =>
          isEqual(item, payload.card) ? addedCard : item
        ),
      },
    });
  });

  onCleanUpRequest(async (sendResponse, payload) => {
    console.info(`Clean up has been requested.`, payload);
    try {
      const loadLanguageDeckResult = await loadLanguageDeck(
        payload.translation.sourceLanguage
      );

      if (loadLanguageDeckResult.success === false) {
        return sendResponse(loadLanguageDeckResult);
      }

      const deck = loadLanguageDeckResult.value;

      const deleteCard = makeDelete(deck.cards);
      payload.cards.forEach((item) => {
        if (isCardItem(item)) {
          deleteCard(item.id);
        }
      });

      if (deck.cards.length === 0) {
        console.info(`The entire deck will be deleted.`, payload);
        removeLanguage(deck.language as GoogleLanguage);
        return sendResponse(await deleteLanguageDeck(deck.language));
      }

      console.info(
        `${payload.cards.length} cards will be deleted from the deck.`,
        payload
      );
      return sendResponse(await saveLanguageDeck(deck));
    } catch (e) {
      return sendResponse({
        success: false,
        errorCode: 'EXTENSION_SERVICE_WORKER_ERROR_CLEANING_UP',
        reason: `An unexpected error has occurred during the cards clean up in service worker.`,
        extra: e,
      });
    }
  });

  onListLanguagesRequest(async (sendResponse) =>
    sendResponse(await getUserLanguages())
  );

  onListTargetLanguagesRequest(async (sendResponse) => {
    const sourceLanguage = await getSourceLanguage();
    const languagePair = getLanguagePair(sourceLanguage);
    return sendResponse(
      languagePair ? languagePair.possibleTargetLanguages : []
    );
  });

  onPing((sendResponse) => {
    return sendResponse('pong');
  });

  onPingExternal((sendResponse) => {
    return sendResponse('pong');
  });

  onGetInternalProxyLanuage(async (sendResponse) => {
    return sendResponse(await getProxyLanguage());
  });

  onSetInternalProxyLanguage(async (sendResponse, language) => {
    await setProxyLanguage(language);
    return sendResponse();
  });

  onGetInternalSourceLanguage(async (sendResponse) => {
    return sendResponse(await getSourceLanguage());
  });

  onSetInternalSourceLanguage(async (sendResponse, language) => {
    await setSourceLanguage(language);
    return sendResponse();
  });

  onGetProxyLanguage(async (sendResponse) => {
    return sendResponse(await getProxyLanguage());
  });

  onSetProxyLanguage(async (sendResponse, language) => {
    await setProxyLanguage(language);
    return sendResponse();
  });

  onGetSourceLanguage(async (sendResponse) => {
    return sendResponse(await getSourceLanguage());
  });

  onSetSourceLanguage(async (sendResponse, language) => {
    await setSourceLanguage(language);
    return sendResponse();
  });

  onIsUserKnowsHowToAdd(async (sendResponse) => {
    const { userKnowsHowToAdd } = await browserEnv.storage.sync.get([
      'userKnowsHowToAdd',
    ]);
    return sendResponse(userKnowsHowToAdd ?? false);
  });

  onSetUserKnowsHowToAdd(async (sendResponse, value) => {
    await browserEnv.storage.sync.set({
      userKnowsHowToAdd: value,
    });
    return sendResponse();
  });

  onGetAudioPronunciation(async (sendResponse, payload) => {
    return sendResponse(await playSound(payload));
  });

  onAskForRating(async (sendResponse, payload) => {
    if (payload.translationResult.success === false) {
      return sendResponse(false);
    }

    const userMetadataResult = await getUserMetadata();

    if (userMetadataResult.success === false) {
      return sendResponse(false);
    }

    const userMetadata = userMetadataResult.value;

    if (
      userMetadata.rate[payload.extensionPlatform] &&
      (userMetadata.rate[payload.extensionPlatform].response === 'never' ||
        userMetadata.rate[payload.extensionPlatform].response === 'review')
    ) {
      return sendResponse(false);
    }

    const counter = await getAskForRatingCounter(
      payload.translationResult.value.translation.sourceLanguage
    );

    await storeAskForRatingCounter(counter + 1);

    if (counter === 0) {
      return sendResponse(false);
    }

    const shouldAskForRating =
      userMetadata.rate[payload.extensionPlatform] &&
      userMetadata.rate[payload.extensionPlatform].response === 'feedback'
        ? counter % 30 === 0
        : counter % 10 === 0;

    if (shouldAskForRating) {
      posthog.capture('extensionAskForRatingShown', {
        counter,
      });
    }

    return sendResponse(shouldAskForRating);
  });

  onSaveAskForRatingResponse(async (sendResponse, payload) => {
    posthog.capture('extensionAskForRatingResponse', {
      response: payload.rateInteraction,
    });

    invalidateUserMetadata();
    const userMetadataResult = await getUserMetadata();

    if (userMetadataResult.success === false) {
      return sendResponse();
    }

    const userMetadata = userMetadataResult.value;

    userMetadata.rate[payload.extensionPlatform] = {
      response: payload.rateInteraction,
      isoDate: new Date().toISOString(),
    };

    await saveUserMetadata(userMetadata);
    await resetAskForRatingCounter();
    return sendResponse();
  });

  onGetLocationLanguageRequest(async (sendResponse, url) => {
    return sendResponse(getLocationLanguage(url));
  });

  onSaveLocationLanguageRequest(async (sendResponse, [url, language]) => {
    await storeLocationLanguage(url, language);
    return sendResponse();
  });

  onGetSettingsRequest(async (sendResponse) => {
    return sendResponse(await getSettings());
  });

  onSetSettingsRequest(async (sendResponse, partialSettings) => {
    return sendResponse(await setSettings(partialSettings));
  });

  onCanPlayOffScreen(async (sendResponse) => {
    return sendResponse(hasOffscreen(browserEnv));
  });

  onPlayAudioPronunciation(async (sendResponse, payload) => {
    if (!hasOffscreen(browserEnv)) {
      return {
        success: false,
        errorCode: 'EXTENSION_OFFSCREEN_DOES_NOT_EXIST',
        reason:
          'The extension is trying to use browser.offscreen to play the audio pronunciation',
      };
    }

    if (!(await browserEnv.offscreen.hasDocument())) {
      await browserEnv.offscreen.createDocument({
        url: 'play-audio.html',
        reasons: [browserEnv.offscreen.Reason.AUDIO_PLAYBACK],
        justification: 'Play the audio pronunciation',
      });
    }

    return sendResponse(await playAudioPronunciationOffscreen(payload));
  });

  type UpdateDetachedCardPayload = {
    translationCards: TranslationCards;
    card: TranslationCard;
    data: Partial<Card>;
  };
  const updateDetachedCard = ({
    translationCards,
    card,
    data,
  }: UpdateDetachedCardPayload): Result<TranslationCards> => {
    return {
      success: true,
      value: {
        ...translationCards,
        cards: translationCards.cards.map((translationCard) => {
          if (!isEqual(translationCard, card)) {
            return translationCard;
          }

          return {
            ...translationCard,
            data: {
              ...translationCard.data,
              ...data,
            },
          };
        }),
      },
    };
  };

  onUpdateCard(async (sendResponse, payload) => {
    if (payload.data.translation) {
      posthog.capture('cardTranslationUpdated', {
        sourceLanguage: payload.translationCards.translation.sourceLanguage,
        targetLanguage: payload.translationCards.translation.targetLanguage,
        source: payload.translationCards.source,
        originalTranslation: payload.card.data.translation,
        newTranslation: payload.data.translation,
      });
    }

    if (!isCardItem(payload.card)) {
      return sendResponse(
        updateDetachedCard({
          ...payload,
          card: payload.card,
        })
      );
    }

    const languageDeckResult = await loadLanguageDeck(
      payload.translationCards.translation.sourceLanguage
    );

    if (languageDeckResult.success === false) {
      return sendResponse(languageDeckResult);
    }

    const updateResult = makeUpdate(languageDeckResult.value.cards)(
      payload.card.id,
      payload.data
    );

    if (updateResult.success === false) {
      return sendResponse(updateResult);
    }

    const saveResult = await saveLanguageDeck(languageDeckResult.value);

    if (saveResult.success === false) {
      return sendResponse(saveResult);
    }

    return sendResponse({
      success: true,
      value: {
        ...payload.translationCards,
        cards: payload.translationCards.cards.map((c) => {
          if (!isItem(c)) {
            return c;
          }

          if (c.id !== updateResult.value.id) {
            return c;
          }

          return updateResult.value;
        }),
      },
    });
  });

  onAttachTag(async (sendResponse, payload) => {
    const languageDeckResult = await loadLanguageDeck(
      payload.translationCards.translation.sourceLanguage
    );

    if (languageDeckResult.success === false) {
      return sendResponse(languageDeckResult);
    }

    const tagCandidate = payload.tag;
    const tagItem = isItem(tagCandidate)
      ? languageDeckResult.value.tags.find((t) => t.id === tagCandidate.id)
      : makeCreate(languageDeckResult.value.tags)(tagCandidate.data);

    if (tagItem === undefined) {
      return sendResponse({
        success: false,
        errorCode: 'EXTENSION_UNABLE_TO_COMPLETE_TAG_OPERATION',
        reason: `Unable to find tag in the collection`,
        extra: {
          payload,
        },
      });
    }

    const card = languageDeckResult.value.cards.find(
      (c) => c.id === payload.cardId
    );

    if (card === undefined) {
      return sendResponse({
        success: false,
        errorCode: 'EXTENSION_UNABLE_TO_COMPLETE_TAG_OPERATION',
        reason: `Unable to find card with ID ${payload.cardId}`,
        extra: {
          payload,
        },
      });
    }

    if (!card.data.tags.some((t) => t.id === tagItem.id)) {
      card.data.tags.push(tagItem);
    }

    await saveLastUsedTagsIds(card.data.tags.map((t) => t.id));

    const saveResult = await saveLanguageDeck(languageDeckResult.value);

    if (saveResult.success === false) {
      return sendResponse(saveResult);
    }

    return sendResponse({
      success: true,
      value: {
        ...payload.translationCards,
        tags: languageDeckResult.value.tags,
        cards: payload.translationCards.cards.map((c) => {
          if (!isItem(c)) {
            return c;
          }

          if (c.id !== payload.cardId) {
            return c;
          }

          return {
            ...c,
            ...card,
            data: {
              ...c.data,
              ...card.data,
            },
          };
        }),
      },
    });
  });

  onDetachTag(async (sendResponse, payload) => {
    const languageDeckResult = await loadLanguageDeck(
      payload.translationCards.translation.sourceLanguage
    );

    if (languageDeckResult.success === false) {
      return sendResponse(languageDeckResult);
    }

    const card = languageDeckResult.value.cards.find(
      (c) => c.id === payload.cardId
    );

    if (card === undefined) {
      return sendResponse({
        success: false,
        errorCode: 'EXTENSION_UNABLE_TO_COMPLETE_TAG_OPERATION',
        reason: `Unable to find card with ID ${payload.cardId}`,
        extra: {
          payload,
        },
      });
    }

    card.data.tags = card.data.tags.filter((t) => t.id !== payload.tag.id);

    await saveLastUsedTagsIds(card.data.tags.map((t) => t.id));

    const saveResult = await saveLanguageDeck(languageDeckResult.value);

    if (saveResult.success === false) {
      return sendResponse(saveResult);
    }

    return sendResponse({
      success: true,
      value: {
        ...payload.translationCards,
        tags: languageDeckResult.value.tags,
        cards: payload.translationCards.cards.map((c) => {
          if (!isItem(c)) {
            return c;
          }

          if (c.id !== payload.cardId) {
            return c;
          }

          return {
            ...c,
            ...card,
            data: {
              ...c.data,
              ...card.data,
            },
          };
        }),
      },
    });
  });

  onUpdateTag(async (sendResponse, payload) => {
    const languageDeckResult = await loadLanguageDeck(
      payload.translationCards.translation.sourceLanguage
    );

    if (languageDeckResult.success === false) {
      return sendResponse(languageDeckResult);
    }

    const updateResult = makeUpdate(languageDeckResult.value.tags)(
      payload.tag.id,
      payload.tag.data
    );

    if (updateResult.success === false) {
      return sendResponse(updateResult);
    }

    const saveResult = await saveLanguageDeck(languageDeckResult.value);

    if (saveResult.success === false) {
      return sendResponse(saveResult);
    }

    return sendResponse({
      success: true,
      value: {
        ...payload.translationCards,
        tags: languageDeckResult.value.tags,
        cards: payload.translationCards.cards.map((c) => {
          return {
            ...c,
            data: {
              ...c.data,
              tags: c.data.tags.map((t) =>
                t.id === updateResult.value.id ? updateResult.value : t
              ),
            },
          };
        }),
      },
    });
  });

  onDeleteTag(async (sendResponse, payload) => {
    const languageDeckResult = await loadLanguageDeck(
      payload.translationCards.translation.sourceLanguage
    );

    if (languageDeckResult.success === false) {
      return sendResponse(languageDeckResult);
    }

    const deleteResult = makeDelete(languageDeckResult.value.tags)(
      payload.tag.id
    );

    if (deleteResult.success === false) {
      return sendResponse(deleteResult);
    }

    languageDeckResult.value.cards.forEach((card) => {
      card.data.tags = card.data.tags.filter((t) => t.id !== payload.tag.id);
    });

    const saveResult = await saveLanguageDeck(languageDeckResult.value);

    if (saveResult.success === false) {
      return sendResponse(saveResult);
    }

    return sendResponse({
      success: true,
      value: {
        ...payload.translationCards,
        tags: languageDeckResult.value.tags,
        cards: payload.translationCards.cards.map((c) => {
          return {
            ...c,
            data: {
              ...c.data,
              tags: c.data.tags.filter((t) => t.id !== payload.tag.id),
            },
          };
        }),
      },
    });
  });

  onGetLanguagePairs(async (sendResponse) => {
    return sendResponse(languagePairs);
  });
};
