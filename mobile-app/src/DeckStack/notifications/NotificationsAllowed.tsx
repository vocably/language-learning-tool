import {
  deleteNotificationTime as deleteNotificationTimeApi,
  getNotificationTime as getNotificationTimeApi,
  setNotificationTime as setNotificationTimeApi,
} from '@vocably/api';
import { GetNotificationTimeResult, languageList } from '@vocably/model';
import { trimLanguage } from '@vocably/sulna';
import { get } from 'lodash-es';
import { usePostHog } from 'posthog-react-native';
import { FC, useState } from 'react';
import { View } from 'react-native';
import { getTimeZone } from 'react-native-localize';
import { Switch, Text } from 'react-native-paper';
import { InlineLoader } from '../../loaders/InlineLoader';
import { useAsync } from '../../useAsync';
import { TimePicker } from './TimePicker';

type Props = {
  language: string;
};

const getNotificationTime = (language: string) => async () => {
  const result = await getNotificationTimeApi(language);
  if (result.success === true) {
    return result.value;
  }

  throw new Error(`Unable to get notification time for ${language}`);
};

let lastAbortController: AbortController;
const setNotificationTime =
  (language: string) => async (payload: GetNotificationTimeResult) => {
    lastAbortController && lastAbortController.abort();
    lastAbortController = new AbortController();

    if (payload.exists === true) {
      const result = await setNotificationTimeApi(
        {
          localTime: payload.time,
          language,
          IANATimezone: getTimeZone(),
        },
        lastAbortController
      );

      if (
        result.success === false &&
        result.errorCode !== 'API_REQUEST_ABORTED'
      ) {
        console.error('Unable to set notification time', result);
        throw new Error(`Unable to set notification time for ${language}`);
      }
    } else {
      const result = await deleteNotificationTimeApi(
        payload.language,
        lastAbortController
      );

      if (result.success === false) {
        throw new Error(`Unable to delete notification time for ${language}`);
      }
    }
  };

const defaultNotificationTime = '17:00';

export const NotificationsAllowed: FC<Props> = ({ language }) => {
  const [loadNotificationsResult, mutateNotifications] = useAsync(
    getNotificationTime(language),
    setNotificationTime(language)
  );
  const posthog = usePostHog();
  const [isSwitching, setIsSwitching] = useState(false);

  const languageString = trimLanguage(get(languageList, language, ''));

  const enableOrDisableNotificationTime = async () => {
    if (isSwitching) {
      return;
    }

    if (loadNotificationsResult.status !== 'loaded') {
      return;
    }

    setIsSwitching(true);

    try {
      await mutateNotifications(
        loadNotificationsResult.value.exists
          ? {
              exists: false,
              language: loadNotificationsResult.value.language,
            }
          : {
              exists: true,
              language: loadNotificationsResult.value.language,
              time: defaultNotificationTime,
            }
      );
    } catch (e) {}

    if (loadNotificationsResult.value.exists) {
      posthog.capture('notificationsDisabled', {
        language,
      });
    } else {
      posthog.capture('notificationsEnabled', {
        language,
      });
    }

    setIsSwitching(false);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
      }}
    >
      {loadNotificationsResult.status === 'loading' && (
        <InlineLoader>Loading preset...</InlineLoader>
      )}
      {loadNotificationsResult.status === 'failed' && (
        <>
          <Text>I'm very sorry.</Text>
          <Text>The system can't load the notifications status.</Text>
          <Text>I have already been informed about it.</Text>
          <Text>Please try again later.</Text>
        </>
      )}
      {loadNotificationsResult.status === 'loaded' && (
        <>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }}
          >
            <Text style={{ textAlign: 'center', paddingHorizontal: 38 }}>
              Study notifications are sent once a day to remind you to review
              your {languageString} cards.
            </Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              <Switch
                value={loadNotificationsResult.value.exists}
                onChange={enableOrDisableNotificationTime}
              />
              <Text>Enabled for {languageString}</Text>
            </View>
            <TimePicker
              disabled={!loadNotificationsResult.value.exists || isSwitching}
              time={
                (loadNotificationsResult.value.exists &&
                  loadNotificationsResult.value.time) ||
                defaultNotificationTime
              }
              onChange={(time) => {
                posthog.capture('notificationsSetTime', { time });

                mutateNotifications({
                  language: loadNotificationsResult.value.language,
                  time,
                  exists: true,
                });
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};
