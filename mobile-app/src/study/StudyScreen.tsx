import { NavigationProp } from '@react-navigation/native';
import { CardItem, GoogleLanguage, isGoogleLanguage } from '@vocably/model';
import { grade, slice, SrsScore } from '@vocably/srs';
import { setBadgeCount } from 'aws-amplify/push-notifications';
import { shuffle } from 'lodash-es';
import { usePostHog } from 'posthog-react-native';
import React, { FC, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Button, IconButton, useTheme } from 'react-native-paper';
import {
  getAutoPlayFromStorage,
  saveAutoPlayToStorage,
} from '../autoPlayState';
import { useSelectedDeck } from '../languageDeck/useSelectedDeck';
import { Loader } from '../loaders/Loader';
import { useNumberOfStudySessions } from '../RequestFeedback/useNumberOfStudySessions';
import {
  getMaximumCardsPerSession,
  getMultiChoiceEnabled,
  getPreferMultiChoiceEnabled,
  getRandomizerEnabled,
} from '../Settings/StudySettingsScreen';
import { useAsync } from '../useAsync';
import { useCardsAnsweredToday } from './cardsAnsweredToday';
import { Completed } from './Completed';
import { craftTheStrategy } from './craftTheStrategy';
import { getPredefinedMultiChoiceOptions } from './getPredefinedMultiChoiceOptions';
import { Grade } from './Grade';
import { useStreakHasBeenShown } from './useStreakHasBeenShown';
import { useStudyStats } from './useStudyStats';
import { useTranslationLanguage } from './useTranslationLanguage';

export const PADDING_VERTICAL = 70;

type Props = FC<{
  navigation: NavigationProp<any>;
}>;

const isOkayForMnemonic = (cardItem: CardItem) => {
  return (
    cardItem.data.partOfSpeech && !cardItem.data.partOfSpeech.includes('phrase')
  );
};

export const StudyScreen: Props = ({ navigation }) => {
  const theme = useTheme();

  const [autoPlayResult, setAutoPlay] = useAsync(
    getAutoPlayFromStorage,
    saveAutoPlayToStorage
  );

  const {
    status: loadDeckStatus,
    update,
    filteredCards,
    deck: { language, cards: allCards },
  } = useSelectedDeck({
    autoReload: false,
  });

  const [isMultiChoiceEnabledResult] = useAsync(getMultiChoiceEnabled);
  const [isRandomizerEnabledResult] = useAsync(getRandomizerEnabled);
  const [preferMultiChoiceEnabledResult] = useAsync(
    getPreferMultiChoiceEnabled
  );
  const [maximumCardsPerSessionResult] = useAsync(getMaximumCardsPerSession);

  const [cards, setCards] = useState<CardItem[]>();
  const [cardsStudied, setCardsStudied] = useState(0);
  const [numberOfStudySessions, increaseNumberOfStudySessions] =
    useNumberOfStudySessions();
  const [cardsAnsweredToday, increaseCardsAnsweredToday] =
    useCardsAnsweredToday();

  const translationLanguage = useTranslationLanguage(
    language as GoogleLanguage
  );

  const [streakHasShownToday, setStreakHasShown] = useStreakHasBeenShown();
  const studyStatsResult = useStudyStats();

  useEffect(() => {
    if (
      cardsAnsweredToday !== null &&
      cardsAnsweredToday.answers > 0 &&
      maximumCardsPerSessionResult.status === 'loaded' &&
      cardsAnsweredToday.answers % maximumCardsPerSessionResult.value === 0
    ) {
      setBadgeCount(0);
    }
  }, [cardsAnsweredToday, maximumCardsPerSessionResult]);

  useEffect(() => {
    if (studyStatsResult.status === 'failed') {
      Alert.alert(
        `Error: unable to load essential data`,
        `Sorry, Vocably is unable data essential for the study session. Please try again later.`,
        [
          {
            text: 'Exit study session',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  }, [studyStatsResult.status]);

  useEffect(() => {
    if (
      cardsStudied === 0 &&
      isRandomizerEnabledResult.status === 'loaded' &&
      maximumCardsPerSessionResult.status === 'loaded'
    ) {
      if (isRandomizerEnabledResult.value) {
        setCards(
          shuffle(filteredCards).slice(0, maximumCardsPerSessionResult.value)
        );
      } else {
        setCards(
          slice(new Date(), maximumCardsPerSessionResult.value, filteredCards)
        );
      }
    }
  }, [
    filteredCards,
    cardsStudied,
    isRandomizerEnabledResult,
    maximumCardsPerSessionResult,
  ]);

  useEffect(() => {
    setCards((cards) => {
      if (cards === undefined) {
        return undefined;
      }

      const filteredCardsMap = Object.fromEntries(
        filteredCards.map((filteredCard) => [filteredCard.id, filteredCard])
      );

      return cards
        .filter((card) => filteredCardsMap[card.id])
        .map((card) => filteredCardsMap[card.id]);
    });
  }, [filteredCards]);

  const onGrade = (score: SrsScore) => {
    if (cards === undefined) {
      return;
    }

    if (cards.length === 0) {
      return;
    }

    if (studyStatsResult.status !== 'loaded') {
      Alert.alert(
        `Unable to grade the card`,
        `Sorry, Vocably is unable to grade the card yet. Please try again in a moment.`,
        [
          {
            text: 'Exit study session',
            onPress: () => navigation.goBack(),
          },
        ]
      );

      return;
    }

    if (
      isMultiChoiceEnabledResult.status !== 'loaded' ||
      preferMultiChoiceEnabledResult.status !== 'loaded'
    ) {
      return;
    }

    const { strategy } = craftTheStrategy({
      isMultiChoiceEnabled: isMultiChoiceEnabledResult.value,
      preferMultiChoiceEnabled: preferMultiChoiceEnabledResult.value,
      card: cards[0],
      allCards,
      prerenderedCards: translationLanguage
        ? getPredefinedMultiChoiceOptions(
            language as GoogleLanguage,
            translationLanguage
          )
        : [],
    });

    update(cards[0].id, grade(cards[0].data, score, strategy)).then(
      async (result) => {
        if (result.success === false) {
          Alert.alert(
            `Error: Card update failed`,
            result.errorCode === 'NETWORK_REQUEST_ERROR'
              ? `Your answer wasn't saved due to a lost connection. The session will stop and resume from the failed answer.`
              : `Oops! Unable to continue study session due to a technical issue. Please try again later.`,
            [
              {
                text: 'Exit study session',
                onPress: () => navigation.goBack(),
              },
            ]
          );

          return;
        }

        if (cardsStudied > 0) {
          return;
        }

        const setStreakResult = await studyStatsResult.value.setStreak();

        if (setStreakResult.success === false) {
          Alert.alert(
            `Error: Card update failed`,
            setStreakResult.errorCode === 'NETWORK_REQUEST_ERROR'
              ? `Your answer wasn't saved due to a lost connection. The session will stop and resume from the failed answer.`
              : `Oops! Unable to continue study session due to a technical issue. Please try again later.`,
            [
              {
                text: 'Exit study session',
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }
      }
    );

    increaseCardsAnsweredToday();
    const followingCards = cards.slice(1);
    setCards(followingCards);
    setCardsStudied((cardsStudied) => cardsStudied + 1);

    if (followingCards.length === 0) {
      setBadgeCount(0);
      increaseNumberOfStudySessions();
    }
  };

  const posthog = usePostHog();

  useEffect(() => {
    if (
      isRandomizerEnabledResult.status !== 'loaded' ||
      isMultiChoiceEnabledResult.status !== 'loaded' ||
      preferMultiChoiceEnabledResult.status !== 'loaded' ||
      maximumCardsPerSessionResult.status !== 'loaded'
    ) {
      return;
    }

    posthog.capture('study_started', {
      isRandomizerEnabled: isRandomizerEnabledResult.value,
      isMultiChoiceEnabled: isMultiChoiceEnabledResult.value,
      preferMultiChoiceEnabled: preferMultiChoiceEnabledResult.value,
      maximumCardsPerSession: maximumCardsPerSessionResult.value,
      language,
    });
  }, [
    posthog,
    isRandomizerEnabledResult,
    isMultiChoiceEnabledResult,
    preferMultiChoiceEnabledResult,
    maximumCardsPerSessionResult,
  ]);

  if (
    loadDeckStatus === 'loading' ||
    cards === undefined ||
    isMultiChoiceEnabledResult.status !== 'loaded' ||
    isRandomizerEnabledResult.status !== 'loaded' ||
    autoPlayResult.status !== 'loaded' ||
    maximumCardsPerSessionResult.status !== 'loaded' ||
    preferMultiChoiceEnabledResult.status !== 'loaded' ||
    studyStatsResult.status !== 'loaded' ||
    streakHasShownToday.status !== 'loaded'
  ) {
    return <Loader>Loading...</Loader>;
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: '100%',
        paddingTop: PADDING_VERTICAL,
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: '100%',
          padding: 20,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          icon={autoPlayResult.value ? 'volume-high' : 'volume-variant-off'}
          size={24}
          animated={true}
          onPress={() => setAutoPlay(!autoPlayResult.value)}
          style={{
            backgroundColor: theme.colors.background,
          }}
        />
        {cards.length > 0 && (
          <>
            <IconButton
              icon={'pencil'}
              size={24}
              onPress={() =>
                navigation.navigate('EditCardModal', {
                  card: cards[0],
                })
              }
              style={{
                backgroundColor: theme.colors.background,
              }}
            />
            {isOkayForMnemonic(cards[0]) &&
              isGoogleLanguage(language) &&
              isGoogleLanguage(translationLanguage ?? '') && (
                <IconButton
                  icon={'creation'}
                  size={24}
                  onPress={() =>
                    navigation.navigate('MnemonicModal', {
                      sourceLanguage: language,
                      targetLanguage: translationLanguage,
                      card: cards[0],
                    })
                  }
                  style={{
                    transform: [{ translateX: -9 }],
                    backgroundColor: theme.colors.background,
                  }}
                />
              )}
          </>
        )}
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Button
            textColor={theme.colors.onBackground}
            onPress={() => navigation.goBack()}
            buttonColor={theme.colors.background}
          >
            Done
          </Button>
        </View>
      </View>
      <View
        style={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {cards.length > 0 &&
          cards
            .slice(0, 1)
            .map((card) => (
              <Grade
                key={card.id}
                isMultiChoiceEnabled={isMultiChoiceEnabledResult.value}
                preferMultiChoiceEnabled={preferMultiChoiceEnabledResult.value}
                card={card}
                onGrade={onGrade}
                autoPlay={autoPlayResult.value}
                existingCards={allCards}
                prerenderedCards={
                  translationLanguage
                    ? getPredefinedMultiChoiceOptions(
                        language as GoogleLanguage,
                        translationLanguage
                      )
                    : []
                }
              />
            ))}
        {cards.length === 0 && (
          <Completed
            cards={allCards}
            onDone={() => navigation.goBack()}
            numberOfStudySessions={
              numberOfStudySessions.status === 'loaded'
                ? numberOfStudySessions.value
                : 0
            }
            onStudyAgain={() => setCardsStudied(0)}
            streakHasBeenShown={streakHasShownToday.value}
            streakDays={studyStatsResult.value.streak.days}
            onShow={() => setStreakHasShown()}
          ></Completed>
        )}
      </View>
    </View>
  );
};
