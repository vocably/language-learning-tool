import { createStackNavigator } from '@react-navigation/stack';

import { DashboardScreen } from './DashboardScreen';
import { HowToEditCardsScreen } from './DeckStack/HowToEditCardsScreen';
import { HowToGroupCardsScreen } from './DeckStack/HowToGroupCardsScreen';
import { HowToImportAndExportScreen } from './DeckStack/HowToImportAndExportScreen';
import { NotificationsScreen } from './DeckStack/NotificationsScreen';
import { EditDeckScreen } from './EditDeckScreen';
import { Header } from './Header';
import { useCurrentLanguageName } from './useCurrentLanguageName';

const Stack = createStackNavigator();

export const DeckStack = () => {
  const languageName = useCurrentLanguageName();
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
        options={{ title: `Edit ${languageName} deck` }}
        component={NotificationsScreen}
      />
      <Stack.Screen
        name="HowToEditCards"
        options={{ title: `Edit ${languageName} deck` }}
        component={HowToEditCardsScreen}
      />
      <Stack.Screen
        name="HowToGroupCards"
        options={{ title: `Edit ${languageName} deck` }}
        component={HowToGroupCardsScreen}
      />
      <Stack.Screen
        name="HowToImportAndExport"
        options={{ title: `Edit ${languageName} deck` }}
        component={HowToImportAndExportScreen}
      />
    </Stack.Navigator>
  );
};
