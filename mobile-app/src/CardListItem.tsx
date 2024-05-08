import { Card, CardItem, isGoogleTTSLanguage } from '@vocably/model';
import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import { CardDefinition } from './CardDefinition';
import { CardExample } from './CardExample';
import { PlaySound } from './PlaySound';
import { mainPadding } from './styles';

type CardListItem = FC<{
  card: Card;
  style?: StyleProp<ViewStyle>;
  showExamples?: boolean;
}>;

export const CardListItem: CardListItem = ({
  card,
  style,
  showExamples = false,
}) => {
  const theme = useTheme();
  return (
    <View
      style={[
        style,
        {
          paddingHorizontal: mainPadding,
          paddingVertical: 16,
        },
      ]}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline',
          flexWrap: 'nowrap',
        }}
      >
        {isGoogleTTSLanguage(card.language) && (
          <View
            style={{ paddingTop: 6, alignSelf: 'flex-start', marginRight: 6 }}
          >
            <PlaySound text={card.source} language={card.language} size={22} />
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'baseline',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              color: theme.colors.secondary,
              marginRight: 8,
            }}
          >
            {card.source}
          </Text>

          {card.ipa && <Text style={{ marginRight: 8 }}>[{card.ipa}]</Text>}

          {card.partOfSpeech && <Text>{card.partOfSpeech}</Text>}
        </View>
      </View>
      <CardDefinition card={card} />
      {showExamples && card.example && (
        <View style={{ marginStart: 10, marginTop: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>Examples</Text>
          <CardExample example={card.example} />
        </View>
      )}
    </View>
  );
};

export const Separator: FC = () => <Divider />;

export const keyExtractor: (item: CardItem) => string = (item) => item.id;
