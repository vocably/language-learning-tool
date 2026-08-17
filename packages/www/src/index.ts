import { initializePaddle } from '@paddle/paddle-js';
import '@sneas/telephone/iphone-16-max';
import '@sneas/telephone/pixel-9-pro';
import { isGoogleLanguage } from '@vocably/model';
import * as Bowser from 'bowser';
import { track } from './analytics';
import './bootstrap.scss';
import './styles.scss';
import { searchConfig } from './constants';
import { words } from './search/words';

const browser = Bowser.getParser(window.navigator.userAgent);
const isAndroid = browser.is('android');
const isIos = browser.is('ios');
const isChrome = browser.is('chrome') && !isAndroid && !isIos;
const isSafari = browser.is('safari') && !isAndroid && !isIos;

//@ts-ignore
window.trackEvent = track;

document.querySelectorAll('.show-other').forEach((el) => {
  if (isChrome || isSafari || isAndroid || isIos) {
    el.remove();
  } else {
    el.classList.remove('show-other');
  }
});

document.querySelectorAll('.show-any').forEach((el) => {
  if (!(isChrome || isSafari || isAndroid || isIos)) {
    el.remove();
  } else {
    el.classList.remove('show-any');
  }
});

document.querySelectorAll('.show-chrome').forEach((el) => {
  if (!isChrome) {
    el.remove();
  } else {
    el.classList.remove('show-chrome');
  }
});

document.querySelectorAll('.show-safari').forEach((el) => {
  if (!isSafari) {
    el.remove();
  } else {
    el.classList.remove('show-safari');
  }
});

document.querySelectorAll('.hide-chrome').forEach((el) => {
  if (isChrome) {
    el.remove();
  } else {
    el.classList.remove('hide-chrome');
  }
});

document.querySelectorAll('.hide-safari').forEach((el) => {
  if (isSafari) {
    el.remove();
  } else {
    el.classList.remove('hide-safari');
  }
});

document.querySelectorAll('.hide-ios').forEach((el) => {
  if (isIos) {
    el.remove();
  } else {
    el.classList.remove('hide-ios');
  }
});

document.querySelectorAll('.show-ios').forEach((el) => {
  if (!isIos) {
    el.remove();
  } else {
    el.classList.remove('show-ios');
  }
});

document.querySelectorAll('.hide-android').forEach((el) => {
  if (isAndroid) {
    el.remove();
  } else {
    el.classList.remove('hide-android');
  }
});

document.querySelectorAll('.hide-other').forEach((el) => {
  if (!(isChrome || isSafari || isAndroid || isIos)) {
    el.remove();
  } else {
    el.classList.remove('hide-other');
  }
});

document.querySelectorAll('.show-android').forEach((el) => {
  if (!isAndroid) {
    el.remove();
  } else {
    el.classList.remove('show-android');
  }
});

if (document.getElementById('automatically-download-mobile-app')) {
  const progress = document.getElementById('mobile-app-progress');
  const links = document.getElementById('mobile-app-links');

  if (isAndroid) {
    document.getElementById('mobile-app-ios-link').classList.add('d-none');
  } else if (isIos) {
    window.location.href =
      'https://apps.apple.com/app/vocably-pro-language-cards/id1641258757';
    document.getElementById('mobile-app-android-link').classList.add('d-none');
  }

  progress.classList.add('d-none');
  links.classList.remove('d-none');
}

if (
  browser.satisfies({ desktop: { chrome: '>90', edge: '>90', firefox: '>0' } })
) {
  document.querySelectorAll('.chrome-cta').forEach((el) => {
    el.classList.remove('d-none');
  });
} else if (browser.satisfies({ desktop: { safari: '>14' } })) {
  document.querySelectorAll('.safari-cta').forEach((el) => {
    el.classList.remove('d-none');
  });
} else {
  document.querySelectorAll('.cta-else').forEach((el) => {
    el.classList.remove('d-none');
  });
}

var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);

tooltipTriggerList.map(function (tooltipTriggerEl) {
  // @ts-ignore
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

if (!browser.satisfies({ safari: '>=0' })) {
  document
    .querySelectorAll('.cta-button')
    .forEach((button) => button.classList.add('cta-button-non-safari'));
}

// Search form

const getSourceLanguage = () => {
  if (isGoogleLanguage(window['searchFormSourceLanguage'])) {
    return window['searchFormSourceLanguage'];
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has('l') && isGoogleLanguage(params.get('l') ?? '')) {
    return params.get('l');
  }
  return (
    localStorage.getItem(searchConfig.sourceLanguageLocalStorageKey) ?? 'en'
  );
};

const getTargetLanguage = () => {
  const localStorageTargetLanguage = localStorage.getItem(
    searchConfig.targetLanguageLocalStorageKey
  );
  if (localStorageTargetLanguage) {
    return localStorageTargetLanguage;
  }

  const navigatorLanguage = navigator.languages.find((language) =>
    isGoogleLanguage(language)
  );
  if (navigatorLanguage) {
    return navigatorLanguage;
  }

  const anotherNavigatorLanguage = navigator.language.split('-')[0];
  if (isGoogleLanguage(anotherNavigatorLanguage)) {
    return anotherNavigatorLanguage;
  }

  return 'en';
};

document
  .querySelectorAll('#searchForm')
  .forEach((searchForm: HTMLFormElement) => {
    const sourceLanguageSelect = searchForm.querySelector(
      '[name=sourceLanguage]'
    ) as HTMLSelectElement;
    const targetLanguageSelect = searchForm.querySelector(
      '[name=targetLanguage]'
    ) as HTMLSelectElement;

    sourceLanguageSelect.value = getSourceLanguage();
    let targetLanguage = getTargetLanguage();
    if (targetLanguage === 'en-GB' && sourceLanguageSelect.value === 'en') {
      targetLanguage = 'en';
    }
    targetLanguageSelect.value = targetLanguage;
    const textInput = searchForm.querySelector(
      '[name=text]'
    ) as HTMLInputElement;

    const updatePlaceholder = () => {
      if (window.innerWidth < 600) {
        textInput.placeholder = 'Search...';
        return;
      }

      if (sourceLanguageSelect.value === targetLanguageSelect.value) {
        textInput.placeholder = 'Search for any word...';
        return;
      }

      textInput.placeholder = 'Search for any word or phrase...';
    };

    updatePlaceholder();

    searchForm
      .querySelectorAll('.language-selector-wrapper')
      .forEach((languageSelectorWrapper) => {
        const label = languageSelectorWrapper.querySelector('.label');
        const select = languageSelectorWrapper.querySelector('select');

        const setLabel = () => {
          label.innerHTML = select.value.slice(0, 2);
        };

        select.addEventListener('change', () => {
          setLabel();
          updatePlaceholder();
        });

        setLabel();
      });

    const exampleContainer = searchForm.querySelector('.search-form-hint');
    const sourceExampleButton = searchForm.querySelector(
      '[data-search-source-example]'
    ) as HTMLButtonElement;
    const translationExampleContainer = searchForm.querySelector(
      `[data-search-relevant-target]`
    );
    const targetExampleButton = searchForm.querySelector(
      '[data-search-target-example]'
    ) as HTMLButtonElement;

    const onLanguageChange = () => {
      if (
        !isGoogleLanguage(sourceLanguageSelect.value) ||
        !isGoogleLanguage(targetLanguageSelect.value)
      ) {
        return;
      }
      const isRelevantTranslationLanguage =
        sourceLanguageSelect.value !== targetLanguageSelect.value;
      sourceExampleButton.innerHTML = words[sourceLanguageSelect.value];
      targetExampleButton.innerHTML = words[targetLanguageSelect.value];
      if (!isRelevantTranslationLanguage) {
        translationExampleContainer.classList.add('d-none');
        targetExampleButton.disabled = true;
      } else {
        translationExampleContainer.classList.remove('d-none');
        targetExampleButton.disabled = false;
      }
      exampleContainer.classList.remove('invisible');
    };

    onLanguageChange();
    sourceLanguageSelect.addEventListener('change', onLanguageChange);
    targetLanguageSelect.addEventListener('change', onLanguageChange);

    const onExampleClick = (e: Event) => {
      const word = e.target['innerHTML'];
      if (!word) {
        return;
      }

      textInput.value = word;
      searchForm.submit();
    };

    sourceExampleButton.addEventListener('click', onExampleClick);
    targetExampleButton.addEventListener('click', onExampleClick);
  });

initializePaddle({
  token: window['paddleClientSideToken'],
  environment: window['paddleClientSideToken'].startsWith('test')
    ? 'sandbox'
    : 'production',
  debug: window['paddleClientSideToken'].startsWith('test'),
}).then(async (Paddle) => {
  const { data } = await Paddle.PricePreview({
    items: [
      {
        priceId: window['paddleMonthlyPriceId'],
        quantity: 1,
      },
      {
        priceId: window['paddleYearlyPriceId'],
        quantity: 1,
      },
      {
        priceId: window['paddleLifetimePriceId'],
        quantity: 1,
      },
    ],
  });

  const {
    details: {
      lineItems: [monthlyItem, yearlyItem, lifetimeItem],
    },
  } = data;

  document
    .querySelectorAll('[data-monthly-price]')
    .forEach(
      (element) => (element.innerHTML = monthlyItem.formattedTotals.total)
    );

  document
    .querySelectorAll('[data-yearly-price]')
    .forEach(
      (element) => (element.innerHTML = yearlyItem.formattedTotals.total)
    );

  document
    .querySelectorAll('[data-lifetime-price]')
    .forEach(
      (element) => (element.innerHTML = lifetimeItem.formattedTotals.total)
    );
});
