import { NavigationProp } from '@react-navigation/native';
import { analyze } from '@vocably/api';
import { AnalyzePayload, GoogleLanguage, languageList } from '@vocably/model';
import { usePostHog } from 'posthog-react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLanguageDeck } from './languageDeck/useLanguageDeck';
import { InlineLoader } from './loaders/InlineLoader';
import { Analyze } from './LookUpScreen/AnalyzeResult';
import { TranslationPresetForm } from './LookUpScreen/TranslationPresetForm';
import { SearchInput } from './SearchInput';
import { useShareIntentData } from './ShareIntent/useShareIntentData';
import { Preset } from './TranslationPreset/TranslationPresetContainer';
import { useTranslationPreset } from './TranslationPreset/useTranslationPreset';
import { useAnalyzeOperations } from './useAnalyzeOperations';

const padding = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  languageToolbar: {
    padding: padding,
    width: '100%',
  },
  searchContainer: {
    width: '100%',
    paddingHorizontal: padding,
  },
  resultContainer: {
    flex: 1,
    width: '100%',
    marginRight: 8,
  },
});

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
};

export const LookUpScreen: FC<Props> = ({ navigation }) => {
  const [isAutomaticallyLookedUp, setIsAutomaticallyLookedUp] = useState(false);
  const [translationPresetState, languagePairs, setTranslationPreset] =
    useTranslationPreset();
  const [lookUpText, setLookUpText] = useState('');
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
  const intentData = useShareIntentData();
  const posthog = usePostHog();

  const cancelThePreviousLookUp = () => {
    if (isAnalyzingPreset && abortControllerRef.current) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    if (intentData) {
      setLookUpText(intentData);
    }
  }, [intentData]);

  useEffect(() => {
    if (lookUpText === '') {
      cancelThePreviousLookUp();
      setLookupResult(undefined);
    }
  }, [lookUpText]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const lookUp = async () => {
    cancelThePreviousLookUp();

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
    if (translationPresetState.status === 'known' && lookUpText) {
      lookUp();
    }
  }, [translationPresetState]);

  useEffect(() => {
    if (
      !isAutomaticallyLookedUp &&
      intentData &&
      lookUpText &&
      deck.status === 'loaded'
    ) {
      setIsAutomaticallyLookedUp(true);
      lookUp().then();
    }
  }, [intentData, lookUpText, deck.status, isAutomaticallyLookedUp, lookUp]);

  const { onAdd, onRemove, onTagsChange } = useAnalyzeOperations({
    deck,
  });

  const setTranslationDirection = (isReverse: boolean) => {
    if (translationPresetState.status === 'unknown') {
      return;
    }

    setTranslationPreset({
      ...translationPresetState.preset,
      isReverse,
    });
  };

  if (translationPresetState.status === 'unknown') {
    return <></>;
  }

  const canTranslate =
    translationPresetState.preset.sourceLanguage &&
    translationPresetState.preset.translationLanguage &&
    translationPresetState.preset.sourceLanguage !==
      translationPresetState.preset.translationLanguage;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.languageToolbar}>
        <TranslationPresetForm
          navigation={navigation}
          languagePairs={languagePairs}
          preset={translationPresetState.preset}
          onChange={setTranslationPreset}
        />
      </View>
      <View style={[styles.searchContainer]}>
        <SearchInput
          value={lookUpText}
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
      {!isAnalyzingPreset && !lookUpResult && (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View
            style={{
              flex: 1,
              width: '100%',
              paddingHorizontal: padding,
              paddingVertical: padding,
              paddingLeft: padding + 18,
              gap: 8,
            }}
          >
            {canTranslate && (
              <View>
                <Text>
                  The cards will be saved to your{' '}
                  {
                    languageList[
                      translationPresetState.preset
                        .sourceLanguage as GoogleLanguage
                    ]
                  }{' '}
                  deck.
                </Text>
              </View>
            )}
            {canTranslate && !translationPresetState.preset.isReverse && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <Text>
                  To search in{' '}
                  {
                    languageList[
                      translationPresetState.preset
                        .translationLanguage as GoogleLanguage
                    ]
                  }{' '}
                  for a{' '}
                  {
                    languageList[
                      translationPresetState.preset
                        .sourceLanguage as GoogleLanguage
                    ]
                  }{' '}
                  word or phrase, turn on reverse translation mode by clicking
                  this{'\u00A0'}button:{'\u00A0'}
                  <Text
                    style={{
                      backgroundColor: theme.colors.inversePrimary,
                    }}
                    onPress={() => setTranslationDirection(true)}
                  >
                    <Icon
                      size={14}
                      color={theme.colors.primary}
                      name="arrow-right"
                    ></Icon>
                  </Text>
                </Text>
              </Animated.View>
            )}

            {canTranslate && translationPresetState.preset.isReverse && (
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={{ gap: 8 }}
              >
                <View>
                  <Text>Reverse Translation mode is on.</Text>
                </View>
                <View>
                  <Text>
                    To search in{' '}
                    {
                      languageList[
                        translationPresetState.preset
                          .sourceLanguage as GoogleLanguage
                      ]
                    }
                    {', '}
                    turn off reverse translation mode by clicking this{'\u00A0'}
                    button:{'\u00A0'}
                    <Text
                      style={{
                        backgroundColor: theme.colors.inversePrimary,
                      }}
                      onPress={() => setTranslationDirection(false)}
                    >
                      <Icon
                        size={14}
                        color={theme.colors.primary}
                        name="arrow-left"
                      ></Icon>
                    </Text>
                  </Text>
                </View>
              </Animated.View>
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
            marginTop: 16,
          }}
        >
          <InlineLoader>{getLoadingText(isAnalyzingPreset)}</InlineLoader>
        </Animated.View>
      )}
      {!isAnalyzingPreset && lookUpResult && lookUpResult.success && (
        <Analyze
          style={styles.resultContainer}
          analysis={lookUpResult.value}
          cards={deck.deck.cards}
          onAdd={onAdd}
          onRemove={onRemove}
          onTagsChange={onTagsChange}
          deck={deck}
        />
      )}
    </SafeAreaView>
  );
};
