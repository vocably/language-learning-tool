import { useContext } from 'react';
import {
  PresetState,
  TranslationPresetContext,
} from './TranslationPresetContainer';

export const useTranslationPreset = (): PresetState => {
  const contextProps = useContext(TranslationPresetContext);
  return contextProps.presetState;
};
