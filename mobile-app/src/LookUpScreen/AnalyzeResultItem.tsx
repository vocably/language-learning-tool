import { CardItem, Result, TagItem } from '@vocably/model';
import React, { FC, useCallback, useState } from 'react';
import { View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { CardListItem } from '../CardListItem';
import { Deck } from '../languageDeck/useLanguageDeck';
import { mainPadding } from '../styles';
import { TagsSelector } from '../TagsSelector';
import { AssociatedCard } from './associateCards';

type AnalyzeResultItem = FC<{
  onAdd: (card: AssociatedCard) => Promise<Result<CardItem>>;
  onRemove: (card: AssociatedCard) => Promise<Result<true>>;
  onTagsChange: (id: string, tags: TagItem[]) => Promise<Result<true>>;
  item: AssociatedCard;
  deck: Deck;
}>;

export const AnalyzeResultItem: AnalyzeResultItem = ({
  onAdd,
  onRemove,
  onTagsChange: onTagsChangePropFunction,
  item,
  deck,
}) => {
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const toggleCard = useCallback(async () => {
    setIsProcessing(true);
    if (item.id) {
      await onRemove(item);
    } else {
      await onAdd(item);
    }
    setIsProcessing(false);
  }, [setIsProcessing, onAdd, onRemove]);

  const [isSavingTags, setIsSavingTags] = useState(false);

  const onTagsChange = async (newTags: TagItem[]) => {
    if (!item.id) {
      return;
    }
    if (item.card.tags.length === 0 && newTags.length === 0) {
      return;
    }
    setIsSavingTags(true);
    await onTagsChangePropFunction(item.id, newTags);
    setIsSavingTags(false);
  };

  return (
    <View
      style={{
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: mainPadding,
      }}
    >
      <CardListItem
        card={item.card}
        style={{ flex: 1 }}
        showExamples={true}
        savingTagsInProgress={isSavingTags}
        onTagsChange={onTagsChange}
      />
      <View
        style={{
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <IconButton
          icon={!item.id ? 'plus-circle' : 'minus-circle'}
          iconColor={!item.id ? theme.colors.primary : theme.colors.error}
          onPress={toggleCard}
          disabled={isProcessing}
        />
        {item.id && (
          <TagsSelector
            value={item.card.tags}
            onChange={onTagsChange}
            deck={deck}
            renderAnchor={({ openMenu, disabled }) => (
              <IconButton
                icon={'tag-plus'}
                iconColor={theme.colors.primary}
                onPress={openMenu}
                disabled={disabled}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};
