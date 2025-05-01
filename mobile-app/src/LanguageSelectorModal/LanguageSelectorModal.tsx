import { NavigationProp, Route } from '@react-navigation/native';
import { FC, useCallback, useState } from 'react';
import { ListRenderItem, Pressable, SectionList, View } from 'react-native';
import {
  Divider,
  IconButton,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SearchInput } from '../SearchInput';
import { mainPadding } from '../styles';
import { ScreenLayout } from '../ui/ScreenLayout';
import { createLanguageList, LanguageListItem } from './createLanguageList';

type CreateItemProps = {
  insets: EdgeInsets;
  onPress: (language: string) => void;
};
const createItem =
  ({ insets, onPress }: CreateItemProps): ListRenderItem<LanguageListItem> =>
  ({ item }) => {
    const theme = useTheme();
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? theme.colors.inversePrimary
              : theme.colors.background,
          },
          {
            paddingLeft: insets.left + mainPadding,
            paddingRight: insets.right + mainPadding,
            paddingVertical: 16,
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}
        onPress={() => onPress(item.key)}
      >
        <Text style={{ fontSize: 16, flexGrow: 1 }}>{item.label}</Text>
        {item.selected && (
          <Icon
            name="check"
            size={24}
            style={{ color: theme.colors.onBackground }}
          />
        )}
      </Pressable>
    );
  };

type LanguageSelectorModal = FC<{
  navigation: NavigationProp<any>;
  route: Route<
    string,
    {
      title: string;
      selected: string;
      onSelect: (language: string) => void;
      preferred?: string[];
      preferredTitle?: string;
    }
  >;
}>;

export const LanguageSelectorModal: LanguageSelectorModal = ({
  route,
  navigation,
}) => {
  const {
    title,
    selected,
    preferred = [],
    preferredTitle = 'Preferred',
    onSelect,
  } = route.params;
  const theme = useTheme();

  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState('');

  const onPress = useCallback(
    (language: string) => {
      onSelect(language);
      navigation.goBack();
    },
    [onSelect]
  );

  return (
    <ScreenLayout
      header={
        <Surface
          style={{
            paddingLeft: insets.left + mainPadding,
            paddingTop: 8,
            paddingRight: insets.right + mainPadding,
            paddingBottom: mainPadding,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ flexGrow: 1, fontSize: 18 }}>{title}</Text>
            <IconButton
              icon={'close'}
              onPress={() => navigation.goBack()}
              style={{ backgroundColor: 'transparent', marginRight: -8 }}
            />
          </View>
          <SearchInput
            value={searchText}
            placeholder="Search"
            onChange={(value) => {
              setSearchText(value);
            }}
            onSubmit={() => {}}
          />
        </Surface>
      }
      content={
        <SectionList
          contentContainerStyle={{ paddingBottom: insets.bottom + mainPadding }}
          sections={createLanguageList({
            selected,
            preferred,
            preferredTitle,
            searchText,
          })}
          renderItem={createItem({
            insets,
            onPress,
          })}
          renderSectionHeader={({ section: { title } }) => (
            <Text
              style={{
                paddingLeft: insets.left + mainPadding,
                paddingRight: insets.right + mainPadding,
                paddingVertical: 16,
                fontWeight: 'bold',
                backgroundColor: theme.colors.background,
              }}
            >
              {title}
            </Text>
          )}
          ItemSeparatorComponent={Divider}
        />
      }
    />
  );
};
