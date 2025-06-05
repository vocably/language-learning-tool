import {
  mapUserMetadata,
  mergeUserMetadata,
  PartialUserMetadata,
  Result,
  UserMetadata,
} from '@vocably/model';
import { isString } from 'lodash-es';
import { parseJson } from './parseJson';
import { request } from './restClient';

export const getUserMetadata = async (): Promise<Result<UserMetadata>> => {
  const response = await request('/files/metadata.json', {
    method: 'GET',
  });

  if (response.success === false) {
    return response;
  }

  let responseJson = response.value;
  if (isString(responseJson)) {
    const parseJsonResult = parseJson(responseJson);
    if (parseJsonResult.success === false) {
      return parseJsonResult;
    }

    responseJson = parseJsonResult.value;
  }

  return {
    success: true,
    value: mapUserMetadata(responseJson),
  };
};

export const saveUserMetadata = async (
  metadata: PartialUserMetadata
): Promise<Result<UserMetadata>> => {
  const userMetadataResult = await getUserMetadata();
  if (userMetadataResult.success === false) {
    return userMetadataResult;
  }

  const toBeSaved = mergeUserMetadata(userMetadataResult.value, metadata);

  const saveResult = await request('/files/metadata.json', {
    method: 'PUT',
    body: JSON.stringify(toBeSaved),
  });

  if (!saveResult.success) {
    return saveResult;
  }

  return {
    success: true,
    value: toBeSaved,
  };
};
