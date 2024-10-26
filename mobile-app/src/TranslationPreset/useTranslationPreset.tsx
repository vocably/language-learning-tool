import { useContext } from 'react';
import { Preset, TranslationPresetContext } from './TranslationPresetContainer';
import { LanguagePairs } from './useLanguagePairs';

export const useTranslationPreset = (): [
  preset: Preset,
  languagePairs: LanguagePairs,
  setPreset: (preset: Preset) => Promise<void>
] => {
  const contextProps = useContext(TranslationPresetContext);
  return [
    contextProps.preset,
    contextProps.languagePairs,
    contextProps.setPreset,
  ];
};
