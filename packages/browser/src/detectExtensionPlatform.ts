import { browser } from './browser';

type ExtensionPlatform = {
  url: string;
  name: string;
  platform: 'chromeExtension' | 'safariExtension' | 'iosSafariExtension';
  canPay: boolean;
};

export const detectExtensionPlatform = (): ExtensionPlatform => {
  if (
    browser.satisfies({
      macos: {
        safari: '>10.1',
      },
    })
  ) {
    return {
      url: 'https://apps.apple.com/app/id6464076425',
      name: 'App Store',
      platform: 'safariExtension',
      canPay: false,
    };
  }

  if (
    browser.getOSName(true) === 'ios' &&
    browser.getBrowserName(true) === 'safari' &&
    !browser.getPlatformType(true).includes('desktop')
  ) {
    return {
      url: 'https://apps.apple.com/app/vocably-pro-language-cards/id1641258757',
      name: 'App Store',
      platform: 'iosSafariExtension',
      canPay: true,
    };
  }

  return {
    url: 'https://chrome.google.com/webstore/detail/vocably/baocigmmhhdemijfjnjdidbkfgpgogmb',
    name: 'Chrome Web Store',
    platform: 'chromeExtension',
    canPay: true,
  };
};
