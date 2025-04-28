import { NavigationProp } from '@react-navigation/native';
import { GoogleLanguage, languageList } from '@vocably/model';
import { FC } from 'react';
import { NativeModules, Platform, StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-paper';
import { Preset } from './TranslationPreset/TranslationPresetContainer';
import { LanguagePairs } from './TranslationPreset/useLanguagePairs';

const deviceLocale =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLanguages[0] ||
      NativeModules.SettingsManager.settings.AppleLocale
    : NativeModules.I18nManager.localeIdentifier;

const deviceLanguage = deviceLocale.substring(0, 2);

type Props = {
  navigation: NavigationProp<any>;
  preset: Preset;
  onChange: (preset: Preset) => void;
  languagePairs: LanguagePairs;
  style?: StyleProp<ViewStyle>;
};

export const TargetLanguageButton: FC<Props> = ({
  navigation,
  preset,
  onChange,
  languagePairs,
  style,
}) => {
  const onTranslationSelection = (translationLanguage: string) => {
    onChange({
      ...preset,
      translationLanguage,
    });
  };

  // @ts-ignore
  const preferredLanguages = languagePairs[preset.sourceLanguage]
    ? // @ts-ignore
      languagePairs[preset.sourceLanguage].availableLanguages
    : // @ts-ignore
    languageList[deviceLanguage]
    ? [deviceLanguage]
    : [];

  // @ts-ignore
  const preferredLanguagesTitle =
    // @ts-ignore
    !preset.translationLanguage && languageList[deviceLanguage]
      ? 'Device language'
      : 'Preferred languages';

  const selectTranslationLanguage = () => {
    navigation.navigate('LanguageSelector', {
      title: 'Mother Tongue',
      // @ts-ignore
      preferred: preferredLanguages,
      preferredTitle: preferredLanguagesTitle,
      selected: preset.translationLanguage,
      onSelect: onTranslationSelection,
    });
  };

  return (
    <Button style={style} mode="outlined" onPress={selectTranslationLanguage}>
      {preset.translationLanguage
        ? languageList[preset.translationLanguage as GoogleLanguage]
        : 'Select'}
    </Button>
  );
};
