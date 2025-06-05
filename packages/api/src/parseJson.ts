import { Result } from '@vocably/model';

export const parseJson = (text: string): Result<Record<any, any>> => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}') + 1;

  if (start === -1 || end === 0) {
    return {
      success: false,
      errorCode: 'JSON_PARSE_ERROR',
      reason: `Unable to find { or } in the provided string`,
    };
  }

  try {
    return {
      success: true,
      value: JSON.parse(text.substring(start, end)),
    };
  } catch (e) {
    return {
      success: false,
      errorCode: 'JSON_PARSE_ERROR',
      reason: 'Unable to parse the JSON string',
      extra: e,
    };
  }
};
