import { createStackNavigator } from '@react-navigation/stack';

import { getFullLanguageName } from '@vocably/model';
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
  const fullLanguage = getFullLanguageName(selectedLanguage);
  return (
    <Stack.Navigator
      screenOptions={{
        header: Header,
      }}
    >
      <Stack.Screen
        name="Dashboard"
        options={{ title: fullLanguage, headerShown: false }}
        component={DashboardScreen}
      />
      <Stack.Screen
        name="EditDeck"
        options={{ title: `Edit ${fullLanguage}` }}
        component={EditDeckScreen}
      />
      <Stack.Screen
        name="Notifications"
        options={{ title: `Study Notifications` }}
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="HowToGroupCards"
        options={{ title: `How to Group Cards` }}
        component={HowToGroupCardsScreen}
      />
      <Stack.Screen
        name="HowToImportAndExport"
        options={{ title: `Import/Export` }}
        component={HowToImportAndExportScreen}
      />
    </Stack.Navigator>
  );
};
