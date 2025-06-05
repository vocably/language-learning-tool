import { defaultUserStaticMetadata } from '@vocably/model';
import { nodeDeleteS3File } from './nodeS3File';
import {
  getStaticMetadataFileName,
  nodeFetchUserStaticMetadata,
  nodeSaveUserStaticMetadata,
} from './nodeUserStaticMetadata';

describe('nodeUserStaticMetadata', () => {
  const sub = 'test-sub';
  const bucket = 'vocably-dev-user-static-files';

  if (process.env.TEST_SKIP_SPEC === 'true') {
    it('skip spec testing', () => {});
    return;
  }

  beforeAll(async () => {
    const deleteResult = await nodeDeleteS3File(
      bucket,
      getStaticMetadataFileName(sub)
    );
    if (deleteResult.success === false) {
      console.log(deleteResult);
      throw new Error('Failed to delete s3 file');
    }
  });

  afterAll(async () => {
    const deleteResult = await nodeDeleteS3File(
      bucket,
      getStaticMetadataFileName(sub)
    );
    if (deleteResult.success === false) {
      console.log(deleteResult);
      throw new Error('Failed to delete s3 file');
    }
  });

  it('fetches non-existing data', async () => {
    const result = await nodeFetchUserStaticMetadata(sub, bucket);

    console.log(result);

    if (result.success === false) {
      throw new Error('Failed to fetch s3 file');
    }

    expect(result.success).toBe(true);
    expect(result.value).toEqual(defaultUserStaticMetadata);
  });

  it('puts new data, merges, and fetches', async () => {
    const saveResult = await nodeSaveUserStaticMetadata(sub, bucket, {
      premium: true,
    });

    if (saveResult.success === false) {
      throw new Error('Failed to put user metadata');
    }

    const fetchResult = await nodeFetchUserStaticMetadata(sub, bucket);

    if (fetchResult.success === false) {
      throw new Error('Failed to fetch user metadata');
    }

    expect(fetchResult.success).toBe(true);
    expect(fetchResult.value.premium).toEqual(true);
  });
});
