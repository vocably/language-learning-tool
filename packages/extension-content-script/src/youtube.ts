import { contextLanguages } from './contextLanguages';
import { detectLanguage } from './detectLanguage';
import { getContext } from './getContext';
import { isHtmlElement } from './isHtmlElement';
import { createPopup } from './popup';
import { getGlobalRect } from './position';
import { setYouTubeStyles } from './styles';
import { extractTokens } from './tokenizer/extractTokens';

const ytPlayerTagName = 'ytd-player';

export const getPlayerElements = (): HTMLElement[] => {
  const players = document.querySelectorAll(ytPlayerTagName);
  return Array.from(players) as HTMLElement[];
};

export type InitYouTubeOptions = {
  ytHosts: string[];
};

const handlePlayerElement = (player: HTMLElement): (() => void) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList') return;
      if (!mutation.target) return;
      if (!isHtmlElement(mutation.target)) return;
      if (!mutation.target.classList) return;
      if (!mutation.target.classList.contains('ytp-caption-segment')) return;

      mutation.addedNodes.forEach((node) => {
        if (isHtmlElement(node) && node.classList.contains('replaced')) return;

        const tokens = extractTokens(node.textContent ?? '');

        if (tokens === false) {
          return;
        }

        const span = document.createElement('span');
        span.classList.add('replaced');

        tokens.forEach((token, index) => {
          if (token.type !== 'word') {
            const punctuationSpan = document.createElement('span');
            punctuationSpan.innerText = token.text;
            span.append(punctuationSpan);
            return;
          }

          const anchor = document.createElement('span');
          anchor.classList.add('vocably-word');
          anchor.innerText = token.text;

          anchor.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
          });

          anchor.addEventListener('mouseup', (e) => {
            e.preventDefault();
            e.stopPropagation();
          });

          anchor.addEventListener('click', async () => {
            const detectedLanguage = await detectLanguage(anchor);
            await createPopup({
              detectedLanguage,
              text: anchor.textContent ?? '',
              globalRect: getGlobalRect(anchor.getBoundingClientRect()),
              isTouchscreen: false,
              initiator: 'youtube',
              context:
                detectedLanguage && contextLanguages.includes(detectedLanguage)
                  ? getContext(anchor)
                  : undefined,
            });
          });

          span.append(anchor);
        });

        if ((node as any).parentNode) {
          const captionWindow = (node as any).parentNode.closest(
            '.caption-window'
          );
          captionWindow.removeAttribute('tabindex');
        }

        if ((node as any).replaceWith) {
          (node as any).replaceWith(span);
        }
      });
    });
  });

  observer.observe(player, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  return () => {
    observer.disconnect();
  };
};

type SelectableCaptions = {
  captionContainerList: HTMLElement[];
  captionContainersCloneList: HTMLElement[];
};

const makeCaptionsSelectable = (): SelectableCaptions => {
  const captionContainerList: HTMLElement[] = [];
  const captionContainersCloneList: HTMLElement[] = [];

  getPlayerElements().forEach((player) => {
    player.style.userSelect = 'auto';
    player.style.webkitUserSelect = 'auto';

    const container = player.querySelector('.ytd-player');
    if (isHtmlElement(container)) {
      container.style.userSelect = 'auto';
      container.style.webkitUserSelect = 'auto';
    }

    const captionContainer = player.querySelector(
      '#ytp-caption-window-container'
    );
    if (!isHtmlElement(captionContainer)) {
      return;
    }

    captionContainer.style.userSelect = 'auto';
    captionContainer.style.webkitUserSelect = 'auto';

    const captionContainerClone = captionContainer.cloneNode(
      true
    ) as HTMLElement;
    captionContainerList.push(captionContainer);
    captionContainersCloneList.push(captionContainerClone);
    captionContainer.hidden = true;
    captionContainer.before(captionContainerClone);
    captionContainerClone
      .querySelectorAll('.caption-window')
      .forEach((captionWindow) => {
        if (!isHtmlElement(captionWindow)) {
          return;
        }

        captionWindow.draggable = false;
        captionWindow.style.userSelect = 'auto';
        captionWindow.style.webkitUserSelect = 'auto';

        captionWindow.querySelectorAll('.captions-text').forEach((element) => {
          if (!isHtmlElement(element)) {
            return;
          }

          element.style.userSelect = 'auto';
          element.style.webkitUserSelect = 'auto';
        });

        captionWindow
          .querySelectorAll('.ytp-caption-segment')
          .forEach((segment) => {
            if (!isHtmlElement(segment)) {
              return;
            }

            segment.style.cursor = 'text';
          });

        captionWindow
          .querySelectorAll('.vocably-word')
          .forEach((word) => word.classList.remove('vocably-word'));
      });
  });

  return { captionContainerList, captionContainersCloneList };
};

const hasTextSelection = (): boolean => {
  const selection = window.getSelection();

  if (!selection || selection.isCollapsed) {
    return false;
  }

  return selection.toString().trim() !== '';
};

export const initYoutube = async (options: InitYouTubeOptions) => {
  if (!options.ytHosts.includes(window.location.host)) {
    return;
  }

  setYouTubeStyles();

  getPlayerElements().forEach((player) => {
    handlePlayerElement(player);
  });

  const playerObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!isHtmlElement(node)) {
          return;
        }

        if (node.tagName === ytPlayerTagName) {
          handlePlayerElement(node);
          return;
        }

        const players = node.getElementsByTagName(ytPlayerTagName);
        for (const player of players) {
          if (!isHtmlElement(player)) {
            continue;
          }
          handlePlayerElement(player);
        }
      });
    });
  });

  playerObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  let isAltDown = false;
  let isMouseDown = false;
  let selectableCaptions: SelectableCaptions | null = null;
  let tearDownTimeout: ReturnType<typeof setTimeout> | null = null;

  const cancelScheduledTearDown = () => {
    if (tearDownTimeout === null) {
      return;
    }

    clearTimeout(tearDownTimeout);
    tearDownTimeout = null;
  };

  const setUp = () => {
    cancelScheduledTearDown();

    if (selectableCaptions !== null) {
      return;
    }

    selectableCaptions = makeCaptionsSelectable();
  };

  const tearDown = () => {
    cancelScheduledTearDown();

    isAltDown = false;
    isMouseDown = false;

    if (selectableCaptions === null) {
      return;
    }

    selectableCaptions.captionContainersCloneList.forEach((element) =>
      element.remove()
    );
    selectableCaptions.captionContainerList.forEach(
      (element) => (element.hidden = false)
    );

    selectableCaptions = null;
  };

  const isInUse = (): boolean => isAltDown || isMouseDown || hasTextSelection();

  const scheduleTearDown = () => {
    cancelScheduledTearDown();

    if (selectableCaptions === null || isInUse()) {
      return;
    }

    tearDownTimeout = setTimeout(() => {
      tearDownTimeout = null;

      if (isInUse()) {
        return;
      }

      tearDown();
    }, 100);
  };

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Alt' || isAltDown) {
      return;
    }

    isAltDown = true;
    setUp();
  });

  document.addEventListener('keyup', (e) => {
    if (e.key !== 'Alt' || !isAltDown) {
      return;
    }

    isAltDown = false;
    scheduleTearDown();
  });

  document.addEventListener('mousedown', (e) => {
    if (e.button !== 0) {
      return;
    }

    isMouseDown = true;
  });

  document.addEventListener('mouseup', (e) => {
    if (e.button !== 0) {
      return;
    }

    isMouseDown = false;
    scheduleTearDown();
  });

  document.addEventListener('selectionchange', () => {
    scheduleTearDown();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      tearDown();
    }
  });

  window.addEventListener('blur', () => {
    tearDown();
  });
};
