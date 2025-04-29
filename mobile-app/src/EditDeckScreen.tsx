import { NavigationProp } from '@react-navigation/native';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Divider, List, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeleteDeckButton } from './DeleteDeckButton';
import { useSelectedDeck } from './languageDeck/useSelectedDeck';
import { CustomScrollView } from './ui/CustomScrollView';
import { CustomSurface } from './ui/CustomSurface';
import { ListItem } from './ui/ListItem';
import { ScreenTitle } from './ui/ScreenTitle';
import { useCurrentLanguageName } from './useCurrentLanguageName';

type Props = {
  navigation: NavigationProp<any>;
};

export const EditDeckScreen: FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const languageName = useCurrentLanguageName();
  const deck = useSelectedDeck({ autoReload: false });

  return (
    <CustomScrollView>
      <ScreenTitle
        icon="pencil-outline"
        title={`${languageName} deck options`}
        subtitle={
          <Text>
            {deck.deck.cards.length} card
            {deck.deck.cards.length === 1 ? '' : 's'}
          </Text>
        }
      />

      <CustomSurface style={{ marginBottom: 8 }}>
        <List.Item
          title="Study reminders"
          onPress={() => navigation.navigate('Notifications')}
          left={() => (
            <Icon
              name="bell-outline"
              size={24}
              color={theme.colors.onBackground}
              style={{ marginLeft: 24 }}
            />
          )}
          right={() => (
            <Icon
              name="menu-right"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        ></List.Item>
      </CustomSurface>
      <View style={{ paddingHorizontal: 16, marginBottom: 32, gap: 8 }}>
        <Text>
          Study reminders are sent once a day to remind you to review your{' '}
          <Text style={{ fontWeight: 'bold' }}>{languageName}</Text> cards.
        </Text>
      </View>

      <CustomSurface style={{ marginBottom: 32 }}>
        <List.Item
          title="How to edit cards"
          onPress={() => navigation.navigate('HowToEditCards')}
          left={() => (
            <Icon
              name="pencil-outline"
              size={24}
              color={theme.colors.onBackground}
              style={{ marginLeft: 24 }}
            />
          )}
          right={() => (
            <Icon
              name="menu-right"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        ></List.Item>
        <Divider style={{ alignSelf: 'stretch' }} />
        <List.Item
          title="How to group cards"
          onPress={() => navigation.navigate('HowToGroupCards')}
          left={() => (
            <Icon
              name="group"
              size={24}
              color={theme.colors.onBackground}
              style={{ marginLeft: 24 }}
            />
          )}
          right={() => (
            <Icon
              name="menu-right"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        ></List.Item>
        <Divider style={{ alignSelf: 'stretch' }} />
        <List.Item
          title="How to import and export"
          onPress={() => navigation.navigate('HowToImportAndExport')}
          left={() => (
            <Icon
              name="swap-vertical"
              size={24}
              color={theme.colors.onBackground}
              style={{ marginLeft: 24 }}
            />
          )}
          right={() => (
            <Icon
              name="menu-right"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        ></List.Item>
      </CustomSurface>

      <CustomSurface style={{ marginBottom: 32 }}>
        <DeleteDeckButton />
      </CustomSurface>

      <CustomSurface style={{ marginBottom: 8 }}>
        <ListItem
          leftIcon="message-text-outline"
          title="Provide feedback"
          onPress={() => navigation.navigate('Feedback')}
        />
      </CustomSurface>
      <View style={{ paddingHorizontal: 16 }}>
        <Text>
          Are you missing any crucial feature or simply want to share your
          opinion about Vocably with me? I would love to hear from you!
        </Text>
      </View>
    </CustomScrollView>
  );
};
