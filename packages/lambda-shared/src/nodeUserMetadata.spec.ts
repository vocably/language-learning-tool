import { defaultUserMetadata } from '@vocably/model';
import { nodeDeleteS3File } from './nodeS3File';
import {
  getFileName,
  nodeFetchUserMetadata,
  nodeSaveUserMetadata,
} from './nodeUserMetadata';

describe('nodeUserMetadata', () => {
  const sub = 'test-sub';
  const bucket = 'vocably-dev-user-files';

  if (process.env.TEST_SKIP_SPEC === 'true') {
    it('skip spec testing', () => {});
    return;
  }

  beforeAll(async () => {
    const deleteResult = await nodeDeleteS3File(bucket, getFileName(sub));
    if (deleteResult.success === false) {
      console.log(deleteResult);
      throw new Error('Failed to delete s3 file');
    }
  });

  afterAll(async () => {
    const deleteResult = await nodeDeleteS3File(bucket, getFileName(sub));
    if (deleteResult.success === false) {
      console.log(deleteResult);
      throw new Error('Failed to delete s3 file');
    }
  });

  it('fetches non-existing data', async () => {
    const result = await nodeFetchUserMetadata(sub, bucket);

    console.log(result);

    if (result.success === false) {
      throw new Error('Failed to fetch s3 file');
    }

    expect(result.success).toBe(true);
    expect(result.value).toEqual(defaultUserMetadata);
  });

  it('puts new data, merges, and fetches', async () => {
    const saveResult = await nodeSaveUserMetadata(sub, bucket, {
      usageStats: {
        totalLookups: 25,
      },
    });

    if (saveResult.success === false) {
      throw new Error('Failed to put user metadata');
    }

    const fetchResult = await nodeFetchUserMetadata(sub, bucket);

    if (fetchResult.success === false) {
      throw new Error('Failed to fetch user metadata');
    }

    expect(fetchResult.success).toBe(true);
    expect(fetchResult.value.usageStats.totalLookups).toEqual(25);
    expect(fetchResult.value.usageStats.lastLookupTimestamp).toEqual(
      defaultUserMetadata.usageStats.lastLookupTimestamp
    );
  });
});
