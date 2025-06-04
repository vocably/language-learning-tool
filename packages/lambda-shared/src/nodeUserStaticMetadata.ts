import { parseJson } from '@vocably/api';
import {
  defaultUserStaticMetadata,
  mergeUserStaticMetadata,
  Result,
  UserStaticMetadata,
} from '@vocably/model';
import { nodeFetchS3File, nodePutS3File } from './nodeS3File';

export const getStaticMetadataFileName = (sub: string) =>
  `${sub}/static-metadata.json`;

export const nodeFetchUserStaticMetadata = async (
  sub: string,
  bucket: string
): Promise<Result<UserStaticMetadata>> => {
  const fetchS3FileResult = await nodeFetchS3File(
    bucket,
    getStaticMetadataFileName(sub)
  );

  if (fetchS3FileResult.success === false) {
    return fetchS3FileResult;
  }

  if (fetchS3FileResult.value === null) {
    return {
      success: true,
      value: defaultUserStaticMetadata,
    };
  }

  const fileJsonResult = parseJson(fetchS3FileResult.value);

  if (fileJsonResult.success === false) {
    return fileJsonResult;
  }

  return {
    success: true,
    value: mergeUserStaticMetadata(
      defaultUserStaticMetadata,
      fileJsonResult.value
    ),
  };
};

export const nodeSaveUserStaticMetadata = async (
  sub: string,
  bucket: string,
  userStaticMetadata: Partial<UserStaticMetadata>
): Promise<Result<null>> => {
  const userMetadataResult = await nodeFetchUserStaticMetadata(sub, bucket);
  if (userMetadataResult.success === false) {
    return userMetadataResult;
  }

  const userMetadata = mergeUserStaticMetadata(
    userMetadataResult.value,
    userStaticMetadata
  );

  const putFileResult = await nodePutS3File(
    bucket,
    getStaticMetadataFileName(sub),
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
