import { useNavigation, type DrawerStatus } from '@react-navigation/native';
import React, { FC, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Divider, List, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import VersionNumber from 'react-native-version-number';
// @ts-ignore
import { ENV_SUFFIX, SHOW_CLEAR_STORAGE_BUTTON } from '@env';
import { clearAll } from '../asyncAppStorage';

export type MenuMainProps = {
  parentNavigator: any;
  drawerStatus: DrawerStatus;
};

export const MainMenu: FC<MenuMainProps> = ({
  parentNavigator,
  drawerStatus,
}) => {
  const theme = useTheme();
  const navigator = useNavigation();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (drawerStatus === 'closed' && navigator.canGoBack()) {
      timeoutId = setTimeout(() => {
        navigator.navigate('MainMenu');
      }, 1000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [drawerStatus, navigator]);

  return (
    <ScrollView
      contentContainerStyle={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100%',
        paddingLeft: insets.left,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View
        style={{
          marginBottom: 'auto',
        }}
      >
        <List.Item
          title="Your Account"
          onPress={() => navigator.navigate('AccountMenu')}
          titleStyle={{
            color: theme.colors.onBackground,
          }}
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
          title="Notifications"
          onPress={() => {
            parentNavigator.navigate('Notifications');
          }}
          titleStyle={{
            color: theme.colors.onBackground,
          }}
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
          title="How to Group Cards"
          titleStyle={{
            color: theme.colors.onBackground,
          }}
          onPress={() => navigator.navigate('HowToGroupCards')}
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
          title="Study Settings"
          onPress={() => navigator.navigate('PracticeSettings')}
          titleStyle={{
            color: theme.colors.onBackground,
          }}
          right={() => (
            <Icon
              name="menu-right"
              size={24}
              color={theme.colors.onBackground}
            />
          )}
        ></List.Item>
      </View>

      <View
        style={{
          paddingHorizontal: 16,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Text style={{ marginBottom: 12 }}>
          Are you missing any crucial feature or simply want to share your
          opinion about Vocably with me? I would love to hear from you!
        </Text>
        <View
          style={{
            alignSelf: 'stretch',
          }}
        >
          <Button
            mode={'contained'}
            onPress={() => parentNavigator.navigate('Feedback')}
          >
            Provide Feedback
          </Button>
        </View>
      </View>

      {VersionNumber.appVersion && (
        <View
          style={{
            paddingHorizontal: 16,
            marginBottom: 16,
            gap: 16,
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
