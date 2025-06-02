import { Result } from '@vocably/model';
import { getDeck } from './decks';
import { getBody } from './getBody';
import {
  getUtcTime,
  getUtcTimestampInSeconds,
  roundNotificationDate,
} from './notificationDate';
import { getNotificationItems, updateSentTimestamp } from './notificationItems';
import { sendPinpointMessage } from './sendPinpointMessage';

export const sendNotifications = async (): Promise<Result<any>> => {
  const notificationDate = roundNotificationDate(new Date());
  const utcTime = getUtcTime(notificationDate);
  const sentTimestamp = getUtcTimestampInSeconds(notificationDate);

  console.log('Sending notifications', {
    utcTime,
    sentTimestamp,
  });

  const notificationItemsResult = await getNotificationItems(
    utcTime,
    sentTimestamp
  );

  if (notificationItemsResult.success === false) {
    return notificationItemsResult;
  }

  console.log('Items affected', notificationItemsResult.value.length);

  for (let item of notificationItemsResult.value) {
    const sub = item.Sub.S;
    const cardsDeckResult = await getDeck(sub, item.Language.S);
    if (cardsDeckResult.success === false) {
      console.error('Get card deck error', cardsDeckResult);
      continue;
    }

    const updateItemResult = await updateSentTimestamp(
      item.ID.S,
      sentTimestamp
    );
    if (updateItemResult.success === false) {
      console.error('Update notification item error', updateItemResult);
      continue;
    }

    const sendMessageResult = await sendPinpointMessage(
      sub,
      getBody(cardsDeckResult.value)
    );

    if (sendMessageResult.success === false) {
      console.error(
        'Sending a message ended up with an error',
        sendMessageResult
      );
    }
  }

  return {
    success: true,
    value: null,
  };
};
