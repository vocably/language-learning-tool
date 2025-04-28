import { CardItem, Result, TagItem } from '@vocably/model';
import React, { FC, useCallback, useState } from 'react';
import { PixelRatio, View } from 'react-native';
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
  hideOperations?: boolean;
}>;

export const AnalyzeResultItem: AnalyzeResultItem = ({
  onAdd,
  onRemove,
  onTagsChange: onTagsChangePropFunction,
  item,
  deck,
  hideOperations = false,
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

  const fontScale = PixelRatio.getFontScale();

  return (
    <View
      style={{
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingLeft: mainPadding,
        // Align ⊕ button with the 🔎
        paddingRight: 16,
      }}
    >
      <CardListItem
        card={item.card}
        style={{ flex: 1, paddingVertical: 16 }}
        showExamples={true}
        savingTagsInProgress={isSavingTags}
        onTagsChange={onTagsChange}
        allowCopy={true}
      />
      {!hideOperations && (
        <View
          style={{
            marginTop: 12,
            // To prevent jumping
            height: 87,
          }}
        >
          <IconButton
            icon={!item.id ? 'plus-circle-outline' : 'bookmark-check'}
            animated={true}
            iconColor={theme.colors.primary}
            onPress={toggleCard}
            disabled={isProcessing}
            style={{ margin: 0 }}
            size={24 * fontScale}
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
                  style={{ margin: 0 }}
                  size={24 * fontScale}
                />
              )}
            />
          )}
        </View>
      )}
    </View>
  );
};
