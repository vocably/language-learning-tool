import { NavigationProp } from '@react-navigation/native';
import React, { FC, useContext } from 'react';
import { View } from 'react-native';
import { Button, Divider, Text, useTheme } from 'react-native-paper';
import VersionNumber from 'react-native-version-number';
// @ts-ignore
import { ENV_SUFFIX, SHOW_CLEAR_STORAGE_BUTTON } from '@env';
import { languageList } from '@vocably/model';
import { trimLanguage } from '@vocably/sulna';
import { get } from 'lodash-es';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { clearAll } from '../asyncAppStorage';
import { LanguagesContext } from '../languages/LanguagesContainer';
import { CustomScrollView } from '../ui/CustomScrollView';
import { CustomSurface } from '../ui/CustomSurface';
import { ListItem } from '../ui/ListItem';

type Props = {
  navigation: NavigationProp<any>;
};

export const SettingsScreen: FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { selectedLanguage, languages } = useContext(LanguagesContext);

  const languageName = trimLanguage(get(languageList, selectedLanguage, ''));

  // @ts-ignore
  return (
    <CustomScrollView
      contentContainerStyle={{
        paddingTop: insets.top + 32,
      }}
    >
      <CustomSurface style={{ marginBottom: 16 }}>
        <ListItem
          leftIcon="account-circle-outline"
          title="Your account"
          onPress={() => navigation.navigate('AccountMenu')}
        />
        <Divider />
        <ListItem
          leftIcon="book-open-variant"
          title="Study settings"
          onPress={() => navigation.navigate('StudySettings')}
        />
      </CustomSurface>

      {selectedLanguage && (
        <>
          <CustomSurface style={{ marginBottom: 8 }}>
            <ListItem
              leftIcon="bell-outline"
              title="Study reminders"
              onPress={() => navigation.navigate('Notifications')}
            />
          </CustomSurface>
          <View style={{ paddingHorizontal: 16, marginBottom: 32, gap: 8 }}>
            <Text>
              Study reminders are sent once a day to remind you to review your{' '}
              <Text style={{ fontWeight: 'bold' }}>{languageName}</Text> cards.
            </Text>
            {languages.length > 1 && (
              <Text>
                Every language has it's own reminder settings available in the
                "Edit deck" screen.
              </Text>
            )}
          </View>
        </>
      )}

      <CustomSurface style={{ marginBottom: 8 }}>
        <ListItem
          leftIcon="message-text-outline"
          title="Provide feedback"
          onPress={() => navigation.navigate('Feedback')}
        />
      </CustomSurface>

      <View style={{ paddingHorizontal: 16 }}>
        <Text>
          Are you missing any crucial feature or simply want to share your
          opinion about Vocably with me? I would love to hear from you!
        </Text>
      </View>

      {VersionNumber.appVersion && (
        <View
          style={{
            paddingHorizontal: 16,
            marginBottom: 16,
            gap: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 48,
          }}
        >
          {SHOW_CLEAR_STORAGE_BUTTON === 'true' && (
            <Button
              mode="outlined"
              textColor={theme.colors.error}
              style={{ borderColor: theme.colors.error }}
              onPress={() => clearAll()}
            >
              Clear storage data
            </Button>
          )}
          <Text>
            Version:{' '}
            {`${VersionNumber.appVersion}${
              (VersionNumber.buildVersion !== VersionNumber.appVersion &&
                ` (${VersionNumber.buildVersion})`) ||
              ``
            }`}
            {ENV_SUFFIX ?? ''}
          </Text>
        </View>
      )}
    </CustomScrollView>
  );
};
