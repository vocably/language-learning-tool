import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationProp } from '@react-navigation/native';
import { FC } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeckStack } from './DeckStack';
import { LookUpScreen } from './LookUpScreen';
import { SettingsStack } from './Settings/SettingsStack';
import { useWelcomeRequired } from './useWelcomeRequired';
import { WelcomeScreen } from './Welcome/WelcomeScreen';

const Tabs = createMaterialBottomTabNavigator();

type Props = {
  navigation: NavigationProp<any>;
};

export const TabsNavigator: FC<Props> = ({ navigation }) => {
  const welcomeIsRequiredResult = useWelcomeRequired();

  // useEffect(() => {
  //   if (
  //     welcomeIsRequiredResult.status === 'loaded' &&
  //     welcomeIsRequiredResult.value
  //   ) {
  //     setTimeout(() => navigation.navigate('Welcome'), 50);
  //   }
  // }, [welcomeIsRequiredResult]);

  // if (
  //   welcomeIsRequiredResult.status !== 'loaded' ||
  //   welcomeIsRequiredResult.value
  // ) {
  //   return <></>;
  // }

  return (
    <>
      <Tabs.Navigator
        barStyle={{
          elevation: 10, // Android
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        <Tabs.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            title: 'Welcome',
            tabBarIcon: ({ color }) => (
              <Icon name="human-greeting-variant" color={color} size={24} />
            ),
          }}
        />
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
          name="DeckScreen"
          options={{
            title: 'My cards',
            tabBarIcon: ({ color }) => (
              <Icon name="card-multiple-outline" color={color} size={24} />
            ),
          }}
          component={DeckStack}
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
    </>
  );
};
