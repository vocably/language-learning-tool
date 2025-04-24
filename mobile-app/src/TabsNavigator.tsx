import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useContext } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeckStack } from './DeckStack';
import { LanguagesContext } from './languages/LanguagesContainer';
import { LookUpScreen } from './LookUpScreen';
import { SettingsStack } from './Settings/SettingsStack';
import { WelcomeContext } from './WelcomeContainer';
import { WelcomeStack } from './WelcomeStack';

const Tabs = createMaterialBottomTabNavigator();

export const TabsNavigator = () => {
  const { languages } = useContext(LanguagesContext);
  const { isWelcomeVisible } = useContext(WelcomeContext);

  return (
    <Tabs.Navigator>
      {languages.length > 0 && (
        <Tabs.Screen
          name="DeckScreen"
          options={{
            title: 'My cards',
            tabBarIcon: ({ color }) => (
              <Icon name="card-multiple-outline" color={color} size={24} />
            ),
          }}
          component={DeckStack}
        />
      )}
      {(isWelcomeVisible || languages.length === 0) && (
        <Tabs.Screen
          name="WelcomeScreen"
          options={{
            title: 'Welcome',
            tabBarIcon: ({ color }) => (
              <Icon name="human-greeting-variant" color={color} size={24} />
            ),
          }}
          component={WelcomeStack}
        />
      )}
      <Tabs.Screen
        name="LookUp"
        component={LookUpScreen}
        options={{
          title: 'Look up',
          tabBarIcon: ({ color }) => (
            <Icon name="translate" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Icon name="tune-variant" color={color} size={24} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};
