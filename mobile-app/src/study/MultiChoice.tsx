import { CardItem } from '@vocably/model';
import { SrsScore } from '@vocably/srs';
import { shuffle } from 'lodash-es';
import React, { FC, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';
import { CardDefinition } from '../CardDefinition';
import { CardFront } from './Card/CardFront';
import { Displayer, DisplayerRef } from './Displayer';
import { PADDING_VERTICAL } from './StudyScreen';

type Props = {
  autoPlay: boolean;
  card: CardItem;
  onGrade: (score: SrsScore) => void;
  alternatives: CardItem[];
  direction: 'front' | 'back';
};

const buttonBorderRadius = 16;

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
    <>
      <ScrollView
        style={{
          width: '100%',
        }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: PADDING_VERTICAL,
        }}
      >
        <Displayer
          ref={displayerRef}
          style={{
            padding: 16,
            maxWidth: 700,
          }}
        >
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
              gap: 12,
            }}
          >
            {answers.map((answerCard, index) => (
              <Surface
                style={{
                  borderRadius: buttonBorderRadius,
                }}
              >
                <TouchableRipple
                  borderless={true}
                  disabled={wrong.includes(answerCard.id)}
                  onPress={() => validate(answerCard)}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    if (height > minHeight) {
                      setMinHeight(height);
                    }
                  }}
                  style={{
                    flexDirection: 'column',
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderRadius: buttonBorderRadius,
                    minHeight: minHeight,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: wrong.includes(answerCard.id)
                      ? theme.colors.error
                      : correct === answerCard.id
                      ? theme.colors.primary
                      : theme.colors.elevation.level3,
                  }}
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
                        : theme.colors.secondary,
                    }}
                  >
                    {direction === 'back'
                      ? answerCard.data.source
                      : answerCard.data.translation ||
                        answerCard.data.definition}
                  </Text>
                </TouchableRipple>
              </Surface>
            ))}
          </View>
        </Displayer>
      </ScrollView>
      <LinearGradient
        locations={[0.1, 1]}
        // @ts-ignore
        colors={[theme.colors.transparentSurface, theme.colors.surface]}
        style={{
          position: 'absolute',
          display: 'flex',
          bottom: 0,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          height: PADDING_VERTICAL,
          pointerEvents: 'none',
        }}
      ></LinearGradient>
    </>
  );
};
