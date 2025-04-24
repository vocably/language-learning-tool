import { NavigationProp } from '@react-navigation/native';
import React, { FC, useContext } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Divider,
  List,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import VersionNumber from 'react-native-version-number';
// @ts-ignore
import { ENV_SUFFIX, SHOW_CLEAR_STORAGE_BUTTON } from '@env';
import { languageList } from '@vocably/model';
import { trimLanguage } from '@vocably/sulna';
import { get } from 'lodash-es';
import { clearAll } from '../asyncAppStorage';
import { LanguagesContext } from '../languages/LanguagesContainer';
import { mainPadding } from '../styles';

type Props = {
  navigation: NavigationProp<any>;
};

const styles = StyleSheet.create({
  surface: {
    padding: 8,
    borderRadius: 16,
  },
});

export const SettingsScreen: FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { selectedLanguage, languages } = useContext(LanguagesContext);

  const languageName = trimLanguage(get(languageList, selectedLanguage, ''));

  // @ts-ignore
  return (
    <ScrollView
      contentContainerStyle={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100%',
        paddingLeft: insets.left + mainPadding,
        paddingTop: insets.top + mainPadding,
        paddingRight: insets.right + mainPadding,
        paddingBottom: insets.bottom,
      }}
    >
      <Surface style={[styles.surface, { marginBottom: 16 }]}>
        <List.Item
          title="Your account"
          onPress={() => navigation.navigate('AccountMenu')}
          titleStyle={{
            color: theme.colors.onBackground,
          }}
          left={() => (
            <Icon
              name="account-circle-outline"
              size={24}
              color={theme.colors.onBackground}
              style={{ marginLeft: 16 }}
            />
          )}
          right={() => (
            <Icon
              name="menu-right"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        ></List.Item>
        <Divider />
        <List.Item
          title="Study settings"
          onPress={() => navigation.navigate('StudySettings')}
          titleStyle={{
            color: theme.colors.onBackground,
          }}
          left={() => (
            <Icon
              name="book-open-variant"
              size={24}
              color={theme.colors.onBackground}
              style={{ marginLeft: 16 }}
            />
          )}
          right={() => (
            <Icon
              name="menu-right"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        ></List.Item>
      </Surface>

      {selectedLanguage && (
        <>
          <Surface style={[styles.surface, { marginBottom: 8 }]}>
            <List.Item
              title="Study remninders"
              onPress={() => {
                navigation.navigate('Notifications');
              }}
              titleStyle={{
                color: theme.colors.onBackground,
              }}
              left={() => (
                <Icon
                  name="bell-outline"
                  size={24}
                  color={theme.colors.onBackground}
                  style={{ marginLeft: 16 }}
                />
              )}
              right={() => (
                <Icon
                  name="menu-right"
                  size={24}
                  color={theme.colors.onBackground}
                />
              )}
            ></List.Item>
          </Surface>
          <View style={{ paddingHorizontal: 16, marginBottom: 32, gap: 8 }}>
            <Text>
              Study reminders are sent once a day to remind you to review your{' '}
              <Text style={{ fontWeight: 'bold' }}>{languageName}</Text> cards.
            </Text>
            {languages.length > 0 && (
              <Text>
                Every language has it's own reminder settings available in the
                "Edit deck" screen.
              </Text>
            )}
          </View>
        </>
      )}

      <Surface style={[styles.surface, { marginBottom: 8 }]}>
        <List.Item
          title="Provide feedback"
          onPress={() => {
            navigation.navigate('Feedback');
          }}
          titleStyle={{
            color: theme.colors.onBackground,
          }}
          left={() => (
            <Icon
              name="message-text-outline"
              size={24}
              color={theme.colors.onBackground}
              style={{ marginLeft: 16 }}
            />
          )}
        ></List.Item>
      </Surface>

      <View style={{ paddingHorizontal: 16 }}>
        <Text>
          Are you missing any crucial feature or simply want to share your
          opinion about Vocably with me? I would love to hear from you!
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          flex: 1,
          justifyContent: 'center',
        }}
      ></View>

      {VersionNumber.appVersion && (
        <View
          style={{
            paddingHorizontal: 16,
            marginBottom: 16,
            gap: 16,
            alignItems: 'center',
            justifyContent: 'center',
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
    </ScrollView>
  );
};
