import { NavigationProp, Route } from '@react-navigation/native';
import { CardItem, TagItem } from '@vocably/model';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Appbar, Button, Chip, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardForm } from './CardForm';
import { useLanguageDeck } from './languageDeck/useLanguageDeck';
import { Loader } from './loaders/Loader';
import { TagsSelector } from './TagsSelector';
import { CustomScrollView } from './ui/CustomScrollView';
import { ScreenTitle } from './ui/ScreenTitle';

export type EditCardParams = {
  card: CardItem;
};

type Props = {
  route: Route<string, any>;
  navigation: NavigationProp<any>;
};

export const EditCardScreen: FC<Props> = ({ route, navigation }) => {
  const { card } = route.params as EditCardParams;

  const deck = useLanguageDeck({
    language: card.data.language,
    autoReload: false,
  });

  const [cardData, setCardData] = useState({ ...card.data });
  const [isUpdating, setIsUpdating] = useState(false);
  const [savingTags, setSavingTags] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const theme = useTheme();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    setCardData({ ...card.data });
  }, [card]);

  const onUpdate = useCallback(async () => {
    setIsUpdating(true);
    const updateResult = await deck.update(card.id, cardData);
    if (updateResult.success === false) {
      Alert.alert(
        'Error: Card update failed',
        `Oops! Something went wrong while attempting to update the card. Please try again.`
      );
    }
    navigation.goBack();
  }, [cardData, deck.update, card]);

  const onTagsChange = async (tags: TagItem[]) => {
    cardData.tags = tags;
    setSavingTags(true);
    const updateResult = await deck.update(card.id, cardData);
    setSavingTags(false);
    if (updateResult.success === false) {
      Alert.alert(
        'Error: Card update failed',
        `Oops! Something went wrong while attempting to update the card. Please try again.`
      );
    }
  };

  const onDelete = async () => {
    Alert.alert(
      'Delete this card?',
      'This operation can not be undone.',
      [
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            const deleteResult = await deck.remove(card.id);
            if (deleteResult.success === false) {
              setIsDeleting(false);
              Alert.alert('Unable to delete the card. Please try again.');
              return;
            }
            navigation.goBack();
          },
        },
        { text: 'Cancel', onPress: () => {} },
      ],
      { cancelable: true }
    );
  };

  if (isDeleting) {
    return (
      <View style={{ flex: 1 }}>
        <Loader>Deleting card...</Loader>
      </View>
    );
  }

  return (
    <>
      <Appbar.Header statusBarHeight={0} elevated={true}>
        <Appbar.Action
          icon={'close'}
          size={24}
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: 'transparent' }}
        />
        <Appbar.Content title="" />
        <Button loading={isUpdating} disabled={isUpdating} onPress={onUpdate}>
          Save
        </Button>
      </Appbar.Header>
      <CustomScrollView automaticallyAdjustKeyboardInsets={true}>
        <ScreenTitle icon="pencil" title="Edit card" />
        <View style={{ gap: 16 }}>
          <View
            style={{
              alignItems: 'flex-start',
            }}
          >
            <TagsSelector
              value={cardData.tags}
              onChange={onTagsChange}
              deck={deck}
              renderAnchor={({ openMenu, disabled }) => (
                <Button
                  onPress={openMenu}
                  disabled={disabled}
                  icon={'tag'}
                  loading={savingTags}
                >
                  Add or remove card tags (folders)
                </Button>
              )}
            />
            {cardData.tags.length > 0 && (
              <View
                style={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  minHeight: 36,
                }}
              >
                {cardData.tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    selectedColor={theme.colors.outlineVariant}
                    mode="outlined"
                    onClose={() =>
                      onTagsChange(cardData.tags.filter((t) => t.id !== tag.id))
                    }
                  >
                    {tag.data.title}
                  </Chip>
                ))}
              </View>
            )}
          </View>

          <CardForm
            card={cardData}
            onChange={(newCardData) => {
              setCardData({
                ...cardData,
                ...newCardData,
              });
            }}
          />

          <Button
            icon={'delete'}
            textColor={theme.colors.error}
            onPress={onDelete}
            style={{ alignSelf: 'flex-start', marginTop: 24 }}
          >
            Delete this card
          </Button>
        </View>
      </CustomScrollView>
    </>
  );
};
