import { FC } from 'react';
import { Linking, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSelectedDeck } from '../languageDeck/useSelectedDeck';
import { CustomScrollView } from '../ui/CustomScrollView';
import { CustomSurface } from '../ui/CustomSurface';
import { ListItem } from '../ui/ListItem';
import { ScreenTitle } from '../ui/ScreenTitle';
import { useCurrentLanguageName } from '../useCurrentLanguageName';

type Props = {};

export const HowToImportAndExportScreen: FC<Props> = () => {
  const theme = useTheme();
  const { deck } = useSelectedDeck({ autoReload: false });
  const languageName = useCurrentLanguageName();

  return (
    <CustomScrollView>
      <ScreenTitle
        icon="swap-vertical"
        title="How to import and export cards"
      />

      <View style={{ gap: 8, marginBottom: 32, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 18 }}>
          Import and Export functionality is available in the Web App.
        </Text>
        <Text style={{ fontSize: 18 }}>
          Login with your account to proceed.
        </Text>
      </View>

      <CustomSurface style={{ marginBottom: 16 }}>
        <ListItem
          leftIcon="open-in-new"
          title="Import cards"
          onPress={() => Linking.openURL('https://app.vocably.pro/import')}
        />
      </CustomSurface>

      <CustomSurface>
        <ListItem
          leftIcon="open-in-new"
          title={`Export your ${languageName} cards`}
          onPress={() =>
            Linking.openURL(
              `https://app.vocably.pro/deck/${deck.language}/edit/export`
            )
          }
        />
      </CustomSurface>
    </CustomScrollView>
  );
};
