import { Analysis, CardItem, Result, TagItem } from '@vocably/model';
import React, { FC } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Separator } from '../CardListItem';
import { Deck } from '../languageDeck/useLanguageDeck';
import { AnalyzeResultItem } from './AnalyzeResultItem';
import { associateCards, AssociatedCard } from './associateCards';
import { makeCards } from './makeCards';

type Props = {
  analysis: Analysis;
  cards: CardItem[];
  onAdd: (card: AssociatedCard) => Promise<Result<CardItem>>;
  onRemove: (card: AssociatedCard) => Promise<Result<true>>;
  onTagsChange: (id: string, tags: TagItem[]) => Promise<Result<true>>;
  style?: StyleProp<ViewStyle>;
  deck: Deck;
};

export const AnalyzeResult: FC<Props> = ({
  analysis,
  style,
  cards,
  onAdd,
  onRemove,
  onTagsChange,
  deck,
}) => {
  const associatedCards = associateCards(makeCards(analysis), cards);

  return (
    <View>
      {associatedCards.map((item, index) => (
        <View key={`${item.card.source}${item.card.partOfSpeech}`}>
          {index > 0 && <Separator />}
          <AnalyzeResultItem
            onAdd={onAdd}
            onRemove={onRemove}
            onTagsChange={onTagsChange}
            item={item}
            deck={deck}
          />
        </View>
      ))}
    </View>
  );
};
