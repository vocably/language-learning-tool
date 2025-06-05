import { parseJson } from '@vocably/api';
import {
  defaultUserMetadata,
  mergeUserMetadata,
  PartialUserMetadata,
  Result,
  UserMetadata,
} from '@vocably/model';
import { nodeFetchS3File, nodePutS3File } from './nodeS3File';

export const getFileName = (sub: string) => `${sub}/files/metadata.json`;

export const nodeFetchUserMetadata = async (
  sub: string,
  bucket: string
): Promise<Result<UserMetadata>> => {
  const fetchS3FileResult = await nodeFetchS3File(bucket, getFileName(sub));

  if (fetchS3FileResult.success === false) {
    return fetchS3FileResult;
  }

  if (fetchS3FileResult.value === null) {
    return {
      success: true,
      value: defaultUserMetadata,
    };
  }

  const fileJsonResult = parseJson(fetchS3FileResult.value);

  if (fileJsonResult.success === false) {
    return fileJsonResult;
  }

  return {
    success: true,
    value: mergeUserMetadata(defaultUserMetadata, fileJsonResult.value),
  };
};

export const nodeSaveUserMetadata = async (
  sub: string,
  bucket: string,
  partialUserMetadata: PartialUserMetadata
): Promise<Result<null>> => {
  const userMetadataResult = await nodeFetchUserMetadata(sub, bucket);
  if (userMetadataResult.success === false) {
    return userMetadataResult;
  }

  const userMetadata = mergeUserMetadata(
    userMetadataResult.value,
    partialUserMetadata
  );

  const putFileResult = await nodePutS3File(
    bucket,
    getFileName(sub),
    JSON.stringify(userMetadata)
  );

  if (putFileResult.success === false) {
    return putFileResult;
  }

  return {
    success: true,
    value: null,
  };
};
