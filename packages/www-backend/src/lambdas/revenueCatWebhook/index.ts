import { Webhook } from '@puzzmo/revenue-cat-webhook-types';
import { parseJson } from '@vocably/api';
import {
  getHeader,
  nodeFetchS3File,
  nodeFetchUserStaticMetadata,
  nodeSaveUserStaticMetadata,
} from '@vocably/lambda-shared';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { get } from 'lodash-es';
import { lastValueFrom, mergeMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { buildErrorResponse } from '../../utils/buildErrorResponse';
import { buildResponse } from '../../utils/buildResponse';
import { getPartialStaticMetadata } from './getPartialStaticMetadata';
import { getSub } from './getSub';

export const revenueCatWebhook = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> =>
  lastValueFrom(
    of(event).pipe(
      mergeMap(async () => {
        if (
          getHeader(event, 'authorization') !==
          process.env.REVENUE_CAT_AUTHORIZATION_HEADER
        ) {
          return buildResponse({
            statusCode: 401,
            body: 'Access denied',
          });
        }

        const action: Webhook = JSON.parse(event.body);

        if (!(action.event.entitlement_ids ?? []).includes('premium')) {
          return buildResponse({
            statusCode: 200,
            body: JSON.stringify({
              success: true,
              message:
                'This action does not include premium entitlements. Not sure what to do.',
            }),
          });
        }

        if (get(action.event, 'environment') === 'SANDBOX') {
          const allowedSandboxEmailsResult = await nodeFetchS3File(
            process.env.STATIC_USER_FILES_BUCKET,
            'allowed-sandbox-emails.json'
          );
          if (allowedSandboxEmailsResult.success === false) {
            return buildResponse({
              statusCode: 200,
              body: JSON.stringify({
                success: false,
                message: 'Unable to download allowed-sandbox-emails.json',
              }),
            });
          }

          const parseResult = parseJson(allowedSandboxEmailsResult.value);

          if (parseResult.success === false) {
            return buildResponse({
              statusCode: 200,
              body: JSON.stringify({
                success: false,
                message: 'Unable to parse allowed-sandbox-emails.json',
              }),
            });
          }

          if (
            !get(parseResult.value, 'allowedEmails', []).includes(
              action.event.app_user_id
            )
          ) {
            return buildResponse({
              statusCode: 200,
              body: JSON.stringify({
                success: false,
                message: `Unable to perform the operation for not allowed user ${action.event.app_user_id}`,
              }),
            });
          }
        }

        const subResult = await getSub(action.event.app_user_id);

        if (subResult.success === false) {
          console.error('Get sub error', subResult);
          return buildResponse({
            statusCode: 500,
            body: JSON.stringify({
              success: false,
              reason: `Unable to get sub for "${action.event.app_user_id}".`,
            }),
          });
        }

        const staticMetadataResult = await nodeFetchUserStaticMetadata(
          subResult.value,
          process.env.STATIC_USER_FILES_BUCKET
        );

        if (staticMetadataResult.success === false) {
          console.error('Fetch static metadata error', staticMetadataResult);
          return buildResponse({
            statusCode: 500,
            body: JSON.stringify({
              success: false,
              reason: 'Unable to fetch user static metadata.',
            }),
          });
        }

        const saveMetadataResult = await nodeSaveUserStaticMetadata(
          subResult.value,
          process.env.STATIC_USER_FILES_BUCKET,
          getPartialStaticMetadata(action, staticMetadataResult.value)
        );

        if (saveMetadataResult.success === false) {
          console.error('Save metadata error', saveMetadataResult);
          return buildResponse({
            statusCode: 500,
            body: JSON.stringify({
              success: false,
              reason: `Unable to save static metadata for "${action.event.app_user_id}".`,
            }),
          });
        }

        return buildResponse({
          body: JSON.stringify({
            success: true,
            metadata: saveMetadataResult.value,
          }),
        });
      }),
      catchError(buildErrorResponse)
    )
  );

exports.revenueCatWebhook = revenueCatWebhook;
