import { getNotificationTime, setNotificationTime } from '@vocably/api';
import { languageList, Result } from '@vocably/model';
import { trimLanguage } from '@vocably/sulna';
import {
  getPermissionStatus,
  GetPermissionStatusOutput,
  requestPermissions as amplifyRequestPermissions,
} from 'aws-amplify/push-notifications';
import { get } from 'lodash-es';
import { usePostHog } from 'posthog-react-native';
import { FC, useEffect, useState } from 'react';
import { Alert, Platform, ScrollView } from 'react-native';
import { getTimeZone } from 'react-native-localize';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelectedDeck } from '../languageDeck/useSelectedDeck';
import { InlineLoader } from '../loaders/InlineLoader';
import { notificationsIdentifyUser } from '../notificationsIdentifyUser';
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

  const languageString = trimLanguage(get(languageList, language, ''));

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
            'Notifications failed',
            Platform.OS === 'android'
              ? "Notifications can't be set through the app. Please enable them in the App Info settings."
              : "Notifications can't be set through the app. Please enable them in Settings → Vocably."
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
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        height: '100%',
        gap: 12,
      }}
    >
      {notificationsStatus === 'loading' && (
        <InlineLoader>Checking...</InlineLoader>
      )}
      {notificationsStatus === 'granted' && !enablingNotifications && (
        <NotificationsAllowed language={language} />
      )}
      {notificationsStatus === 'denied' && <NotificationsDenied />}
      {(notificationsStatus === 'shouldExplainThenRequest' ||
        notificationsStatus === 'shouldRequest' ||
        enablingNotifications) && (
        <>
          <Text style={{ textAlign: 'center', paddingHorizontal: 38 }}>
            Study notifications are sent once a day to remind you to review your{' '}
            {languageString} cards.
          </Text>
          <Button
            onPress={requestPermissions}
            mode="contained"
            loading={enablingNotifications}
          >
            Enable Notifications
          </Button>
        </>
      )}
    </ScrollView>
  );
};
