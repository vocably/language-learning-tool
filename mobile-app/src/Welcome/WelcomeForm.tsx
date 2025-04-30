import { FC, useContext } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { WelcomeScrollView } from './WelcomeScrollView';
import { Button, Divider, Text, useTheme } from 'react-native-paper';
import { SourceLanguageButton } from '../SourceLanguageButton';
import { useNavigation } from '@react-navigation/native';
import { useTranslationPreset } from '../TranslationPreset/useTranslationPreset';
import { Preset } from '../TranslationPreset/TranslationPresetContainer';
import { LanguagesContext } from '../languages/LanguagesContainer';
import { TargetLanguageButton } from '../TargetLanguageButton';

type Props = {};

export const WelcomeForm: FC<Props> = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const translationPresetState = useTranslationPreset();
  const { languages, selectLanguage, addNewLanguage } =
    useContext(LanguagesContext);

  if (translationPresetState.status === 'unknown') {
    return <></>;
  }

  const onSourceLanguageChange = async (preset: Preset) => {
    await translationPresetState.setPreset(preset);
    if (languages.includes(preset.sourceLanguage)) {
      await selectLanguage(preset.sourceLanguage);
      return;
    }

    return addNewLanguage(preset.sourceLanguage);
  };

  return (
    <WelcomeScrollView>
      <View
        style={{
          maxWidth: 400,
          gap: 16,
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 24, marginBottom: 24 }}>
          To get started, please answer a few questions.
        </Text>

        <View
          style={{
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: theme.colors.onBackground,
            }}
          >
            What language do you study?
          </Text>
          <View style={{ width: '100%' }}>
            <SourceLanguageButton
              navigation={navigation}
              preset={translationPresetState.preset}
              onChange={onSourceLanguageChange}
              languagePairs={translationPresetState.languagePairs}
              emptyText="Select"
            />
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text>
            You can learn multiple languages. For now, just pick one to get
            started.
          </Text>
        </View>
        {translationPresetState.preset.sourceLanguage && (
          <Animated.View
            entering={FadeInDown}
            style={{
              gap: 16,
            }}
          >
            <Divider style={{ width: '100%' }} />
            <View
              style={{
                alignItems: 'center',
                gap: 16,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: theme.colors.onBackground,
                }}
              >
                What is your mother{'\u00A0'}tongue?
              </Text>
              <View style={{ width: '100%' }}>
                <TargetLanguageButton
                  navigation={navigation}
                  preset={translationPresetState.preset}
                  onChange={translationPresetState.setPreset}
                  languagePairs={translationPresetState.languagePairs}
                />
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </WelcomeScrollView>
  );
};
