import { buildResult, configureAnalyzer } from '@vocably/analyze';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  ScheduledEvent,
} from 'aws-lambda';
import { isObject } from 'lodash-es';
import { lastValueFrom, mergeMap, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { buildErrorResponse } from '../../utils/buildErrorResponse';
import { buildResponse } from '../../utils/buildResponse';
import { extractPayload } from './extractPayload';

configureAnalyzer({
  lexicalaHost: process.env.LEXICALA_HOST as string,
  lexicalaKey: process.env.LEXICALA_KEY as string,
  googleProjectId: process.env.GOOGLE_PROJECT_ID as string,
  nlpTranslationKey: process.env.NLP_TRANSLATION_KEY as string,
  nlpTranslationHost: process.env.NLP_TRANSLATION_HOST as string,
  openaiApiKey: process.env.OPENAI_API_KEY as string,
});

const isScheduleEvent = (event: any): event is ScheduledEvent => {
  return (
    isObject(event) &&
    'detail-type' in event &&
    // @ts-ignore
    event['detail-type'] === 'Scheduled Event'
  );
};

export const analyze = async (
  event: APIGatewayProxyEvent | ScheduledEvent
): Promise<APIGatewayProxyResult> => {
  // Schedule event is made for
  // starting the lambda on timer
  if (isScheduleEvent(event)) {
    return {
      statusCode: 200,
      body: 'OK',
    };
  }

  return lastValueFrom(
    of(event).pipe(
      map(extractPayload),
      mergeMap((payload) => {
        return buildResult(payload);
      }),
      map((result) => {
        if (result.success === false) {
          throw result;
        }

        return buildResponse({
          body: JSON.stringify(result.value),
        });
      }),
      catchError(buildErrorResponse)
    )
  );
};

exports.analyze = analyze;
