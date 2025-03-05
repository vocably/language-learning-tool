import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'; // ES Modules import
import { Result } from '@vocably/model';
import { APIGatewayProxyEvent } from 'aws-lambda';

const ddb = new DynamoDBClient();
const ses = new SESv2Client();

export const saveFeedback = async (
  event: APIGatewayProxyEvent
): Promise<Result<null>> => {
  const { feedback, metadata = {} } = JSON.parse(event.body ?? '{}');

  const timestamp = new Date().toISOString();
  const claims = event.requestContext?.authorizer?.claims ?? {};
  const username = claims['cognito:username'] ?? '';

  metadata['claims'] = claims;

  await ses.send(
    new SendEmailCommand({
      Destination: { ToAddresses: ['d@vocably.pro'] },

      Content: {
        Simple: {
          Subject: {
            Charset: 'UTF-8',
            Data: `${
              process.env.FEEDBACK_NOTIFICATION_PREFIX ?? ''
            }User feedback received`,
          },
          Body: {
            Text: {
              Charset: 'UTF-8',
              Data: `Username: ${username}\n\n${feedback}\n\n${JSON.stringify(
                metadata,
                null,
                4
              )}`,
            },
          },
        },
      },
      FromEmailAddress: 'd@vocably.pro',
    })
  );

  await ddb.send(
    new PutItemCommand({
      TableName: process.env.USER_FEEDBACK_TABLE,
      Item: {
        Username: {
          S: username,
        },
        Timestamp: {
          S: timestamp,
        },
        Feedback: {
          S: feedback,
        },
      },
    })
  );

  return {
    success: true,
    value: null,
  };
};
