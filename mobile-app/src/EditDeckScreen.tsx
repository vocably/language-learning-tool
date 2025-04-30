import { NavigationProp } from '@react-navigation/native';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
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
        <ListItem
          title="Study reminders"
          onPress={() => navigation.navigate('Notifications')}
          leftIcon="bell-outline"
          rightIcon="menu-right"
        ></ListItem>
      </CustomSurface>
      <View style={{ paddingHorizontal: 16, marginBottom: 32, gap: 8 }}>
        <Text>
          Study reminders are sent once a day to remind you to review your{' '}
          <Text style={{ fontWeight: 'bold' }}>{languageName}</Text> cards.
        </Text>
      </View>

      <CustomSurface style={{ marginBottom: 32 }}>
        <ListItem
          order="first"
          title="How to edit cards"
          onPress={() => navigation.navigate('HowToEditCards')}
          leftIcon="pencil-outline"
          rightIcon="menu-right"
        ></ListItem>
        <Divider style={{ alignSelf: 'stretch' }} />
        <ListItem
          order="middle"
          title="How to group cards"
          onPress={() => navigation.navigate('HowToGroupCards')}
          leftIcon="group"
          rightIcon="menu-right"
        ></ListItem>
        <Divider style={{ alignSelf: 'stretch' }} />
        <ListItem
          order="last"
          title="How to import and export"
          onPress={() => navigation.navigate('HowToImportAndExport')}
          leftIcon="swap-vertical"
          rightIcon="menu-right"
        ></ListItem>
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
