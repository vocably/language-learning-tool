import { CardItem } from '@vocably/model';
import { SrsScore } from '@vocably/srs';
import { shuffle } from 'lodash-es';
import React, { FC, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { CardDefinition } from '../CardDefinition';
import { CardFront } from './Card/CardFront';
import { Displayer, DisplayerRef } from './Displayer';

type Props = {
  autoPlay: boolean;
  card: CardItem;
  onGrade: (score: SrsScore) => void;
  alternatives: CardItem[];
  direction: 'front' | 'back';
};

export const MultiChoice: FC<Props> = ({
  card,
  onGrade,
  alternatives,
  autoPlay,
  direction,
}) => {
  const theme = useTheme();

  const [wrong, setWrong] = useState<string[]>([]);
  const [correct, setCorrect] = useState<string>('');
  const displayerRef = useRef<DisplayerRef>(null);

  const answers = useMemo(() => shuffle([...alternatives, card]), []);

  const validate = (validateItem: CardItem) => {
    if (wrong.includes(card.id)) {
      return;
    }

    if (validateItem.id !== card.id) {
      setWrong([...wrong, validateItem.id]);
      return;
    }

    setCorrect(card.id);

    if (displayerRef.current) {
      displayerRef.current.hide().then(() => {
        onGrade(wrong.length === 0 ? 5 : 1);
      });
    } else {
      onGrade(wrong.length === 0 ? 5 : 1);
    }
  };

  const [minHeight, setMinHeight] = useState(36);

  return (
    <ScrollView
      style={{ minHeight: '100%', width: '100%' }}
      contentContainerStyle={{
        minHeight: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Displayer ref={displayerRef} style={{ padding: 16 }}>
        {direction === 'back' && (
          <>
            <Text style={{ fontSize: 24, marginBottom: 12 }}>
              Select the correct answer for the{' '}
              {card.data.partOfSpeech ? (
                <Text style={{ color: theme.colors.secondary }}>
                  {card.data.partOfSpeech}
                </Text>
              ) : (
                'meaning'
              )}
              {':'}
            </Text>
            <View style={{ alignSelf: 'flex-start' }}>
              <CardDefinition
                card={card.data}
                textStyle={{ fontSize: 24 }}
                maskSource={true}
              />
            </View>
          </>
        )}
        {direction === 'front' && (
          <>
            <CardFront card={card} autoPlay={autoPlay} />
          </>
        )}
        <View
          style={{
            marginTop: 32,
            width: '100%',
            gap: 8,
          }}
        >
          {answers.map((answerCard, index) => (
            <Pressable
              disabled={wrong.includes(answerCard.id)}
              onPress={() => validate(answerCard)}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                if (height > minHeight) {
                  setMinHeight(height);
                }
              }}
              style={({ pressed }) => [
                {
                  flexDirection: 'column',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: wrong.includes(answerCard.id)
                    ? theme.colors.error
                    : theme.colors.primary,
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderRadius: 50,
                  minHeight: minHeight,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: pressed
                    ? theme.colors.inversePrimary
                    : wrong.includes(answerCard.id)
                    ? theme.colors.error
                    : correct === answerCard.id
                    ? theme.colors.primary
                    : undefined,
                },
              ]}
              key={answerCard.id}
            >
              <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: 18,
                  color: wrong.includes(answerCard.id)
                    ? theme.colors.onError
                    : correct === answerCard.id
                    ? theme.colors.onPrimary
                    : theme.colors.primary,
                }}
              >
                {direction === 'back'
                  ? answerCard.data.source
                  : answerCard.data.translation || answerCard.data.definition}
              </Text>
            </Pressable>
          ))}
        </View>
      </Displayer>
    </ScrollView>
  );
};
