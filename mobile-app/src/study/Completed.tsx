import { CardItem } from '@vocably/model';
import { sample } from 'lodash-es';
import { usePostHog } from 'posthog-react-native';
import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { RequestFeedback } from '../RequestFeedback';
import { Displayer } from './Displayer';

const motivationalQuotes = [
  'Perseverance is not a long race; it is many short races one after the other.',
  'A river cuts through rock not because of its power, but because of its persistence.',
  'Persistence guarantees that results are inevitable.',
  'Patience and persistence are the keys to unlocking greatness.',
  'Every step forward, no matter how small, is the progress.',
  'Persistence turns dreams into reality; every effort is a seed for success.',
  'Every time you push forward, you rewrite your story to include success.',
  'Keep believing in yourself — your persistence is your superpower.',
  'Success is built on the bricks of persistence, laid one by one.',
  'The universe moves for those who never stop moving forward.',
  'The energy you put in today fuels the success of tomorrow.',
  'Persistence transforms the impossible into the inevitable.',
  'Each word you learn brings you closer to understanding a new culture.',
  'Language learning is a marathon, not a sprint. You are good!',
  'Persistence is the secret ingredient in becoming fluent. Keep going!',
  'Practice doesn’t make perfect — it makes progress, and that’s what matters.',
  'A second language is not just a skill, but a gift that keeps giving.',
  'Each time you practice, you’re rewriting your brain for success.',
  'A language learner is a world explorer in disguise.',
  'Every mistake you make while learning is proof that you’re growing.',
  'Languages are the keys to the world; every word you master unlocks new doors.',
  'Fluency is not about speed; it’s about showing up and practicing every day.',
  'A new language doesn’t just teach you words; it teaches you new ways of thinking.',
  'Small, consistent efforts lead to big, life-changing results in language learning.',
  'You’ll never regret the time you spend learning a language — it’s an investment in yourself.',
  'Every language you learn adds a new dimension to your identity.',
  'Even if it feels hard today, tomorrow your efforts will make you smile.',
  'The journey to fluency is a story worth telling — keep writing it.',
];

type Props = {
  numberOfRepetitions?: number;
  onStudyAgain?: () => void;
  onDone?: () => void;
  cards: CardItem[];
};

export const Completed: FC<Props> = ({
  onStudyAgain = () => {},
  onDone = () => {},
  numberOfRepetitions,
  cards,
}) => {
  const theme = useTheme();
  const [motivationalQuote, setMotivationalQuote] = useState('');

  useEffect(() => {
    setMotivationalQuote(sample(motivationalQuotes) as string);
  }, []);

  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('study_completed');
  }, []);

  return (
    <Displayer style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <Text style={{ fontSize: 24, color: theme.colors.secondary }}>
          You did it!
        </Text>
        {motivationalQuote.length > 0 && (
          <View style={{ paddingHorizontal: 36, marginBottom: 14 }}>
            <Text
              style={{
                color: theme.colors.onBackground,
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              {motivationalQuote}
            </Text>
          </View>
        )}
        <Button onPress={onDone} mode="contained" style={{ width: 230 }}>
          Finish
        </Button>
        <Button onPress={onStudyAgain} style={{ width: 230 }}>
          Take one more round
        </Button>
        {cards.length > 30 && (
          <RequestFeedback
            numberOfRepetitions={numberOfRepetitions}
            style={{
              paddingHorizontal: 24,
            }}
          />
        )}
      </View>
    </Displayer>
  );
};
