import { Slider } from '@miblanchard/react-native-slider';
import { FC } from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { Checkbox, Divider, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getItem, setItem } from '../asyncAppStorage';
import { useAsync } from '../useAsync';

const MULTI_CHOICE_ENABLED_KEY = 'isMultiChoiceEnabled';
const RANDOMIZER_ENABLED_KEY = 'isRandomizerEnabled';
const MAXIMUM_CARDS_PER_SESSION_KEY = 'maximumCardsPerSession';
const PREFER_MULTI_CHOICE = 'preferMultiChoiceOptions';

export const getMultiChoiceEnabled = () =>
  getItem(MULTI_CHOICE_ENABLED_KEY).then((res) => res !== 'false');

const setMultiChoiceEnabled = (isEnabled: boolean) =>
  setItem(MULTI_CHOICE_ENABLED_KEY, isEnabled ? 'true' : 'false');

export const getRandomizerEnabled = () =>
  getItem(RANDOMIZER_ENABLED_KEY).then((res) => res === 'true');

const setRandomizerEnabled = (isEnabled: boolean) =>
  setItem(RANDOMIZER_ENABLED_KEY, isEnabled ? 'true' : 'false');

export const getMaximumCardsPerSession = () =>
  getItem(MAXIMUM_CARDS_PER_SESSION_KEY).then((res) => Number(res ?? 10));

export const setMaximumCardsPerSession = (cardsPerSession: number) =>
  setItem(MAXIMUM_CARDS_PER_SESSION_KEY, cardsPerSession.toString());

export const getPreferMultiChoiceEnabled = () =>
  getItem(PREFER_MULTI_CHOICE).then((res) => res === 'true');

const setPreferMultiChoiceEnabled = (preferMultiCHoice: boolean) =>
  setItem(PREFER_MULTI_CHOICE, preferMultiCHoice ? 'true' : 'false');

type Props = {};

export const PracticeSettingsScreen: FC<Props> = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const [isMultiChoiceEnabledResult, mutateMultiChoiceEnabled] = useAsync(
    getMultiChoiceEnabled,
    setMultiChoiceEnabled
  );

  const [isRandomizerEnabled, mutateIsRandomizerEnabled] = useAsync(
    getRandomizerEnabled,
    setRandomizerEnabled
  );

  const [maximumCardsPerSession, mutateMaximumCardsPerSession] = useAsync(
    getMaximumCardsPerSession,
    setMaximumCardsPerSession
  );

  const [preferMultiChoiceResult, mutatePreferMultiChoice] = useAsync(
    getPreferMultiChoiceEnabled,
    setPreferMultiChoiceEnabled
  );

  const onMultiChoicePress = () => {
    if (isMultiChoiceEnabledResult.status !== 'loaded') {
      return;
    }
    mutateMultiChoiceEnabled(!isMultiChoiceEnabledResult.value);
  };

  const onRandomizerEnabledPress = () => {
    if (isRandomizerEnabled.status !== 'loaded') {
      return;
    }

    mutateIsRandomizerEnabled(!isRandomizerEnabled.value);
  };

  const onPreferMultiChoicePress = () => {
    if (preferMultiChoiceResult.status !== 'loaded') {
      return;
    }
    mutatePreferMultiChoice(!preferMultiChoiceResult.value);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {isMultiChoiceEnabledResult.status === 'loaded' &&
        preferMultiChoiceResult.status === 'loaded' && (
          <>
            <Checkbox.Item
              mode="android"
              position="leading"
              status={
                isMultiChoiceEnabledResult.value ? 'checked' : 'unchecked'
              }
              onPress={onMultiChoicePress}
              label="Show multi-choice questions"
              labelStyle={{
                textAlign: 'left',
                lineHeight: 16,
              }}
              style={{
                width: '100%',
              }}
            />

            <View
              style={{
                paddingLeft: insets.left + 16,
                paddingRight: 8,
                width: '100%',
                gap: 8,
              }}
            >
              <Text>
                The multiple-choice questions are displayed only when you have
                enough cards.
              </Text>
              <Text>
                The more cards you have in your collection, the better your
                multiple-choice options will be.
              </Text>
            </View>

            {isMultiChoiceEnabledResult.value && (
              <>
                <Checkbox.Item
                  mode="android"
                  position="leading"
                  status={
                    preferMultiChoiceResult.value ? 'checked' : 'unchecked'
                  }
                  onPress={onPreferMultiChoicePress}
                  label="Enforce multi choice questions"
                  labelStyle={{
                    textAlign: 'left',
                    lineHeight: 16,
                  }}
                  style={{
                    width: '100%',
                  }}
                />
                <View
                  style={{
                    paddingLeft: insets.left + 16,
                    paddingRight: 8,
                    width: '100%',
                    gap: 8,
                  }}
                >
                  <Text>
                    This option makes Vocably to show only multi-choice
                    questions.
                  </Text>
                </View>
              </>
            )}
          </>
        )}
      <Divider style={{ width: '100%', marginVertical: 16 }} />
      <View
        style={{
          paddingLeft: insets.left + 16,
          paddingRight: 8,
          width: '100%',
          gap: 8,
        }}
      >
        <Text>Maximum cards per study session:</Text>
      </View>
      {maximumCardsPerSession.status === 'loaded' && (
        <View
          style={{
            width: '100%',
            paddingLeft: insets.left + 16,
            paddingRight: 16,
          }}
        >
          <Slider
            minimumValue={5}
            maximumValue={40}
            step={1}
            minimumTrackTintColor={theme.colors.primary}
            thumbTintColor={theme.colors.primary}
            value={maximumCardsPerSession.value}
            onValueChange={(value) => {
              mutateMaximumCardsPerSession(value[0]);
            }}
          ></Slider>
          <Text>{maximumCardsPerSession.value}</Text>
        </View>
      )}
      <Divider style={{ width: '100%', marginVertical: 16 }} />
      {isRandomizerEnabled.status === 'loaded' && (
        <>
          <Checkbox.Item
            mode="android"
            position="leading"
            status={isRandomizerEnabled.value ? 'checked' : 'unchecked'}
            onPress={onRandomizerEnabledPress}
            label="Randomly select cards to study"
            labelStyle={{
              textAlign: 'left',
              lineHeight: 16,
            }}
            style={{
              width: '100%',
            }}
          />
        </>
      )}
      <View
        style={{
          paddingLeft: insets.left + 16,
          paddingRight: 8,
          width: '100%',
        }}
      >
        <Text>
          Important! This option disables the SuperMemo algorithm, which was
          created to help people remember large amounts of information.{' '}
          <Text onPress={() => Linking.openURL('https://vocably.pro/srs.html')}>
            <Text
              style={{
                textDecorationLine: 'underline',
                color: theme.colors.primary,
              }}
            >
              Read how Vocably uses this algorithm to help you learn more words
              in a shorter time.
            </Text>
            {''}
            <Text
              style={{
                color: theme.colors.primary,
                fontSize: 16,
              }}
            >
              {' '}
              <Icon name="open-in-new" />
            </Text>
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};
