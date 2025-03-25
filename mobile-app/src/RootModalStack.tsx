import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, useTheme } from 'react-native-paper';
import { DrawerNavigator } from './DrawerNavigator';
import { EditCardScreen } from './EditCardScreen';
import { FeedbackModal } from './FeedbackModal';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { StudyScreen } from './study/StudyScreen';

const Stack = createStackNavigator();

export const RootModalStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
        }}
      >
        <Stack.Screen name="Study" component={StudyScreen} />
        <Stack.Screen name="EditCardModal" component={EditCardScreen} />
        <Stack.Screen
          name="LanguageSelector"
          component={LanguageSelectorModal}
        />
        <Stack.Screen
          name={'Feedback'}
          component={FeedbackModal}
          options={{
            headerShown: true,
            title: 'Feedback',
            headerTintColor: theme.colors.onBackground,
            headerRight: () => <Button disabled={true}>Send</Button>,
            headerLeft: () => {
              const navigation = useNavigation();
              return (
                <Button
                  style={{ marginLeft: 8 }}
                  onPress={() => navigation.goBack()}
                >
                  Close
                </Button>
              );
            },
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
