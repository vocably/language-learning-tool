import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import { EditCardScreen } from './EditCardScreen';
import { FeedbackModal } from './FeedbackModal';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { MnemonicModal } from './MnemonicModal';
import { StudyScreen } from './study/StudyScreen';
import { TabsNavigator } from './TabsNavigator';
import { WelcomeScreen } from './Welcome/WelcomeScreen';

const Stack = createStackNavigator();

export const RootModalStack = () => {
  const theme = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabsNavigator" component={TabsNavigator} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            presentation: 'transparentModal',
            headerShown: false,
            gestureEnabled: false,
            cardStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        />
        <Stack.Screen name="Study" component={StudyScreen} />
        <Stack.Screen name="EditCardModal" component={EditCardScreen} />
        <Stack.Screen name="MnemonicModal" component={MnemonicModal} />
        <Stack.Screen
          name="LanguageSelector"
          component={LanguageSelectorModal}
        />
        <Stack.Screen
          name={'Feedback'}
          component={FeedbackModal}
          options={{ headerShown: false, presentation: 'modal' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
