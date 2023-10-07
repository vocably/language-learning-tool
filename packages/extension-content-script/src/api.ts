import {
  addCard,
  analyze,
  cleanUp,
  getInternalProxyLanguage,
  getInternalSourceLanguage,
  isActive,
  isEligibleForTrial,
  isLoggedIn,
  listLanguages,
  ping,
  removeCard,
  setInternalProxyLanguage,
  setInternalSourceLanguage,
} from '@vocably/extension-messages';

export const api = {
  appBaseUrl: 'https://app.vocably.pro',
  isLoggedIn,
  getInternalProxyLanguage,
  setInternalProxyLanguage,
  getInternalSourceLanguage,
  setInternalSourceLanguage,
  analyze,
  addCard,
  removeCard,
  cleanUp,
  isActive,
  ping,
  listLanguages,
  isEligibleForTrial,
};

export type ApiConfigOptions = Partial<typeof api>;

export const configureApi = (options: Partial<ApiConfigOptions>) => {
  Object.assign(api, options);
};
