import { NavigationProp } from '@react-navigation/native';
import { postOnboardingAction } from '@vocably/api';
import { GoogleLanguage } from '@vocably/model';
import { usePostHog } from 'posthog-react-native';
import React, { FC, useContext, useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Divider, Text, useTheme } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getItem, setItem } from './asyncAppStorage';
import { facility } from './facility';
import { LanguagesContext } from './languages/LanguagesContainer';
import { OnboardingSlider } from './OnboardingSlider';
import { SourceLanguageButton } from './SourceLanguageButton';
import { Displayer, DisplayerRef } from './study/Displayer';
import { TargetLanguageButton } from './TargetLanguageButton';
import { Preset } from './TranslationPreset/TranslationPresetContainer';
import { useTranslationPreset } from './TranslationPreset/useTranslationPreset';
import { useAsync } from './useAsync';

type Props = {
  navigation: NavigationProp<any>;
};

type OnboardingStep = 'form' | 'faq';
const getOnboardingStepFromStorage = (): Promise<OnboardingStep> =>
  getItem('onboardingStep').then((value) => {
    if (value === 'faq') {
      return 'faq';
    }

    return 'form';
  });

const setOnboardingStepToStorage = (onboardingStep: OnboardingStep) =>
  setItem('onboardingStep', onboardingStep);

export const WelcomeScreen: FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [onboardingStep, setOnboardingStep] = useAsync(
    getOnboardingStepFromStorage,
    setOnboardingStepToStorage
  );
  const translationPresetState = useTranslationPreset();
  const insets = useSafeAreaInsets();
  const onboardingDisplayerRef = useRef<DisplayerRef>(null);

  const { languages, selectedLanguage, selectLanguage, addNewLanguage } =
    useContext(LanguagesContext);

  const postHog = usePostHog();

  const isNextButtonVisible =
    translationPresetState.status === 'known' &&
    translationPresetState.preset.translationLanguage &&
    translationPresetState.preset.sourceLanguage;

  useEffect(() => {
    postHog.capture('welcome');
  }, []);

  if (onboardingStep.status !== 'loaded') {
    return <></>;
  }

  const showSlider =
    onboardingStep.value === 'faq' &&
    translationPresetState.status === 'known' &&
    translationPresetState.preset.sourceLanguage &&
    translationPresetState.preset.translationLanguage;

  const showWelcomeForm = onboardingStep.value === 'form' || !showSlider;

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
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
      }}
    >
      {showWelcomeForm && (
        <Displayer ref={onboardingDisplayerRef} style={{ flexGrow: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              gap: 16,
              maxWidth: 400,
              paddingHorizontal: 24,
              paddingBottom: 36,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <Text
              style={{ textAlign: 'center', fontSize: 24, marginBottom: 24 }}
            >
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
            {isNextButtonVisible && (
              <Animated.View
                entering={FadeInDown}
                style={{ marginTop: 25, gap: 32 }}
              >
                <Divider style={{ width: '100%' }} />
                <Button
                  mode="elevated"
                  elevation={1}
                  onPress={async () => {
                    onboardingDisplayerRef.current &&
                      (await onboardingDisplayerRef.current.hide());

                    setOnboardingStep('faq');
                    postOnboardingAction({
                      name: 'facilityOnboarded',
                      payload: {
                        facility,
                        targetLanguage:
                          translationPresetState.preset.translationLanguage,
                      },
                    }).then();

                    postHog.capture('welcome_submitted', {
                      studyLanguage:
                        translationPresetState.preset.sourceLanguage,
                      nativeLanguage:
                        translationPresetState.preset.translationLanguage,
                    });
                    postHog.capture('$set', {
                      $set: {
                        lastSourceLanguage:
                          translationPresetState.preset.sourceLanguage,
                        lastTranslationLanguage:
                          translationPresetState.preset.translationLanguage,
                      },
                    });
                  }}
                >
                  Next
                </Button>
              </Animated.View>
            )}
          </ScrollView>
        </Displayer>
      )}
      {showSlider && (
        <Displayer style={{ gap: 16, maxWidth: 600 }}>
          <OnboardingSlider
            setIsReverse={(isReverse) =>
              translationPresetState.setPreset({
                ...translationPresetState.preset,
                isReverse,
              })
            }
            sourceLanguage={
              translationPresetState.preset.sourceLanguage as GoogleLanguage
            }
            targetLanguage={
              translationPresetState.preset
                .translationLanguage as GoogleLanguage
            }
          />
        </Displayer>
      )}
    </View>
  );
};
