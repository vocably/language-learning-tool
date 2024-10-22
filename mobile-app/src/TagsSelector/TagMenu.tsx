import { Result, TagItem } from '@vocably/model';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Divider,
  Menu,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Sentry } from '../BetterSentry';
import { swipeListButtonPressOpacity } from '../stupidConstants';
import { VocablyInputText } from '../VocablyInputText';
import { TagMenuAnchor, TagMenuAnchorProps } from './TagMenuAnchor';

export type Tag = {
  id?: TagItem['id'];
  data: TagItem['data'];
};

const isExistingTag = (tag: Tag): tag is TagItem => {
  return !!tag.id;
};

type Props = {
  isAllowedToAdd?: boolean;
  value: TagItem[];
  existingTags: TagItem[];
  removeTag: (id: string) => Promise<Result<true>>;
  updateTag: (
    id: string,
    data: Partial<Tag['data']>
  ) => Promise<Result<TagItem>>;
  renderAnchor: TagMenuAnchorProps['renderAnchor'];
  triggerChangeOnSelect?: boolean;
  onChange?: (tags: Tag[]) => Promise<any>;
  disabled?: boolean;
  isLoading?: boolean;
};

const SWIPE_MENU_BUTTON_SIZE = 50;
const MENU_WIDTH = 250;
const ITEM_FONT_SIZE = 18;

export const extractKey = (tag: Tag) => tag.id ?? tag.data.title;

export const TagsMenu: FC<Props> = ({
  value,
  existingTags,
  removeTag,
  updateTag,
  disabled = false,
  onChange,
  isAllowedToAdd = true,
  renderAnchor,
  triggerChangeOnSelect = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [newTags, setNewTags] = useState<Tag[]>([]);
  const [newSelectedTags, setNewSelectedTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<TagItem[]>([]);
  const [isRemovingTagId, setIsRemovingTagId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editTag, setEditTag] = useState<Tag | null>(null);
  const theme = useTheme();

  useEffect(() => {
    setSelectedTags(value);
  }, [value]);

  const openMenu = () => {
    setNewTags([]);
    setNewSelectedTags([]);
    setVisible(true);
  };
  const closeMenu = () => {
    setVisible(false);
    onChange && onChange([...newSelectedTags, ...selectedTags]);
  };

  const addNewTag = (title: string) => {
    if (title === '') {
      return;
    }

    const newTag: Tag = {
      data: {
        title,
      },
    };
    setNewTags([newTag, ...newTags]);
    setNewSelectedTags([newTag, ...newSelectedTags]);

    Sentry.captureMessage('A new tag added (but not saved).');
  };

  const isSelectedTag = (tag: Tag): boolean => {
    if (isExistingTag(tag)) {
      return selectedTags.some((t) => t.id === tag.id);
    }

    return newSelectedTags.includes(tag);
  };

  const newTagPressed = (tag: Tag) => {
    if (isSelectedTag(tag)) {
      setNewSelectedTags(newSelectedTags.filter((t) => t !== tag));
    } else {
      setNewSelectedTags([tag, ...newSelectedTags]);
    }
  };

  const existingTagPressed = (tag: TagItem) => {
    const tags = isSelectedTag(tag)
      ? selectedTags.filter((t) => t.id !== tag.id)
      : [...selectedTags, tag];

    setSelectedTags(tags);

    if (triggerChangeOnSelect && onChange) {
      onChange(tags);
    }
  };

  const tagPressed = (tag: Tag) => () => {
    if (isExistingTag(tag)) {
      existingTagPressed(tag);
    } else {
      newTagPressed(tag);
    }
  };

  const deleteTagPressed = (tag: Tag) => async () => {
    Sentry.captureMessage('Tag deleted.');

    if (!isExistingTag(tag)) {
      setNewTags(newTags.filter((t) => t !== tag));
      setNewSelectedTags(newSelectedTags.filter((t) => t !== tag));

      return;
    }

    setIsRemovingTagId(tag.id);
    const removeResult = await removeTag(tag.id);
    if (removeResult.success === false) {
      Alert.alert(
        'An error occurred while removing the tag. Please try again.'
      );
    }
    setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    setIsRemovingTagId(null);
  };

  const updateNewTag = useCallback(
    (tagToUpdate: Tag, newData: Partial<Tag['data']>) => {
      const newTag = {
        ...tagToUpdate,
        data: {
          ...tagToUpdate.data,
          ...newData,
        },
      };

      setNewTags((newTags) =>
        newTags.map((tag) => (tag === tagToUpdate ? newTag : tag))
      );
      setNewSelectedTags((newSelectedTags) =>
        newSelectedTags.map((tag) => (tag === tagToUpdate ? newTag : tag))
      );
    },
    [setNewTags, setNewSelectedTags]
  );

  const updateExistingTag = useCallback(
    async (id: string, data: Partial<Tag['data']>): Promise<any> => {
      setUpdatingId(id);
      const result = await updateTag(id, data);
      setUpdatingId(null);
      if (result.success === false) {
        Alert.alert(
          'An error occurred while update the tag. Please try again.'
        );
        return;
      }

      setSelectedTags((selectedTags) =>
        selectedTags.map((selectedTag) => {
          if (selectedTag.id === result.value.id) {
            return result.value;
          }

          return selectedTag;
        })
      );
    },
    [setSelectedTags, updateTag, setUpdatingId]
  );

  const [isTagFormVisible, setShowTagForm] = useState(false);
  const [tagFormValue, setTagFormValue] = useState('');

  const displayCreateModal = () => {
    setTagFormValue('');
    setEditTag(null);
    setShowTagForm(true);
  };

  const editTagPressed = (tag: Tag, row: SwipeRow<Tag> | undefined) => {
    row && row.closeRow();
    setEditTag(tag);
    setTagFormValue(tag.data.title);
    setShowTagForm(true);
  };

  const tags = [...newTags, ...existingTags];

  return (
    <>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        style={{
          width: MENU_WIDTH,
        }}
        contentStyle={{
          width: MENU_WIDTH,
        }}
        anchor={
          <TagMenuAnchor
            renderAnchor={renderAnchor}
            openMenu={openMenu}
            disabled={disabled}
          />
        }
      >
        <View
          style={{
            minWidth: MENU_WIDTH,
          }}
        >
          {isAllowedToAdd && tags.length === 0 && (
            <>
              <View
                style={{
                  padding: 12,
                }}
              >
                <Text>
                  Tags are like groups, or folders, but better. Press "Add new
                  tag" to begin.
                </Text>
              </View>
              <Divider />
            </>
          )}
          {isAllowedToAdd && (
            <Menu.Item
              leadingIcon={'tag-plus'}
              onPress={() => displayCreateModal()}
              title="Add new tag"
              titleStyle={{
                fontSize: ITEM_FONT_SIZE,
              }}
            />
          )}
          {isAllowedToAdd && tags.length > 0 && <Divider />}
          <SwipeListView<Tag>
            data={tags}
            keyExtractor={extractKey}
            ItemSeparatorComponent={Divider}
            renderItem={({ item: tag }) => (
              <Pressable
                onPress={tagPressed(tag)}
                style={{
                  backgroundColor: theme.colors.elevation.level2,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  // This is to prevent the swipe menu
                  // from flashing occasionally
                  borderWidth: 1,
                  borderColor: 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: ITEM_FONT_SIZE,
                    marginRight: 6,
                  }}
                >
                  {tag.data.title}
                </Text>
                <Icon
                  name="check"
                  size={18}
                  color={theme.colors.onBackground}
                  style={{
                    opacity: isSelectedTag(tag) ? 1 : 0,
                  }}
                />
                <ActivityIndicator
                  size={18}
                  color={theme.colors.onBackground}
                  style={{
                    marginLeft: 8,
                    opacity: tag.id === updatingId ? 1 : 0,
                  }}
                />
              </Pressable>
            )}
            renderHiddenItem={(data, rowMap) => (
              <View
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  // Otherwise, Android displays it poorly on close
                  opacity: visible ? 1 : 0,
                }}
              >
                <Pressable
                  onPress={deleteTagPressed(data.item)}
                  disabled={isRemovingTagId !== null}
                  style={({ pressed }) => [
                    {
                      height: SWIPE_MENU_BUTTON_SIZE,
                      display: 'flex',
                      backgroundColor: theme.colors.error,
                      width: SWIPE_MENU_BUTTON_SIZE,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? swipeListButtonPressOpacity : 1,
                    },
                  ]}
                >
                  {isRemovingTagId === data.item.id ? (
                    <ActivityIndicator
                      size={24}
                      color={theme.colors.onSecondary}
                    />
                  ) : (
                    <Icon
                      name="delete-outline"
                      size={24}
                      color={theme.colors.onSecondary}
                    />
                  )}
                </Pressable>
                <Pressable
                  onPress={() => {
                    editTagPressed(data.item, rowMap[extractKey(data.item)]);
                  }}
                  disabled={isRemovingTagId !== null}
                  style={({ pressed }) => [
                    {
                      marginLeft: 'auto',
                      height: SWIPE_MENU_BUTTON_SIZE,
                      display: 'flex',
                      backgroundColor: theme.colors.primary,
                      width: SWIPE_MENU_BUTTON_SIZE,
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: pressed ? swipeListButtonPressOpacity : 1,
                    },
                  ]}
                >
                  <Icon
                    name="file-edit-outline"
                    size={24}
                    color={theme.colors.onPrimary}
                  />
                </Pressable>
              </View>
            )}
            leftOpenValue={SWIPE_MENU_BUTTON_SIZE}
            rightOpenValue={-SWIPE_MENU_BUTTON_SIZE}
          />
          {tags.length === 1 && (
            <>
              <Divider />
              <View
                style={{
                  padding: 12,
                  gap: 12,
                }}
              >
                <Text>Tap the tag to check or uncheck it.</Text>
                <Text>Swipe left to edit the tag.</Text>
                <Text>
                  Swipe right to delete the tag. Your cards will not be deleted.
                </Text>
              </View>
            </>
          )}
        </View>
        {isTagFormVisible && (
          <Portal>
            <Dialog
              visible={true}
              onDismiss={() => setShowTagForm(false)}
              style={{
                width: 300,
                alignSelf: 'center',
                marginBottom: 90,
              }}
            >
              <Dialog.Title>
                {editTag === null
                  ? `Add new tag`
                  : `Edit ${editTag.data.title}`}
              </Dialog.Title>
              <Dialog.Content>
                <VocablyInputText
                  value={tagFormValue}
                  onChange={(value) => setTagFormValue(value)}
                  onSubmit={(title) => {
                    addNewTag(title);
                    setShowTagForm(false);
                  }}
                  autoFocus={true}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setShowTagForm(false)}>Cancel</Button>
                <Button
                  onPress={() => {
                    const title = tagFormValue.trim();
                    setShowTagForm(false);

                    if (title === '') {
                      return;
                    }

                    if (editTag === null) {
                      addNewTag(title);
                    } else if (editTag.id === undefined) {
                      updateNewTag(editTag, {
                        title,
                      });
                    } else {
                      updateExistingTag(editTag.id, {
                        title,
                      }).then();
                    }
                  }}
                  mode="contained"
                  style={{
                    minWidth: 114,
                  }}
                  disabled={tagFormValue.trim().length === 0}
                >
                  {editTag === null ? 'Add' : 'Save'}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        )}
      </Menu>
    </>
  );
};
