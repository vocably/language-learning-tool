import { languageList } from '@vocably/model';
import { trimLanguage } from '@vocably/sulna';
import { get } from 'lodash-es';
import { useContext } from 'react';
import { LanguagesContext } from './languages/LanguagesContainer';

export const useCurrentLanguageName = (): string => {
  const { selectedLanguage } = useContext(LanguagesContext);
  return trimLanguage(get(languageList, selectedLanguage, ''));
};
