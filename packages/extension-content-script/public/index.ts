import { isItem } from '@vocably/crud';
import { TagItem } from '@vocably/model';
import { cloneDeep, isEqual } from 'lodash-es';
import { registerContentScript } from '../src';
import { configureContentScript } from '../src/configuration';

let isUserKnowsHowToAdd = false;

let tags: TagItem[] = [
  {
    id: '1',
    created: 123,
    data: {
      title: 'Lesson 1',
    },
  },
  {
    id: '2',
    created: 234,
    data: {
      title: 'Lesson 2',
    },
  },
];

registerContentScript({
  api: {
    appBaseUrl: 'http://localhost:8030',
    isLoggedIn: () =>
      Promise.resolve(
        (document.getElementById('isLoggedIn') as HTMLInputElement).checked
      ),
    getInternalProxyLanguage: () =>
      Promise.resolve(
        (document.getElementById('hasProxyLanguage') as HTMLInputElement)
          .checked
          ? 'en'
          : null
      ),
    setInternalProxyLanguage: async () => {
      // @ts-ignore
      document.getElementById('hasProxyLanguage').checked = true;
    },
    getInternalSourceLanguage: () =>
      Promise.resolve(
        (document.getElementById('hasProxyLanguage') as HTMLInputElement)
          .checked
          ? 'nl'
          : null
      ),
    setInternalSourceLanguage: async () => {
      // @ts-ignore
      document.getElementById('hasProxyLanguage').checked = true;
    },
    getSecondsBeforeNextTranslation: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 200);
      });
    },
    isActive: () =>
      Promise.resolve(
        (document.getElementById('isActive') as HTMLInputElement).checked
      ),
    isEligibleForTrial: () =>
      Promise.resolve(
        (document.getElementById('isEligibleForTrial') as HTMLInputElement)
          .checked
      ),
    analyze: (payload) => {
      console.info('Analyze request', payload);
      return new Promise((resolve) => {
        setTimeout(() => {
          const result = JSON.parse(
            (document.getElementById('response') as HTMLTextAreaElement).value
          );

          if (payload.sourceLanguage) {
            result.value.translation.sourceLanguage = payload.sourceLanguage;
          }

          result.value.tags = tags;

          resolve(result);
        }, parseInt((document.getElementById('delay') as HTMLInputElement).value));
      });
    },
    addCard: (payload) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            value: {
              ...payload.translationCards,
              cards: payload.translationCards.cards.map((card) => {
                return isEqual(card, payload.card)
                  ? {
                      id: 'new-id',
                      created: new Date().getTime(),
                      ...payload.card,
                    }
                  : card;
              }),
            },
          });
        }, 500);
      }),
    removeCard: (payload) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            value: {
              ...payload.translationCards,
              cards: payload.translationCards.cards.map((card) => {
                return isEqual(card, payload.card)
                  ? {
                      data: payload.card.data,
                    }
                  : card;
              }),
            },
          });
        }, 500);
      }),
    cleanUp: () => Promise.resolve({ success: true, value: null }),
    ping: () => Promise.resolve('pong'),
    listLanguages: () =>
      Promise.resolve({ success: true, value: ['en', 'nl'] }),
    listTargetLanguages: () => Promise.resolve(['en', 'ru']),
    isUserKnowsHowToAdd: () => Promise.resolve(isUserKnowsHowToAdd),
    setUserKnowsHowToAdd: async (value) => {
      isUserKnowsHowToAdd = value;
    },
    getAudioPronunciation: (payload) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            value: {
              url: `https://ssl.gstatic.com/dictionary/static/sounds/20200429/hello--_gb_1.mp3`,
            },
          });
        }, 50);
      });
    },
    canPlayOffScreen: async () => {
      return false;
    },
    playAudioPronunciation: async () => {
      return {
        success: true,
        value: true,
      };
    },
    askForRating: () => {
      const askForRating = document.getElementById(
        'askForRating'
      ) as HTMLInputElement;
      return new Promise((resolve) => {
        if (askForRating.checked === false) {
          resolve(false);
          return;
        }

        setTimeout(() => resolve(true), 1000);
      });
    },
    saveAskForRatingResponse: () => Promise.resolve(null),
    getLocationLanguage: () => Promise.resolve(undefined),
    saveLocationLanguage: () => Promise.resolve(null),
    getSettings: () =>
      new Promise((resolve) => {
        resolve({
          showOnDoubleClick: (
            document.getElementById('showOnDoubleClick') as HTMLInputElement
          ).checked,

          autoPlay: (document.getElementById('playSound') as HTMLInputElement)
            .checked,

          hideSelectionButton: (
            document.getElementById('hideSelectionButton') as HTMLInputElement
          ).checked,

          showOnHotKey: (
            document.getElementById('showOnHotKey') as HTMLInputElement
          ).checked,

          autodetectLanguage: false,
        });
      }),

    updateCard: (payload) => {
      return new Promise((resolve) => {
        const translationCards = cloneDeep(payload.translationCards);

        translationCards.cards = translationCards.cards.map((existingCard) => {
          if (!isEqual(existingCard, payload.card)) {
            return existingCard;
          }

          return {
            ...payload.card,
            data: {
              ...payload.card.data,
              ...payload.data,
            },
          };
        });

        setTimeout(() => {
          resolve({
            success: true,
            value: translationCards,
          });
        }, 1000);
      });
    },

    attachTag: (payload) =>
      new Promise((resolve) => {
        const translationCards = cloneDeep(payload.translationCards);
        setTimeout(() => {
          let tag: TagItem;
          if (isItem(payload.tag)) {
            tag = payload.tag;
          } else {
            tag = {
              id: Math.random().toString(),
              data: payload.tag.data,
              created: +new Date(),
            };

            tags = [...tags, tag];
            translationCards.tags = tags;
          }

          translationCards.cards = translationCards.cards.map(
            (translationCard) => {
              return {
                ...translationCard,
                data: {
                  ...translationCard.data,
                  tags: translationCard.data.tags.map((cardTag) =>
                    cardTag.id === tag.id ? tag : cardTag
                  ),
                },
              };
            }
          );

          const card = translationCards.cards.find(
            (candidate) => isItem(candidate) && candidate.id == payload.cardId
          );

          if (card) {
            card.data.tags.push(tag);
          }

          return resolve({
            success: true,
            value: translationCards,
          });
        }, 1000);
      }),
    detachTag: (payload) =>
      new Promise((resolve) => {
        const translationCards = cloneDeep(payload.translationCards);
        setTimeout(() => {
          const card = translationCards.cards.find(
            (translationCard) =>
              isItem(translationCard) && translationCard.id === payload.cardId
          );

          if (card) {
            card.data.tags = card.data.tags.filter(
              (cardTag) => cardTag.id !== payload.tag.id
            );
          }

          resolve({
            success: true,
            value: translationCards,
          });
        }, 1000);
      }),
    updateTag: (payload) =>
      new Promise((resolve) =>
        setTimeout(() => {
          const translationCards = cloneDeep(payload.translationCards);
          tags = tags.map((tag) =>
            tag.id !== payload.tag.id ? tag : payload.tag
          );
          translationCards.tags = tags;
          translationCards.cards.forEach((card) => {
            card.data.tags = card.data.tags.map((cardTag) =>
              cardTag.id !== payload.tag.id ? cardTag : payload.tag
            );
          });

          resolve({
            success: true,
            value: translationCards,
          });
        }, 1000)
      ),
    deleteTag: (payload) =>
      new Promise((resolve) =>
        setTimeout(() => {
          const translationCards = cloneDeep(payload.translationCards);
          tags = tags.filter((t) => t.id !== payload.tag.id);
          translationCards.tags = tags;

          translationCards.cards.forEach((card) => {
            card.data.tags = card.data.tags.filter(
              (cardTag) => cardTag.id !== payload.tag.id
            );
          });

          resolve({
            success: true,
            value: translationCards,
          });
        }, 1000)
      ),
  },
  youTube: {
    ytHosts: ['localhost:8020'],
  },
  contentScript: {
    askForRatingEnabled: true,
    displayMobileLookupButton: true,
    allowFirstTranslationCongratulation: true,
  },
}).then();

document
  .getElementById('showMobileButton')
  .addEventListener('change', (event) => {
    configureContentScript({
      // @ts-ignore
      displayMobileLookupButton: event.target.checked,
    });
  });

(window as any).putCaptions = () => {
  document.querySelector(
    '.ytp-caption-segment'
  ).innerHTML = `These orbits, these arcs\n...something`;
};
