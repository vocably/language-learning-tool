import { useContext } from 'react';
import { LanguagesContext } from '../languages/LanguagesContainer';
import { PresetState } from '../TranslationPreset/TranslationPresetContainer';
import { useTranslationPreset } from '../TranslationPreset/useTranslationPreset';

export const useWelcomeTranslationPreset = (): PresetState => {
  const translationPresetState = useTranslationPreset();
  const { languages } = useContext(LanguagesContext);

  if (translationPresetState.status === 'unknown') {
    return translationPresetState;
  }

  return {
    ...translationPresetState,
    preset: {
      ...translationPresetState.preset,
      sourceLanguage: languages.includes(
        translationPresetState.preset.sourceLanguage
      )
        ? translationPresetState.preset.sourceLanguage
        : '',
    },
  };
};
