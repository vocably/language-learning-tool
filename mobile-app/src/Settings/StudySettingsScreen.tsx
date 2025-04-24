import { Slider } from '@miblanchard/react-native-slider';
import { FC } from 'react';
import {
  Linking,
  PixelRatio,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Checkbox, Surface, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getItem, setItem } from '../asyncAppStorage';
import { mainPadding } from '../styles';
import { useAsync } from '../useAsync';

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    borderRadius: 16,
  },
});

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

export const StudySettingsScreen: FC<Props> = () => {
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

  const fontScale = Math.max(1, PixelRatio.getFontScale());

  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        paddingTop: mainPadding,
        paddingBottom: insets.bottom + mainPadding,
        paddingLeft: insets.left + mainPadding,
        paddingRight: insets.right + mainPadding,
      }}
    >
      <View
        style={{
          marginBottom: 32,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Icon name="book-open-variant" size={24} />
        <View>
          <Text style={{ fontSize: 24, color: theme.colors.secondary }}>
            Study settings
          </Text>
        </View>
      </View>

      {isMultiChoiceEnabledResult.status === 'loaded' &&
        preferMultiChoiceResult.status === 'loaded' && (
          <>
            <Surface style={[styles.surface, { marginBottom: 8 }]}>
              <Checkbox.Item
                mode="android"
                position="leading"
                status={
                  isMultiChoiceEnabledResult.value ? 'checked' : 'unchecked'
                }
                onPress={onMultiChoicePress}
                label="Use multiple-choice questions"
                labelStyle={{
                  textAlign: 'left',
                  lineHeight: 16,
                }}
                style={{
                  width: '100%',
                }}
              />
            </Surface>

            <View
              style={{
                paddingLeft: 8,
                paddingRight: 8,
                width: '100%',
                gap: 8,
                marginBottom: 32,
              }}
            >
              <Text>
                The multiple-choice questions are only visible when you have
                enough cards.
              </Text>
              <Text>
                The more cards you have in your collection, the better your
                multiple-choice options will be.
              </Text>
            </View>

            {isMultiChoiceEnabledResult.value && (
              <>
                <Surface style={[styles.surface, { marginBottom: 8 }]}>
                  <Checkbox.Item
                    mode="android"
                    position="leading"
                    status={
                      preferMultiChoiceResult.value ? 'checked' : 'unchecked'
                    }
                    onPress={onPreferMultiChoicePress}
                    label="Multiple-choice only"
                    labelStyle={{
                      textAlign: 'left',
                      lineHeight: 16,
                    }}
                    style={{
                      width: '100%',
                    }}
                  />
                </Surface>
                <View
                  style={{
                    paddingLeft: 8,
                    paddingRight: 8,
                    width: '100%',
                    gap: 8,
                    marginBottom: 32,
                  }}
                >
                  <Text>
                    Vocably will only show multiple-choice question if possible.
                  </Text>
                </View>
              </>
            )}
          </>
        )}

      <Surface
        style={[
          styles.surface,
          { marginBottom: 32, gap: 16, padding: 16, paddingHorizontal: 32 },
        ]}
      >
        <View>
          <Text style={{ fontSize: 16 }}>Maximum cards per study session</Text>
        </View>
        {maximumCardsPerSession.status === 'loaded' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 16, width: 24 * fontScale }}>
              {maximumCardsPerSession.value}
            </Text>
            <View style={{ flex: 1 }}>
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
            </View>
          </View>
        )}
      </Surface>

      {isRandomizerEnabled.status === 'loaded' && (
        <Surface style={[styles.surface, { marginBottom: 8 }]}>
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
        </Surface>
      )}
      <View
        style={{
          paddingHorizontal: 8,
        }}
      >
        <Text>
          <Icon name="alert-outline" size={16} /> This option disables the
          SuperMemo algorithm, which was created to help people remember large
          amounts of information.{' '}
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
