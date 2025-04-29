import { useContext } from 'react';
import { LanguagesContext } from './languages/LanguagesContainer';
import { useTranslationPreset } from './TranslationPreset/useTranslationPreset';
import { AsyncResult } from './useAsync';

export const useWelcomeRequired = (): AsyncResult<boolean> => {
  const { languages } = useContext(LanguagesContext);
  const preset = useTranslationPreset();

  if (preset.status !== 'known') {
    return {
      status: 'loading',
    };
  }

  return {
    status: 'loaded',
    value:
      languages.length === 0 ||
      !preset.preset.sourceLanguage ||
      !preset.preset.translationLanguage,
  };
};
