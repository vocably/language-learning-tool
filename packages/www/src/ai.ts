import { isGoogleLanguage, languageList } from '@vocably/model';
import { trimLanguage } from '@vocably/sulna';
import { promptTranslations } from './ai/promptTranslations';

const languageSelector = document.getElementById(
  'language'
) as HTMLSelectElement;
const queryParams = new URLSearchParams(window.location.search);
const selectedLanguage = queryParams.get('l') || 'en';

languageSelector.value = selectedLanguage;

const promptSnippet = document.getElementById('prompt') as HTMLElement;
const copyButton = document.getElementById('copy-button') as HTMLElement;

promptSnippet.addEventListener('click', (e) => {
  const range = document.createRange();
  range.selectNodeContents(promptSnippet);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
});

copyButton.addEventListener('click', (e) => {
  e.stopPropagation();
  navigator.clipboard.writeText(promptSnippet.innerText);
  const icon = copyButton.querySelector('.bi');
  if (!icon) return;
  icon.classList.remove('bi-copy');
  icon.classList.add('bi-check-lg');
  setTimeout(() => {
    icon.classList.remove('bi-check-lg');
    icon.classList.add('bi-copy');
  }, 1500);
});

const changeLanguage = () => {
  const language = isGoogleLanguage(languageSelector.value)
    ? languageSelector.value
    : 'en';
  const languageName = trimLanguage(languageList[language]);

  const prompt = `///////////////////////////////////////

When I write a message in ${languageName}, respond in ${languageName} and also evaluate my grammar and suggest improvements.

Prepend evaluation as:

## ${promptTranslations[language].grammar}

Evaluation goes here
---

## ${promptTranslations[language].response}

The rest of the response goes here.

///////////////////////////////////////`;

  promptSnippet.innerText = prompt;
};

changeLanguage();
languageSelector.addEventListener('change', changeLanguage);
