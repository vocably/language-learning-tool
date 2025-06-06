import { Analysis, AnalyzePayload, Result } from '@vocably/model';
import { request } from './restClient';

export const analyze = async (
  payload: AnalyzePayload,
  abortController?: AbortController
): Promise<Result<Analysis>> => {
  try {
    return await request('/analyze', {
      method: 'POST',
      body: JSON.stringify(payload),
      signal: abortController?.signal,
    });
  } catch (e) {
    return {
      success: false,
      errorCode: 'API_TRANSLATION_REQUEST_FAILED',
      reason: 'The translation request has failed.',
      extra: e,
    };
  }
};
