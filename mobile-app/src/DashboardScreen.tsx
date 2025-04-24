import { useNetInfo } from '@react-native-community/netinfo';
import { NavigationProp } from '@react-navigation/native';
import {
  byDate,
  CardItem,
  GoogleLanguage,
  languageList,
  TagItem,
} from '@vocably/model';
import { usePostHog } from 'posthog-react-native';
import React, {
  FC,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  PixelRatio,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Appbar,
  Button,
  Chip,
  Text,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CardListItem, Separator } from './CardListItem';
import {
  DashboardSearchInput,
  DashboardSearchInputRef,
} from './DashboardSearchInput';
import { useSelectedDeck } from './languageDeck/useSelectedDeck';
import { LanguagesContext } from './languages/LanguagesContainer';
import { LanguageSelector } from './LanguageSelector';
import { Loader } from './loaders/Loader';
import { swipeListButtonPressOpacity } from './stupidConstants';
import { mainPadding } from './styles';
import { TagsSelector } from './TagsSelector';

const SWIPE_MENU_BUTTON_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  swipeList: {
    width: '100%',
  },
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const filterByLowercasedText =
  (lowercasedText: string) =>
  (cardItem: CardItem): boolean => {
    if (cardItem.data.source.toLowerCase().includes(lowercasedText)) {
      return true;
    }

    if (cardItem.data.translation.toLowerCase().includes(lowercasedText)) {
      return true;
    }

    if (
      cardItem.data.tags.length > 0 &&
      cardItem.data.tags.some((tag) =>
        tag.data.title.toLowerCase().includes(lowercasedText)
      )
    ) {
      return true;
    }

    return false;
  };

export const keyExtractor: (item: CardItem) => string = (item) =>
  // The tags thingy is needed to forcefully recalculate the height
  // of the row so left and right swipe buttons look nice
  item.id + item.data.tags.map((tag) => tag.id).join('');

type Props = {
  navigation: NavigationProp<any>;
};

export const DashboardScreen: FC<Props> = ({ navigation }) => {
  const selectedDeck = useSelectedDeck({
    autoReload: true,
  });
  const {
    deck,
    reload,
    status,
    remove,
    update,
    selectedTags,
    setSelectedTagIds,
    filteredCards,
  } = selectedDeck;
  const { refreshLanguages } = useContext(LanguagesContext);
  const theme = useTheme();
  const netInfo = useNetInfo();
  const { languages } = useContext(LanguagesContext);

  const [refreshing, setRefreshing] = useState(false);
  const [toBeDeletedId, setToBeDeletedId] = useState<string | null>(null);
  const [editPanelHeight, setEditPanelHeight] = useState(100);
  const [savingTagsForId, setSavingTagsForId] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshLanguages();
    await reload();
    setRefreshing(false);
  }, [setRefreshing, refreshLanguages, reload]);

  const deleteCard = useCallback(
    async (id: string) => {
      setToBeDeletedId(id);
      const deleteResult = await remove(id);
      if (deleteResult.success === false) {
        Alert.alert(
          'Error: Card deletion failed',
          `Oops! Something went wrong while attempting to delete the card. Please try again later.`
        );
      }
      setToBeDeletedId(null);
    },
    [remove]
  );

  const onTagsChange = useCallback(
    (cardItem: CardItem) => async (newTags: TagItem[]) => {
      if (cardItem.data.tags.length === 0 && newTags.length === 0) {
        return;
      }
      setSavingTagsForId(cardItem.id);
      await update(cardItem.id, {
        tags: newTags,
      });
      setSavingTagsForId(null);
    },
    [update]
  );

  const postHog = usePostHog();

  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const canBeSearched = deck.cards.length > 4;
  const cards = useMemo(() => {
    if (!canBeSearched || !isSearching || searchText === '') {
      return filteredCards.sort(byDate);
    }

    return filteredCards
      .sort(byDate)
      .filter(filterByLowercasedText(searchText.toLowerCase()));
  }, [filteredCards, searchText, isSearching]);

  const searchInputRef = useRef<DashboardSearchInputRef>(null);

  if (deck.cards.length === 0 && status === 'loading') {
    return <Loader>Loading cards...</Loader>;
  }

  const isEmpty = deck.cards.length === 0;

  const fontScale = Math.max(1, PixelRatio.getFontScale());

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: editPanelHeight,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <Pressable
        onPress={() => {
          if (searchInputRef.current) {
            searchInputRef.current.blur();
          }
        }}
      >
        <Appbar.Header>
          <Appbar.Content
            style={{
              alignItems: 'flex-start',
              marginLeft: Platform.OS === 'android' ? 28 : -24,
            }}
            title={languageList[deck.language as GoogleLanguage] ?? ''}
          />

          {canBeSearched && (
            <Appbar.Action
              icon={isSearching ? 'magnify-remove-outline' : 'magnify'}
              onPress={() => setIsSearching(!isSearching)}
              size={24 * fontScale}
            />
          )}
          {languages.length > 1 && <LanguageSelector />}
        </Appbar.Header>
      </Pressable>
      {!isEmpty && (
        <View
          style={{
            paddingHorizontal: mainPadding,
          }}
        >
          <View
            style={{
              position: 'relative',
              marginBottom: 8,
            }}
          >
            {canBeSearched && isSearching && (
              <DashboardSearchInput
                value={searchText}
                ref={searchInputRef}
                onChange={(text) => {
                  setSearchText(text);
                }}
                style={{
                  height: 40 * fontScale,
                }}
              />
            )}
            {(!canBeSearched || !isSearching) && (
              <>
                <Button
                  style={{
                    height: 40 * fontScale,
                    justifyContent: 'center',
                  }}
                  labelStyle={{
                    fontSize: 18,
                  }}
                  mode={'contained'}
                  onPress={() => navigation.navigate('Study')}
                  disabled={cards.length === 0 || !netInfo.isInternetReachable}
                >
                  Study{selectedTags.length > 0 ? ' selected tags' : ''}
                </Button>
                {deck.tags.length > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      justifyContent: 'center',
                    }}
                  >
                    <TagsSelector
                      value={selectedTags}
                      onChange={async (tags) => {
                        await setSelectedTagIds(tags.map((t) => t.id));
                        postHog.capture('practice_tags_selected', {
                          tags: tags.map((t) => t.data.title).join(', '),
                        });
                      }}
                      isAllowedToAdd={false}
                      deck={selectedDeck}
                      renderAnchor={({ openMenu, disabled }) => (
                        <Pressable
                          style={({ pressed }) => [
                            {
                              opacity: pressed ? 0.8 : 1,
                              padding: 8,
                            },
                          ]}
                          hitSlop={20}
                          onPress={openMenu}
                          disabled={disabled}
                        >
                          <Icon
                            name={'tag'}
                            color={theme.colors.onPrimary}
                            size={22 * fontScale}
                          />
                        </Pressable>
                      )}
                    />
                  </View>
                )}
              </>
            )}
          </View>
          {selectedTags.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center',
                marginBottom: 8,
                flexWrap: 'wrap',
              }}
            >
              <Text>Selected tags: </Text>
              {selectedTags.map((tag) => (
                // Wrap the chip in view to fix the close button on Android
                <View key={tag.id}>
                  <Chip
                    mode="outlined"
                    selectedColor={theme.colors.outlineVariant}
                    onClose={() =>
                      setSelectedTagIds(
                        selectedTags
                          .filter((selectedTag) => selectedTag.id !== tag.id)
                          .map((t) => t.id)
                      )
                    }
                  >
                    {tag.data.title}
                  </Chip>
                </View>
              ))}
            </View>
          )}
          {!netInfo.isInternetReachable && (
            <Text style={{ textAlign: 'left', color: theme.colors.secondary }}>
              <Icon name="connection" /> Study mode isn't available right now as
              it looks like your device is offline. Please connect to the
              internet and try again later.
            </Text>
          )}
        </View>
      )}
      <SwipeListView<CardItem>
        onRefresh={onRefresh}
        refreshing={refreshing}
        style={styles.swipeList}
        data={cards}
        ItemSeparatorComponent={Separator}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('EditCardModal', { card: item })}
            style={{
              backgroundColor: theme.colors.background,
              // This is to prevent the swipe menu
              // from flashing occasionally
              borderWidth: 1,
              borderColor: 'transparent',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: mainPadding,
            }}
          >
            <CardListItem
              savingTagsInProgress={savingTagsForId === item.id}
              card={item.data}
              style={{ flex: 1, paddingVertical: 16 }}
              onTagsChange={onTagsChange(item)}
            />
          </Pressable>
        )}
        renderHiddenItem={(data, rowMap) => (
          <View
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              // This is to prevent the swipe menu
              // from flashing occasionally
              borderWidth: 2,
              borderColor: 'transparent',
              borderStyle: 'solid',
              overflow: 'hidden',
            }}
          >
            <Pressable
              onPress={() => deleteCard(data.item.id)}
              disabled={toBeDeletedId === data.item.id}
              style={({ pressed }) => [
                {
                  backgroundColor: theme.colors.error,
                  width: SWIPE_MENU_BUTTON_SIZE,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  opacity: pressed ? swipeListButtonPressOpacity : 1,
                },
              ]}
            >
              {toBeDeletedId === data.item.id ? (
                <ActivityIndicator size={32} color={theme.colors.onSecondary} />
              ) : (
                <Icon
                  name="delete-outline"
                  size={32}
                  color={theme.colors.onSecondary}
                />
              )}
            </Pressable>

            <View
              style={{
                marginLeft: 'auto',
              }}
            >
              <TagsSelector
                value={data.item.data.tags}
                onChange={async (tags) => {
                  // We need to close the row and wait so the item
                  // gets properly refreshed after tags are set
                  rowMap[keyExtractor(data.item)].closeRow();
                  await new Promise((resolve) => setTimeout(resolve, 400));
                  await onTagsChange(data.item)(tags);
                }}
                deck={selectedDeck}
                renderAnchor={({ openMenu, disabled }) => (
                  <Pressable
                    style={({ pressed }) => [
                      {
                        backgroundColor: theme.colors.primary,
                        width: SWIPE_MENU_BUTTON_SIZE,
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        opacity: pressed ? swipeListButtonPressOpacity : 1,
                      },
                    ]}
                    hitSlop={20}
                    onPress={openMenu}
                    disabled={disabled}
                  >
                    <Icon
                      name={'tag-plus'}
                      color={theme.colors.onPrimary}
                      style={{ fontSize: 22 }}
                    />
                  </Pressable>
                )}
              />
            </View>
          </View>
        )}
        leftOpenValue={SWIPE_MENU_BUTTON_SIZE}
        rightOpenValue={-SWIPE_MENU_BUTTON_SIZE}
        contentContainerStyle={isEmpty && styles.emptyContentContainer}
        ListEmptyComponent={
          <View style={{ paddingHorizontal: mainPadding }}>
            {selectedTags.length === 0 && <Text>Card list is empty.</Text>}
            {selectedTags.length === 1 && (
              <Text>
                You don't yet have cards marked with the{' '}
                <Text style={{ fontWeight: 'bold' }}>
                  {selectedTags[0].data.title}
                </Text>{' '}
                tag.
              </Text>
            )}
            {selectedTags.length > 1 && (
              <Text>
                You don't yet have cards marked with the selected tags.
              </Text>
            )}
          </View>
        }
        ListHeaderComponentStyle={{
          paddingHorizontal: mainPadding,
        }}
      />
      <View
        style={{
          paddingLeft: mainPadding,
          paddingRight: mainPadding,
          paddingTop: 12,
          paddingBottom: 12,
          position: 'absolute',
          display: 'flex',
          bottom: 0,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          left: insets.left,
        }}
        onLayout={(e) => setEditPanelHeight(e.nativeEvent.layout.height)}
      >
        <Button compact={true} onPress={() => navigation.navigate('EditDeck')}>
          Edit deck
        </Button>
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: theme.colors.secondary,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 24,
            minWidth: 24 * fontScale,
            minHeight: 18 * fontScale,
            paddingHorizontal: 6,
            paddingVertical: 3,
          }}
        >
          <Text
            style={{
              color: theme.colors.onSecondary,
              fontSize: 12,
            }}
          >
            {cards.length}
          </Text>
        </View>
      </View>
    </View>
  );
};
