import { defineCustomElements } from '@vocably/extension-content-ui/loader';
import '@webcomponents/custom-elements';
import { map, merge, Subject, take, timer } from 'rxjs';
import { api, ApiConfigOptions, configureApi } from './api';
import { browser } from './browser';
import { createButton, destroyButton } from './button';
import {
  configureContentScript,
  contentScriptConfiguration,
  ContentScriptConfiguration,
} from './configuration';
import { contextLanguages } from './contextLanguages';
import { detectLanguage } from './detectLanguage';
import { getContext } from './getContext';
import { getText } from './getText';
import { createPopup, destroyAllPopups } from './popup';
import { getGlobalRect } from './position';
import { isValidSelection } from './selection';
import { initYoutube, InitYouTubeOptions } from './youtube';

type RegisterContentScriptOptions = {
  api: ApiConfigOptions;
  youTube: InitYouTubeOptions;
  contentScript: Partial<ContentScriptConfiguration>;
};

const onCreateSelectionTimeout = async () => {
  try {
    await api.ping();
  } catch {
    return;
  }

  destroyButton();

  const selection = window.getSelection();
  if (!isValidSelection(selection)) {
    return;
  }

  await createButton(selection);
};

let createSelectionTimeout: ReturnType<typeof setTimeout> | null = null;

const onTextSelect = async () => {
  if (createSelectionTimeout) {
    clearTimeout(createSelectionTimeout);
    createSelectionTimeout = null;
  }

  createSelectionTimeout = setTimeout(onCreateSelectionTimeout, 500);
};

const enableSelectionChangeDetection = () => {
  if (!contentScriptConfiguration.displayMobileLookupButton) {
    return;
  }

  document.addEventListener('selectionchange', onTextSelect, false);
};

const disableSelectionChangeDetection = () =>
  document.removeEventListener('selectionchange', onTextSelect);

const isClickableElement = (element: HTMLElement) => {
  if (
    ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'VOCABLY-POPUP'].includes(
      element.tagName
    )
  ) {
    return true;
  }

  if (element.parentElement) {
    return isClickableElement(element.parentElement);
  }

  return false;
};

const doubleClick$ = new Subject<void>();

const onMouseUp = async (event: MouseEvent) => {
  if (isClickableElement(event.target as HTMLElement)) {
    return;
  }

  enableSelectionChangeDetection();

  try {
    await api.ping();
  } catch {
    return;
  }

  destroyButton();

  const selection = window.getSelection();
  if (!isValidSelection(selection)) {
    return;
  }

  merge(doubleClick$.pipe(map(() => true)), timer(50).pipe(map(() => false)))
    .pipe(take(1))
    .subscribe(async (doubleClick) => {
      if (doubleClick) {
        return;
      }

      const settings = await api.getSettings();
      // This is the attempt to make the "Double click" functionality
      // work in Lemur browser on Android.
      // The mouse event is not trusted in Lemur on Android.
      if (
        event.isTrusted === false &&
        browser.getOS().name === 'Android' &&
        settings.showOnDoubleClick
      ) {
        destroyAllPopups();
        await autoShow({ isTouchscreen: true })();
      }

      await createButton(selection, event);
    });
};

type AutoShowOptions = {
  isTouchscreen: boolean;
};

const autoShow = (options: AutoShowOptions) => async () => {
  const settings = await api.getSettings();
  if (!settings.showOnDoubleClick) {
    return;
  }

  doubleClick$.next();

  const selection = window.getSelection();
  if (!isValidSelection(selection)) {
    return;
  }

  const detectedLanguage = await detectLanguage(selection);
  const context =
    detectedLanguage && contextLanguages.includes(detectedLanguage)
      ? getContext(selection)
      : undefined;

  await createPopup({
    detectedLanguage,
    text: getText(selection),
    context: context,
    globalRect: getGlobalRect(selection.getRangeAt(0).getBoundingClientRect()),
    isTouchscreen: options.isTouchscreen,
  });
};

const onMouseDown = async (event: MouseEvent) => {
  if (isClickableElement(event.target as HTMLElement)) {
    return;
  }

  disableSelectionChangeDetection();
  try {
    await api.ping();
  } catch {
    return;
  }

  destroyButton();
};

export const registerContentScript = async (
  {
    api: apiOptions,
    youTube: youTubeOptions,
    contentScript,
  }: RegisterContentScriptOptions = {
    api: {},
    youTube: { ytHosts: ['www.youtube.com'] },
    contentScript: {
      isFeedbackEnabled: false,
      askForRatingEnabled: false,
      displayMobileLookupButton: false,
      allowFirstTranslationCongratulation: false,
    },
  }
) => {
  configureApi(apiOptions);
  defineCustomElements();
  initYoutube(youTubeOptions);
  configureContentScript(contentScript);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mousedown', onMouseDown);

  document.addEventListener('dblclick', autoShow({ isTouchscreen: false }));

  enableSelectionChangeDetection();
};
