import { NavigationProp } from '@react-navigation/native';
import { CardItem, GoogleLanguage } from '@vocably/model';
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
import {
  getMaximumCardsPerSession,
  getMultiChoiceEnabled,
  getPreferMultiChoiceEnabled,
  getRandomizerEnabled,
} from '../MainMenu/PracticeSettingsScreen';
import { useNumberOfPracticeSessions } from '../RequestFeedback/useNumberOfPracticeSessions';
import { useAsync } from '../useAsync';
import { useCardsAnsweredToday } from './cardsAnsweredToday';
import { Completed } from './Completed';
import { craftTheStrategy } from './craftTheStrategy';
import { getPredefinedMultiChoiceOptions } from './getPredefinedMultiChoiceOptions';
import { Grade } from './Grade';
import { useTranslationLanguage } from './useTranslationLanguage';

type Dashboard = FC<{
  navigation: NavigationProp<any>;
}>;

export const StudyScreen: Dashboard = ({ navigation }) => {
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
  const [numberOfRepetitions, increaseNumberOfRepetitions] =
    useNumberOfPracticeSessions();
  const [cardsAnsweredToday, increaseCardsAnsweredToday] =
    useCardsAnsweredToday();

  const translationLanguage = useTranslationLanguage(
    language as GoogleLanguage
  );

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
      (result) => {
        if (result.success === false) {
          Alert.alert(
            `Error: Card update failed`,
            result.errorCode === 'NETWORK_REQUEST_ERROR'
              ? `Your answer wasn't saved due to a lost connection. The session will stop and resume from the failed answer.`
              : `Oops! Unable to continue practice session due to a technical issue. Please try again later.`,
            [
              {
                text: 'Exit practice session',
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
      increaseNumberOfRepetitions();
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
    preferMultiChoiceEnabledResult.status !== 'loaded'
  ) {
    return <Loader>Loading...</Loader>;
  }

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: '100%',
        paddingTop: 70,
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
        />
        {cards.length > 0 && (
          <IconButton
            icon={'pencil'}
            size={24}
            onPress={() =>
              navigation.navigate('EditCardModal', {
                card: cards[0],
                onUpdate: () => {},
              })
            }
          />
        )}
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Button
            textColor={theme.colors.onBackground}
            onPress={() => navigation.goBack()}
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
            numberOfRepetitions={
              numberOfRepetitions.status === 'loaded'
                ? numberOfRepetitions.value
                : 0
            }
            onStudyAgain={() => setCardsStudied(0)}
          ></Completed>
        )}
      </View>
    </View>
  );
};
