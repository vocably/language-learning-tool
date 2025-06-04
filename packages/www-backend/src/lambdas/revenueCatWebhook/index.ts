import { Webhook } from '@puzzmo/revenue-cat-webhook-types';
import { getHeader, nodeSaveUserStaticMetadata } from '@vocably/lambda-shared';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
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
            statusCode: 500,
            body: JSON.stringify({
              success: false,
              reason:
                'This action does not include premium entitlements. Not sure what to do.',
            }),
          });
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

        const saveMetadataResult = await nodeSaveUserStaticMetadata(
          subResult.value,
          process.env.STATIC_USER_FILES_BUCKET,
          getPartialStaticMetadata(action)
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
          body: JSON.stringify({ success: true }),
        });
      }),
      catchError(buildErrorResponse)
    )
  );

exports.revenueCatWebhook = revenueCatWebhook;
