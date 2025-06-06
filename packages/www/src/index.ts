import '@sneas/telephone/iphone-16-max';
import '@sneas/telephone/pixel-9-pro';
import * as Bowser from 'bowser';
import './bootstrap.scss';
import './styles.scss';

const browser = Bowser.getParser(window.navigator.userAgent);
const isAndroid = browser.is('android');
const isIos = browser.is('ios');
const isChrome = browser.is('chrome') && !isAndroid && !isIos;
const isSafari = browser.is('safari') && !isAndroid && !isIos;

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
