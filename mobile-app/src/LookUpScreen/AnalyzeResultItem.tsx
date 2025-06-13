import { CardItem, Result, TagItem } from '@vocably/model';
import React, { FC, useState } from 'react';
import { PixelRatio, View } from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import { CardListItem } from '../CardListItem';
import { Deck } from '../languageDeck/useLanguageDeck';
import { presentPaywall } from '../presentPaywall';
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
  leftInset?: number;
  rightInset?: number;
  cardsLimit?: number | 'unlimited';
}>;

export const AnalyzeResultItem: AnalyzeResultItem = ({
  onAdd,
  onRemove,
  onTagsChange: onTagsChangePropFunction,
  item,
  deck,
  hideOperations = false,
  leftInset = 0,
  rightInset = 0,
  cardsLimit = 'unlimited',
}) => {
  const theme = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const canAdd =
    cardsLimit === 'unlimited' || cardsLimit > deck.deck.cards.length;

  const [isBannerVisible, setIsBannerVisible] = useState(false);

  const toggleCard = async () => {
    setIsProcessing(true);
    if (item.id) {
      await onRemove(item);
      setIsBannerVisible(false);
    } else if (canAdd) {
      await onAdd(item);
    } else {
      setIsBannerVisible(true);
    }
    setIsProcessing(false);
  };

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
    <View>
      {!canAdd && isBannerVisible && (
        <View
          style={{
            paddingLeft: leftInset + mainPadding,
            // Align ⊕ button with the 🔎
            paddingRight: rightInset + 16,
            paddingTop: 24,
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <Text>
            The size of your collection has reached the limited of {cardsLimit}{' '}
            cards. Update your subscription to keep adding cards.
          </Text>
          <Button mode="contained" onPress={() => presentPaywall()}>
            Upgrade
          </Button>
        </View>
      )}
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexDirection: 'row',
          paddingLeft: leftInset + mainPadding,
          // Align ⊕ button with the 🔎
          paddingRight: rightInset + 16,
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
              marginTop: 16,
              // To prevent jumping
              height: 90,
            }}
          >
            <IconButton
              icon={!item.id ? 'plus-circle-outline' : 'bookmark-check'}
              animated={true}
              iconColor={
                canAdd || item.id
                  ? theme.colors.primary
                  : theme.colors.onSurface
              }
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
    </View>
  );
};
