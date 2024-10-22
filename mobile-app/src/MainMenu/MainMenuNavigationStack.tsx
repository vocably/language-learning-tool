import { FC } from 'react';

import {
  NavigationContainer,
  Theme,
  useNavigation,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import { MD3Theme, useTheme } from 'react-native-paper';
import { AccountScreen } from './AccountScreen';
import { HowToGroupCardsScreen } from './HowToGroupCardsScreen';
import { MainMenu, MenuMainProps } from './MainMenu';
import { MainMenuHeader } from './MainMenuHeader';
import { PracticeSettingsScreen } from './PracticeSettingsScreen';

const Stack = createStackNavigator();

const menuComponent =
  (mainMenuProps: MenuMainProps) => (navigationProps: any) =>
    <MainMenu {...mainMenuProps} {...navigationProps} />;

export const MainMenuNavigationStack: FC = () => {
  const navigation = useNavigation();
  const theme = useTheme() as Theme & MD3Theme;
  return (
    <View
      style={{
        flex: 1,
        overflow: 'hidden',
      }}
    >
      <NavigationContainer independent={true} theme={theme}>
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
            component={menuComponent({
              parentNavigator: navigation,
            })}
          />
          <Stack.Screen
            options={{
              header: MainMenuHeader,
              title: 'Your Account',
            }}
            name="AccountMenu"
            component={AccountScreen}
          />
          <Stack.Screen
            options={{
              header: MainMenuHeader,
              title: 'Grouping Cards',
            }}
            name="HowToGroupCards"
            component={HowToGroupCardsScreen}
          />

          <Stack.Screen
            options={{
              header: MainMenuHeader,
              title: 'Practice Settings',
            }}
            name="PracticeSettings"
            component={PracticeSettingsScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
