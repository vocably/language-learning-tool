import { getNotificationTime, setNotificationTime } from '@vocably/api';
import { Result } from '@vocably/model';
import {
  getPermissionStatus,
  GetPermissionStatusOutput,
  requestPermissions as amplifyRequestPermissions,
} from 'aws-amplify/push-notifications';
import { usePostHog } from 'posthog-react-native';
import { FC, useEffect, useState } from 'react';
import { Alert, Platform, View } from 'react-native';
import { getTimeZone } from 'react-native-localize';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelectedDeck } from '../languageDeck/useSelectedDeck';
import { InlineLoader } from '../loaders/InlineLoader';
import { notificationsIdentifyUser } from '../notificationsIdentifyUser';
import { CustomScrollView } from '../ui/CustomScrollView';
import { CustomSurface } from '../ui/CustomSurface';
import { ListItem } from '../ui/ListItem';
import { ScreenTitle } from '../ui/ScreenTitle';
import { useCurrentLanguageName } from '../useCurrentLanguageName';
import { NotificationsAllowed } from './notifications/NotificationsAllowed';
import { NotificationsDenied } from './notifications/NotificationsDenied';

type Props = {};

const enableNotificationIfNecessary = async (
  language: string
): Promise<Result<unknown>> => {
  const notificationTimeResult = await getNotificationTime(language);
  if (notificationTimeResult.success === false) {
    return notificationTimeResult;
  }

  if (notificationTimeResult.value.exists === true) {
    return notificationTimeResult;
  }

  return await setNotificationTime({
    language,
    IANATimezone: getTimeZone(),
    localTime: '17:00',
  });
};

export const NotificationsScreen: FC<Props> = () => {
  const insets = useSafeAreaInsets();
  const [notificationsStatus, setNotificationsStatus] = useState<
    GetPermissionStatusOutput | 'loading'
  >('loading');

  const [enablingNotifications, setEnablingNotifications] = useState(false);

  const {
    deck: { language },
  } = useSelectedDeck({ autoReload: false });

  const languageName = useCurrentLanguageName();

  const postHog = usePostHog();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const status = await getPermissionStatus();
      setNotificationsStatus(status);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    postHog.capture('notificationsScreenShow', {
      language,
    });
  }, []);

  const requestPermissions = async () => {
    setEnablingNotifications(true);

    amplifyRequestPermissions({
      alert: true,
      badge: true,
      sound: true,
    })
      .then(async (enabled) => {
        if (!enabled) {
          Alert.alert(
            'Study reminders failed',
            Platform.OS === 'android'
              ? "Study reminders can't be set through the app. Please enable them in the App Info settings."
              : "Study reminders can't be set through the app. Please enable them in Settings → Vocably."
          );
        }

        if (enabled) {
          notificationsIdentifyUser();
          await enableNotificationIfNecessary(language);
        }

        postHog.capture('notificationsOSRequested', {
          enabled,
          language,
        });

        setEnablingNotifications(false);
      })
      .catch((e) => {
        postHog.capture('notificationOSRequestError', {
          e,
          language,
        });

        setEnablingNotifications(false);
      });
  };

  return (
    <CustomScrollView>
      <ScreenTitle icon="bell-outline" title="Study reminders" />

      {notificationsStatus === 'loading' && (
        <InlineLoader center={false}>Checking...</InlineLoader>
      )}

      {notificationsStatus === 'granted' && !enablingNotifications && (
        <NotificationsAllowed language={language} />
      )}
      {notificationsStatus === 'denied' && <NotificationsDenied />}
      {(notificationsStatus === 'shouldExplainThenRequest' ||
        notificationsStatus === 'shouldRequest' ||
        enablingNotifications) && (
        <>
          <CustomSurface style={{ marginBottom: 8 }}>
            <ListItem
              leftIcon="bell"
              title="Enable reminders"
              onPress={requestPermissions}
              disabled={enablingNotifications}
              rightIcon=""
            />
          </CustomSurface>
          <View style={{ paddingHorizontal: 16 }}>
            <Text>
              Study reminders are sent once a day to remind you to review your{' '}
              {languageName} cards.
            </Text>
          </View>
        </>
      )}
    </CustomScrollView>
  );
};
