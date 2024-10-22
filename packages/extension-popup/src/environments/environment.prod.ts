import {
  getInternalSourceLanguage,
  getSettings,
  isLoggedIn,
  setSettings,
} from '@vocably/extension-messages';
import { merge } from 'lodash-es';
import { environmentLocal } from './environmentLocal';

export const environment = merge(environmentLocal, {
  production: true,
  getSettings: getSettings,
  setSettings: setSettings,
  isLoggedIn: isLoggedIn,
  getInternalSourceLanguage: getInternalSourceLanguage,
});
