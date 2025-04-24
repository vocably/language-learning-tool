import { NavigationProp } from '@react-navigation/native';
import React, { FC } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Divider, List, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeleteDeckButton } from './DeleteDeckButton';

type Props = {
  navigation: NavigationProp<any>;
};

export const EditDeckScreen: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}
      >
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
        <Divider style={{ alignSelf: 'stretch', marginBottom: 16 }} />
        <View
          style={{
            gap: 16,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <DeleteDeckButton />
          <Divider style={{ alignSelf: 'stretch' }} />
          <Text>Are you looking for a specific feature?</Text>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Feedback')}
          >
            Yes, provide feedback
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};
