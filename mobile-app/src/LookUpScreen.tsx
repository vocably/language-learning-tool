import { NavigationProp } from '@react-navigation/native';
import { analyze } from '@vocably/api';
import { AnalyzePayload, GoogleLanguage, languageList } from '@vocably/model';
import { FC, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Button,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { exitSharedScreen } from './exitSharedScreen';
import { useLanguageDeck } from './languageDeck/useLanguageDeck';
import { InlineLoader } from './loaders/InlineLoader';
import { Loader } from './loaders/Loader';
import { AnalyzeResult } from './LookUpScreen/AnalyzeResult';
import { TranslationPresetForm } from './LookUpScreen/TranslationPresetForm';
import { SearchInput, SearchInputRef } from './SearchInput';
import { mainPadding } from './styles';
import { Preset } from './TranslationPreset/TranslationPresetContainer';
import { useTranslationPreset } from './TranslationPreset/useTranslationPreset';
import { ScreenLayout } from './ui/ScreenLayout';
import { useAnalyzeOperations } from './useAnalyzeOperations';
import { useCardsLimit } from './useCardsLimit';

const padding = 16;

const getLoadingText = (translationPreset: Preset) => {
  const fromLanguage = translationPreset.isReverse
    ? translationPreset.translationLanguage
    : translationPreset.sourceLanguage;

  const toLanguage = translationPreset.isReverse
    ? translationPreset.sourceLanguage
    : translationPreset.translationLanguage;

  const fromLanguageLabel = languageList[fromLanguage as GoogleLanguage];
  const toLanguageLabel = languageList[toLanguage as GoogleLanguage];

  if (!fromLanguageLabel || !toLanguageLabel) {
    return 'Looking up...!';
  }

  if (fromLanguageLabel !== toLanguageLabel) {
    return `Translating from ${fromLanguageLabel} to ${toLanguageLabel}...`;
  }

  return `Looking up...`;
};

type Props = {
  navigation: NavigationProp<any>;
  initialText?: string;
  isSharedLookUp?: boolean;
};

export const LookUpScreen: FC<Props> = ({
  navigation,
  initialText = '',
  isSharedLookUp = false,
}) => {
  const translationPresetState = useTranslationPreset();
  const [lookUpText, setLookUpText] = useState(initialText);
  const [isAnalyzingPreset, setIsAnalyzingPreset] = useState<Preset | false>(
    false
  );
  const [lookUpResult, setLookupResult] =
    useState<Awaited<ReturnType<typeof analyze>>>();
  const theme = useTheme();
  const deck = useLanguageDeck({
    language:
      translationPresetState.status === 'known'
        ? translationPresetState.preset.sourceLanguage
        : '',
    autoReload: true,
  });

  const insets = useSafeAreaInsets();

  const cardsLimit = useCardsLimit();

  const cancelThePreviousLookUp = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    }

    setIsAnalyzingPreset(false);
  };

  const searchInputRef = useRef<SearchInputRef>(null);

  useEffect(() => {
    return navigation.addListener('focus', () => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    });
  }, []);

  useEffect(() => {
    if (lookUpText === '') {
      cancelThePreviousLookUp();
      setLookupResult(undefined);
    }
  }, [lookUpText]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const lookUp = async () => {
    cancelThePreviousLookUp();

    if (!lookUpText) {
      return;
    }

    if (deck.status !== 'loaded') {
      return;
    }

    if (translationPresetState.status === 'unknown') {
      return;
    }

    Keyboard.dismiss();

    setIsAnalyzingPreset({
      ...translationPresetState.preset,
    });
    // @ts-ignore
    const payload: AnalyzePayload = {
      [translationPresetState.preset.isReverse ? 'target' : 'source']:
        lookUpText,
      sourceLanguage: translationPresetState.preset
        .sourceLanguage as GoogleLanguage,
      targetLanguage: translationPresetState.preset
        .translationLanguage as GoogleLanguage,
    };

    abortControllerRef.current = new AbortController();
    const lookupResult = await analyze(payload, abortControllerRef.current);

    if (
      lookupResult.success === false &&
      lookupResult.errorCode !== 'API_REQUEST_ABORTED'
    ) {
      Alert.alert(
        'Error: Look up failed',
        'Oops! Something went wrong while attempting to look up. Please try again later.'
      );
    }

    if (
      !lookupResult.success &&
      lookupResult.errorCode === 'API_REQUEST_ABORTED'
    ) {
      return;
    }

    setLookupResult(lookupResult);
    setIsAnalyzingPreset(false);

    posthog.capture('lookup', payload);
  };

  useEffect(() => {
    if (
      translationPresetState.status === 'known' &&
      translationPresetState.preset.sourceLanguage &&
      translationPresetState.preset.translationLanguage &&
      deck.status === 'loaded' &&
      lookUpText
    ) {
      console.log('Looking up...');
      lookUp();
    }
  }, [
    // Translation preset state can be a new object,
    // but all we care about is sourceLanguage, targetLanguage, and if it is reversed
    translationPresetState.status === 'known'
      ? `${translationPresetState.preset.sourceLanguage}${translationPresetState.preset.translationLanguage}${translationPresetState.preset.isReverse}`
      : '',
    deck.status,
  ]);

  const { onAdd, onRemove, onTagsChange } = useAnalyzeOperations({
    deck,
  });

  const setTranslationDirection = (isReverse: boolean) => {
    if (translationPresetState.status === 'unknown') {
      return;
    }

    translationPresetState.setPreset({
      ...translationPresetState.preset,
      isReverse,
    });
  };

  if (translationPresetState.status === 'unknown') {
    return <Loader>Loading translation preset...</Loader>;
  }

  const canTranslate =
    translationPresetState.preset.sourceLanguage &&
    translationPresetState.preset.translationLanguage &&
    translationPresetState.preset.sourceLanguage !==
      translationPresetState.preset.translationLanguage;

  return (
    <ScreenLayout
      header={
        <Surface
          elevation={1}
          style={{
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: 24,
          }}
        >
          {isSharedLookUp && (
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: padding + 8,
                paddingRight: padding - 8,
                paddingTop: padding,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 18 }}>Vocably</Text>
              <Button
                style={{ marginLeft: 'auto' }}
                onPress={async () => {
                  exitSharedScreen();
                }}
              >
                Done
              </Button>
            </View>
          )}
          <View
            style={{
              padding: padding,
              width: '100%',
            }}
          >
            <TranslationPresetForm
              navigation={navigation}
              languagePairs={translationPresetState.languagePairs}
              preset={translationPresetState.preset}
              onChange={translationPresetState.setPreset}
            />
          </View>
          <View
            style={{
              paddingHorizontal: padding,
            }}
          >
            <SearchInput
              ref={searchInputRef}
              value={lookUpText}
              multiline={false}
              placeholder={
                languageList[
                  (translationPresetState.preset.isReverse
                    ? translationPresetState.preset.translationLanguage
                    : translationPresetState.preset
                        .sourceLanguage) as GoogleLanguage
                ]
              }
              onChange={setLookUpText}
              onSubmit={lookUp}
              disabled={
                !translationPresetState.preset.sourceLanguage ||
                !translationPresetState.preset.translationLanguage
              }
            />
          </View>
        </Surface>
      }
      content={
        <ScrollView
          contentContainerStyle={{
            paddingBottom: insets.bottom + padding - 2,
          }}
        >
          {!isAnalyzingPreset && !lookUpResult && (
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  gap: 8,
                  paddingTop: mainPadding,
                }}
              >
                {!isSharedLookUp && (
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingHorizontal: padding,
                    }}
                  >
                    {canTranslate && !translationPresetState.preset.isReverse && (
                      <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <Text style={{ fontSize: 16 }}>
                          Use{' '}
                          <TouchableRipple
                            style={{
                              backgroundColor: theme.colors.elevation.level5,
                              borderRadius: 12,
                              padding: 4,
                              transform: [
                                {
                                  translateY: Platform.OS === 'android' ? 7 : 5,
                                },
                              ],
                            }}
                            onPress={() => setTranslationDirection(true)}
                            borderless={true}
                          >
                            <Icon
                              size={16}
                              color={theme.colors.primary}
                              name="swap-horizontal"
                            ></Icon>
                          </TouchableRipple>{' '}
                          to translate from{' '}
                          <Text style={{ fontWeight: 'bold' }}>
                            {
                              languageList[
                                translationPresetState.preset
                                  .translationLanguage as GoogleLanguage
                              ]
                            }
                          </Text>{' '}
                          to{' '}
                          <Text style={{ fontWeight: 'bold' }}>
                            {
                              languageList[
                                translationPresetState.preset
                                  .sourceLanguage as GoogleLanguage
                              ]
                            }
                          </Text>
                          .
                        </Text>
                      </Animated.View>
                    )}

                    {canTranslate && translationPresetState.preset.isReverse && (
                      <Animated.View entering={FadeIn} exiting={FadeOut}>
                        <Text style={{ fontSize: 16 }}>
                          Use{' '}
                          <TouchableRipple
                            style={{
                              backgroundColor: theme.colors.elevation.level5,
                              borderRadius: 12,
                              padding: 4,
                              transform: [
                                {
                                  translateY: Platform.OS === 'android' ? 7 : 5,
                                },
                              ],
                            }}
                            onPress={() => setTranslationDirection(false)}
                            borderless={true}
                          >
                            <Icon
                              size={16}
                              color={theme.colors.primary}
                              name="swap-horizontal"
                            ></Icon>
                          </TouchableRipple>{' '}
                          to translate from{' '}
                          <Text style={{ fontWeight: 'bold' }}>
                            {
                              languageList[
                                translationPresetState.preset
                                  .sourceLanguage as GoogleLanguage
                              ]
                            }
                          </Text>{' '}
                          to{' '}
                          <Text style={{ fontWeight: 'bold' }}>
                            {
                              languageList[
                                translationPresetState.preset
                                  .translationLanguage as GoogleLanguage
                              ]
                            }
                          </Text>
                          .
                        </Text>
                      </Animated.View>
                    )}
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          )}
          {isAnalyzingPreset && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut.duration(50)}
              style={{
                padding: padding,
                paddingTop: mainPadding + 4,
              }}
            >
              <InlineLoader>{getLoadingText(isAnalyzingPreset)}</InlineLoader>
            </Animated.View>
          )}
          {!isAnalyzingPreset && lookUpResult && lookUpResult.success && (
            <AnalyzeResult
              cardsLimit={cardsLimit}
              leftInset={insets.left}
              rightInset={insets.right}
              style={{
                flex: 1,
                width: '100%',
                marginRight: 8,
              }}
              analysis={lookUpResult.value}
              cards={deck.deck.cards}
              onAdd={onAdd}
              onRemove={onRemove}
              onTagsChange={onTagsChange}
              deck={deck}
            />
          )}
        </ScrollView>
      }
    />
  );
};
