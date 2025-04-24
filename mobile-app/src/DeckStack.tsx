import { createStackNavigator } from '@react-navigation/stack';

import { getFullLanguageName } from '@vocably/model';
import { trimLanguage } from '@vocably/sulna';
import { useContext } from 'react';
import { DashboardScreen } from './DashboardScreen';
import { HowToGroupCardsScreen } from './DeckStack/HowToGroupCardsScreen';
import { HowToImportAndExportScreen } from './DeckStack/HowToImportAndExportScreen';
import { NotificationsScreen } from './DeckStack/NotificationsScreen';
import { EditDeckScreen } from './EditDeckScreen';
import { Header } from './Header';
import { LanguagesContext } from './languages/LanguagesContainer';

const Stack = createStackNavigator();

export const DeckStack = () => {
  const { selectedLanguage } = useContext(LanguagesContext);
  const languageName = trimLanguage(
    getFullLanguageName(selectedLanguage ?? '')
  );
  return (
    <Stack.Navigator
      screenOptions={{
        header: Header,
      }}
    >
      <Stack.Screen
        name="Dashboard"
        options={{ title: languageName, headerShown: false }}
        component={DashboardScreen}
      />
      <Stack.Screen
        name="EditDeck"
        options={{ title: `My cards` }}
        component={EditDeckScreen}
      />
      <Stack.Screen
        name="Notifications"
        options={{ title: `${languageName} study reminders` }}
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="HowToGroupCards"
        options={{ title: `How to group cards` }}
        component={HowToGroupCardsScreen}
      />
      <Stack.Screen
        name="HowToImportAndExport"
        options={{ title: `Import and export` }}
        component={HowToImportAndExportScreen}
      />
    </Stack.Navigator>
  );
};
