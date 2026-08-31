import { contextLanguages } from './contextLanguages';
import { detectLanguage } from './detectLanguage';
import { getContext } from './getContext';
import { isHtmlElement } from './isHtmlElement';
import { createPopup } from './popup';
import { getGlobalRect } from './position';
import { setYouTubeStyles } from './styles';
import { extractTokens } from './tokenizer/extractTokens';
import { destroyButton } from './button';

const ytPlayerTagName = 'ytd-player';

export const getPlayerElements = (): HTMLElement[] => {
  const players = document.querySelectorAll(ytPlayerTagName);
  return Array.from(players) as HTMLElement[];
};

export type InitYouTubeOptions = {
  ytHosts: string[];
};

const unselectAll = () => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }

  selection.removeAllRanges();
  selection.empty();
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

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Alt') {
      return;
    }

    const players = getPlayerElements();
    let captionContainerList: HTMLElement[] = [];
    let captionContainersCloneList: HTMLElement[] = [];

    players.forEach((player) => {
      const captionContainer = player.querySelector(
        '#ytp-caption-window-container'
      );
      if (!isHtmlElement(captionContainer) || captionContainer.hidden) {
        return;
      }
      const videoElement = player.querySelector('video');

      if (videoElement) {
        if (!videoElement.paused) {
          return;
        }

        const onPlay = () => {
          videoElement.removeEventListener('play', onPlay);
          unselectAll();
          tearDown();
          destroyButton();
        };
        videoElement.addEventListener('play', onPlay);
      }

      player.style.userSelect = 'auto';
      player.style.webkitUserSelect = 'auto';

      const container = player.querySelector('.ytd-player');
      if (isHtmlElement(container)) {
        container.style.userSelect = 'auto';
        container.style.webkitUserSelect = 'auto';
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
          captionWindow.style.transition = `text-shadow 200ms ease-in-out`;
          setTimeout(() => {
            captionWindow.style.textShadow = `0 0 5px #28a5ff, 0 0 10px #28a5ff, 0 0 20px #28a5ff, 0 0 40px #28a5ff`;
          }, 0);

          captionWindow
            .querySelectorAll('.captions-text')
            .forEach((element) => {
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

    const onBlur = () => {
      tearDown();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        tearDown();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);

    const tearDown = () => {
      captionContainersCloneList.forEach((element) => element.remove());
      captionContainersCloneList = [];
      captionContainerList.forEach((element) => (element.hidden = false));
      captionContainerList = [];

      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
    };
  });
};
