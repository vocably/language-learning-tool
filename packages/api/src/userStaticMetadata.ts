import {
  mapUserStaticMetadata,
  Result,
  UserStaticMetadata,
} from '@vocably/model';
import { isString } from 'lodash-es';
import { parseJson } from './parseJson';
import { request } from './restClient';

export const getUserStaticMetadata = async (): Promise<
  Result<UserStaticMetadata>
> => {
  const response = await request('/static-files/static-metadata.json', {
    method: 'GET',
  });

  if (response.success === false) {
    return response;
  }

  let responseJson = response.value;
  if (isString(responseJson)) {
    if (responseJson.length > 0) {
      const parseJsonResult = parseJson(responseJson);
      if (parseJsonResult.success === false) {
        return parseJsonResult;
      }

      responseJson = parseJsonResult.value;
    } else {
      responseJson = {};
    }
  }

  return {
    success: true,
    value: mapUserStaticMetadata(responseJson),
  };
};
