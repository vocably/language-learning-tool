import { CardItem, isGoogleTTSLanguage } from '@vocably/model';
import React, { FC, useCallback, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { CardDefinition } from '../CardDefinition';
import { CardExample } from '../CardExample';
import { PlaySound } from '../PlaySound';
import { Displayer } from './Displayer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20,
  },
  list: {
    flex: 1,
    justifyContent: 'center',
  },
  cardFront: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    backfaceVisibility: 'hidden',
  },
});

export const Card: FC<{ card: CardItem }> = ({ card }) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;
  let flipRotation = 0;
  flipAnimation.addListener(({ value }) => (flipRotation = value));
  const flipToFrontStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };
  const flipToBackStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const [isFlipped, setIsFlipped] = useState(false);

  const flipToFront = useCallback(() => {
    setIsFlipped(false);
    Animated.timing(flipAnimation, {
      toValue: 180,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [Animated, flipAnimation, setIsFlipped]);

  const flipToBack = useCallback(() => {
    setIsFlipped(true);
    Animated.timing(flipAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [Animated, flipAnimation, setIsFlipped]);

  const theme = useTheme();

  return (
    <Displayer>
      <TouchableWithoutFeedback
        onPress={() => (!!flipRotation ? flipToBack() : flipToFront())}
      >
        <View style={styles.container}>
          <Animated.View
            style={{
              ...styles.cardBack,
              ...flipToFrontStyle,
              display: 'flex',
            }}
          >
            <CardDefinition
              card={card.data}
              style={styles.list}
              textStyle={{ fontSize: 24 }}
            />
          </Animated.View>
          <Animated.View style={{ ...styles.cardFront, ...flipToBackStyle }}>
            <View>
              <View style={{ flexDirection: 'row' }}>
                {isGoogleTTSLanguage(card.data.language) && (
                  <PlaySound
                    text={card.data.source}
                    language={card.data.language}
                    size={24}
                    style={{
                      marginRight: 6,
                      alignSelf: 'flex-start',
                      marginTop: 12,
                    }}
                  />
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    flexWrap: 'wrap',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 32,
                      color: theme.colors.secondary,
                      marginRight: 8,
                    }}
                  >
                    {card.data.source}
                  </Text>

                  {(card.data.ipa || card.data.partOfSpeech) && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                      }}
                    >
                      {card.data.ipa && (
                        <Text style={{ marginRight: 8 }}>
                          [{card.data.ipa}]
                        </Text>
                      )}
                      {card.data.partOfSpeech && (
                        <Text style={{ marginRight: 8 }}>
                          {card.data.partOfSpeech}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
              {card.data.example && (
                <View style={{ marginTop: 8, marginLeft: 8 }}>
                  <CardExample
                    example={card.data.example}
                    textStyle={{ fontSize: 18 }}
                  />
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Displayer>
  );
};
