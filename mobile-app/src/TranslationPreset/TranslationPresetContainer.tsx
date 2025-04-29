import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { updateLanguagePairs } from './languagePairs';
import { LanguagePairs, useLanguagePairs } from './useLanguagePairs';
import { useTranslationPresetSelectedLanguage } from './useTranslationPresetSelectedLanguage';

export type Preset = {
  sourceLanguage: string;
  translationLanguage: string;
  isReverse: boolean;
};

type PresetKnown = {
  status: 'known';
  preset: Preset;
  languagePairs: LanguagePairs;
  setPreset: (preset: Preset) => Promise<unknown>;
};

type PresetUnknown = {
  status: 'unknown';
};

export type PresetState = PresetKnown | PresetUnknown;

export type TranslationPresetContextProps = {
  presetState: PresetState;
};

export const TranslationPresetContext =
  createContext<TranslationPresetContextProps>({
    presetState: {
      status: 'unknown',
    },
  });

export const TranslationPresetContainer: FC<PropsWithChildren> = ({
  children,
}) => {
  const selectedLanguageResult = useTranslationPresetSelectedLanguage();
  const [languagePairsResult, saveLanguagePairs] = useLanguagePairs();
  const [preset, storePreset] = useState<Preset>();

  const setPreset = async (newPreset: Preset) => {
    if (selectedLanguageResult.status !== 'loaded') {
      return;
    }

    if (languagePairsResult.status !== 'loaded') {
      return;
    }

    if (!preset || newPreset.sourceLanguage !== preset.sourceLanguage) {
      selectedLanguageResult.value.saveSelectedLanguage(
        newPreset.sourceLanguage
      );
    }

    const languagePairs = updateLanguagePairs(
      languagePairsResult.value,
      newPreset
    );

    saveLanguagePairs(languagePairs);

    storePreset(newPreset);
  };

  useEffect(() => {
    if (selectedLanguageResult.status !== 'loaded') {
      return;
    }

    if (languagePairsResult.status !== 'loaded') {
      return;
    }

    if (preset) {
      return;
    }

    storePreset({
      sourceLanguage: selectedLanguageResult.value.selectedLanguage,
      translationLanguage:
        // @ts-ignore
        languagePairsResult.value[selectedLanguageResult.value.selectedLanguage]
          ? // @ts-ignore
            languagePairsResult.value[
              selectedLanguageResult.value.selectedLanguage
            ].translationLanguage
          : '',
      isReverse: true,
    });
  }, [selectedLanguageResult, languagePairsResult, preset]);

  const presetState: PresetState =
    languagePairsResult.status === 'loaded' && preset
      ? {
          status: 'known',
          preset,
          setPreset,
          languagePairs: languagePairsResult.value,
        }
      : {
          status: 'unknown',
        };

  return (
    <TranslationPresetContext.Provider
      value={{
        presetState,
      }}
    >
      {children}
    </TranslationPresetContext.Provider>
  );
};
