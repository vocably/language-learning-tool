import { Result, TagItem, TranslationCards } from '@vocably/model';

export { Components, JSX } from './components';

const simpletonTranslationResult: Result<TranslationCards> = {
  success: true,
  value: {
    explanation: '',
    source: 'gemaakt',
    translation: {
      source: 'gemaakt',
      sourceLanguage: 'nl',
      target: 'created',
      targetLanguage: 'en',
    },
    cards: [
      {
        data: {
          language: 'nl',
          source: 'gemaakt',
          ipa: "xə'mak",
          translation: 'created, done',
          definition: '',
          partOfSpeech: '',
          g: 'n',
          tags: [],
        },
      },
    ],
    tags: [],
    collectionLength: 50,
  },
};

const successfulTranslationResult: Result<TranslationCards> = {
  success: true,
  value: {
    collectionLength: 50,
    explanation: '',
    source: 'gemaakt',
    translation: {
      source: 'gemaakt',
      sourceLanguage: 'nl',
      target: 'created',
      targetLanguage: 'en',
    },
    cards: [
      {
        id: 'NYS4L',
        created: 1639827779683,
        data: {
          language: 'nl',
          source: 'maken',
          ipa: "'makə(n)",
          example: '* winst maken\n* De klok is weer gemaakt.',
          definition:
            '* (iets dat nog niet bestond) laten ontstaan\n* (iets dat kapot is) zorgen dat het weer heel is',
          translation: 'to make',
          partOfSpeech: 'verb',
          tags: [
            { id: '1', data: { title: 'Lesson 1' }, created: 123 },
            { id: '2', data: { title: 'Lesson 2' }, created: 234 },
          ],
        },
      },
      {
        data: {
          language: 'nl',
          source: 'gemaakt',
          ipa: "xə'mak",
          example: 'Bij een gemaakte glimlach lachen onze ogen niet mee.',
          definition: 'als iets niet natuurlijk is of gebeurt',
          translation: 'created, done',
          partOfSpeech: 'adjective',
          tags: [],
        },
      },
    ],
    tags: [
      { id: '1', data: { title: 'Lesson 1' }, created: 123 },
      { id: '2', data: { title: 'Lesson 2' }, created: 234 },
      { id: '3', data: { title: 'Lesson 3' }, created: 345 },
    ],
  },
};

const englishTranslationResult: Result<TranslationCards> = {
  success: true,
  value: {
    collectionLength: 50,
    explanation: '',
    cards: [
      {
        data: {
          language: 'en',
          source: 'bring',
          example:
            '* Bring your swimsuit.\\n* March usually brings rain.\\n* We added another ten, bringing the number to 104.',
          definition:
            '* to have something or somebody with you when you come\n* to make sth come to a place\n* to result in a new total of',
          translation: '',
          partOfSpeech: 'verb',
          interval: 0,
          repetition: 0,
          eFactor: 2.5,
          dueDate: 1651622400000,
          tags: [],
        },
        id: 'ifu0J',
        created: 1651656677053,
      },
    ],
    source: 'bringing',
    translation: {
      source: 'bringing',
      sourceLanguage: 'en',
      target: 'bringing',
      targetLanguage: 'en',
    },
    tags: [],
  },
};

// ---

const translationFirstTime = document.getElementById(
  'translationFirstTime'
) as HTMLVocablyTranslationElement;

translationFirstTime.result = {
  success: true,
  value: {
    collectionLength: 50,
    source: 'Alice was beginning to get very tired of sitting',
    translation: {
      source: 'Alice was beginning to get very tired of sitting',
      sourceLanguage: 'en',
      target: 'Алиса начала сильно уставать сидеть',
      targetLanguage: 'ru',
    },
    explanation:
      'При переводе английского предложения на русский язык следует обратить внимание на несколько моментов:\n' +
      '\n' +
      '1. **Временная форма**: В английском языке используется прошедшее продолженное время (Past Continuous) "was beginning to get". В русском языке это может быть передано с помощью конструкции "начала уставать".\n' +
      '\n' +
      '2. **Степень усталости**: В английском используется усиление "very tired", что можно перевести как "очень устала".\n' +
      '\n' +
      '3. **Глагол "сидеть"**: В английском "of sitting" указывает на действие, от которого устала Алиса. В русском языке это может быть выражено через деепричастие "сидя" или через конструкцию "от сидения".\n' +
      '\n' +
      'Итоговый перевод может звучать как: "Алиса начала очень уставать от сидения."',
    cards: [
      {
        data: {
          language: 'en',
          source: 'Alice was beginning to get very tired of sitting',
          translation: 'Алиса начала сильно уставать сидеть',
          definition: '',
          partOfSpeech: '',
          tags: [],
        },
      },
    ],
    tags: [],
  },
};
translationFirstTime.showSaveHint = true;

// -----

const editTagForm = document.getElementById(
  'editTagForm'
) as HTMLVocablyTagFormElement;
editTagForm.tagItem = {
  id: '1',
  data: {
    title: 'Luke Skywalker',
  },
  created: 123,
};

// ----

const translationWithTagMenu = document.getElementById(
  'translationWithTagMenu'
) as HTMLVocablyTranslationElement;

translationWithTagMenu.result = successfulTranslationResult;

// ----

const menu = document.getElementById('menu') as HTMLVocablyTagsMenuElement;
menu.existingItems = [
  { id: '1', data: { title: 'Luke Skywalker' }, created: 123 },
  { id: '2', data: { title: 'Darth Vader' }, created: 123 },
  { id: '3', data: { title: 'Leia Organa' }, created: 123 },
  { id: '4', data: { title: 'Han Solo' }, created: 123 },
  { id: '5', data: { title: 'Yoda' }, created: 123 },
  { id: '6', data: { title: 'Obi-Wan Kenobi' }, created: 123 },
  { id: '7', data: { title: 'Palpatine' }, created: 123 },
  { id: '8', data: { title: 'Chewbacca' }, created: 123 },
  { id: '9', data: { title: 'Boba Fett' }, created: 123 },
  { id: '10', data: { title: 'Padmé Amidala' }, created: 123 },
  { id: '11', data: { title: 'Anakin Skywalker' }, created: 123 },
  { id: '12', data: { title: 'Mace Windu' }, created: 123 },
];
menu.selectedItems = ['2', '3', '4'];

menu.addEventListener('tagClick', (event) => {
  // @ts-ignore
  const tag = event.detail as TagItem;
  if (menu.selectedItems.includes(tag.id)) {
    menu.selectedItems = menu.selectedItems.filter(
      (itemId) => itemId !== tag.id
    );
  } else {
    menu.selectedItems = [tag.id, ...menu.selectedItems];
  }
});

// ----

const popup = document.getElementById('popup');
const closed = document.getElementById('closed');

popup.addEventListener('close', () => {
  closed.classList.remove('d-none');
  setTimeout(() => {
    closed.classList.add('d-none');
  }, 2000);
});

// ---

const simpletonTranslation = document.getElementById(
  'simpletonTranslation'
) as HTMLVocablyTranslationElement;
simpletonTranslation.existingSourceLanguages = ['en', 'nl'];
simpletonTranslation.result = simpletonTranslationResult;
simpletonTranslation.canCongratulate = true;
simpletonTranslation.askForRating = true;
simpletonTranslation.extensionPlatform = {
  name: 'Chrome Web Store',
  url: 'https://chrome.google.com/webstore/detail/vocably/baocigmmhhdemijfjnjdidbkfgpgogmb',
  platform: 'chromeExtension',
  canPay: true,
};

// ---

const paywaallTranslation = document.getElementById(
  'paywallTranslation'
) as HTMLVocablyTranslationElement;
paywaallTranslation.existingSourceLanguages = ['en', 'nl'];
paywaallTranslation.result = simpletonTranslationResult;
paywaallTranslation.canCongratulate = true;
paywaallTranslation.askForRating = true;
paywaallTranslation.extensionPlatform = {
  name: 'Chrome Web Store',
  url: 'https://chrome.google.com/webstore/detail/vocably/baocigmmhhdemijfjnjdidbkfgpgogmb',
  platform: 'chromeExtension',
  canPay: true,
};
paywaallTranslation.maxCards = 50;

// ---

(
  document.getElementById(
    'translationEnglishSuccess'
  ) as HTMLVocablyTranslationElement
).result = englishTranslationResult;

// ----

const translationReload = document.getElementById(
  'translationReload'
) as HTMLVocablyTranslationElement;

translationReload.result = successfulTranslationResult;
translationReload.loading = true;

// ---

const translationError = document.getElementById(
  'translationError'
) as HTMLVocablyTranslationElement;

translationError.result = {
  success: false,
  errorCode: 'LANGUAGE_DECK_LOAD_ERROR',
  reason: 'Unable to fetch cards',
  extra: { a: 'b' },
};

// ----

const waitingCheckbox = document.getElementById(
  'languageWaiting'
) as HTMLInputElement;
const languageForm = document.getElementById(
  'languageForm'
) as HTMLVocablyLanguageElement;

waitingCheckbox.addEventListener('change', () => {
  languageForm.waiting = waitingCheckbox.checked;
});

// ---

const translationAskForRating = document.getElementById(
  'translationAskForRating'
) as HTMLVocablyTranslationElement;

translationAskForRating.result = successfulTranslationResult;
translationAskForRating.showSaveHint = false;
translationAskForRating.askForRating = true;
translationAskForRating.extensionPlatform = {
  name: 'Chrome Web Store',
  url: 'https://chrome.google.com/webstore/detail/vocably/baocigmmhhdemijfjnjdidbkfgpgogmb',
  platform: 'chromeExtension',
  canPay: true,
};

// ----

const translationSuccess = document.getElementById(
  'translationSuccess'
) as HTMLVocablyTranslationElement;
translationSuccess.existingSourceLanguages = ['en', 'nl'];
translationSuccess.result = successfulTranslationResult;
translationSuccess.canCongratulate = true;

// ----
