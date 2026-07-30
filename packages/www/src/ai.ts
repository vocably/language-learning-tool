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

const tabsRoot = document.getElementById('ai-tabs') as HTMLElement;
const tabs = Array.from(
  tabsRoot.querySelectorAll<HTMLButtonElement>('[data-ai-tab]')
);
const panels = Array.from(
  tabsRoot.querySelectorAll<HTMLElement>('[data-ai-panel]')
);

const selectTab = (name: string, focus = false) => {
  tabs.forEach((tab) => {
    const isSelected = tab.dataset.aiTab === name;
    tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    tab.tabIndex = isSelected ? 0 : -1;
    if (isSelected && focus) {
      tab.focus();
    }
  });

  panels.forEach((panel) => {
    panel.hidden = panel.dataset.aiPanel !== name;
  });
};

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab.dataset.aiTab ?? ''));

  tab.addEventListener('keydown', (e) => {
    const offset =
      e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : undefined;
    if (offset === undefined) return;
    e.preventDefault();
    const next = tabs[(index + offset + tabs.length) % tabs.length];
    selectTab(next.dataset.aiTab ?? '', true);
  });
});

const requestedTab = (queryParams.get('ai') ?? '').toLowerCase();
selectTab(
  tabs.some((tab) => tab.dataset.aiTab === requestedTab)
    ? requestedTab
    : 'chatgpt'
);
