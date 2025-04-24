import { FC } from 'react';

import { Theme, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import { AccountScreen } from './AccountScreen';
import { MainMenuHeader } from './MainMenuHeader';
import { SettingsScreen } from './SettingsScreen';
import { StudySettingsScreen } from './StudySettingsScreen';

const Stack = createStackNavigator();

export const SettingsStack: FC = () => {
  const navigation = useNavigation();

  const theme = useTheme() as Theme & MD3Theme;
  return (
    <View
      style={{
        flex: 1,
        overflow: 'hidden',
      }}
    >
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="MainMenu"
          options={{
            headerShown: false,
          }}
          component={SettingsScreen}
        />
        <Stack.Screen
          options={{
            header: MainMenuHeader,
            title: 'Settings',
          }}
          name="AccountMenu"
          component={AccountScreen}
        />

        <Stack.Screen
          options={{
            header: MainMenuHeader,
            title: 'Settings',
          }}
          name="StudySettings"
          component={StudySettingsScreen}
        />
      </Stack.Navigator>
    </View>
  );
};
