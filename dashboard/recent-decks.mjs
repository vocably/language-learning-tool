#!/usr/bin/env node
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import { config } from 'dotenv-flow';
import { promisify } from 'node:util';
import 'zx/globals';

config();

const execute = promisify(exec);

const INITIAL_INTERVAL = 0;
const INITIAL_REPETITION = 0;
const INITIAL_E_FACTOR = 2.5;

const isNew = (item) => {
  return (
    item.data.interval === INITIAL_INTERVAL &&
    item.data.repetition === INITIAL_REPETITION &&
    item.data.eFactor === INITIAL_E_FACTOR
  );
};

const studyPlan = (today, list) => {
  const todayTS = Date.UTC(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate()
  );

  const result = {
    today: [],
    expired: [],
    notStarted: [],
    future: [],
  };

  list.forEach((item) => {
    if (item.data.dueDate === todayTS) {
      result.today.push(item);
    } else if (item.data.dueDate > todayTS) {
      result.future.push(item);
    } else if (item.data.dueDate < todayTS && isNew(item)) {
      result.notStarted.push(item);
    } else {
      result.expired.push(item);
    }
  });

  return result;
};

const s3Client = new S3Client({
  region: 'eu-central-1',
});

const deadline = new Date();
deadline.setDate(deadline.getDate() - 7);

try {
  const recentObjects = [];
  let isTruncated = true;
  let nextContinuationToken = undefined;

  while (isTruncated) {
    const command = new ListObjectsV2Command({
      Bucket: 'vocably-prod-cards',
      ContinuationToken: nextContinuationToken,
    });
    const response = await s3Client.send(command);

    const filteredObjects =
      response.Contents?.filter((obj) => obj.LastModified >= deadline) || [];

    recentObjects.push(...filteredObjects);

    isTruncated = response.IsTruncated;
    nextContinuationToken = response.NextContinuationToken;
  }

  console.log('Objects modified in the last two weeks:');
  recentObjects.sort((a, b) => b.LastModified - a.LastModified);

  for (const obj of recentObjects) {
    const deckAsIs =
      (await $`aws s3 cp s3://vocably-prod-cards/${obj.Key} -`.quiet())
        .stdout || '""';
    const deck = JSON.parse(deckAsIs);

    if (deck.cards.length < 10) {
      continue;
    }

    const sub = obj.Key.split('/')[0];
    const listUsers = `aws cognito-idp list-users --user-pool-id ${process.env.USER_POOL_ID} --filter "sub=\\"${sub}\\""`;
    const users = JSON.parse((await execute(listUsers)).stdout);
    const userEmail = users.Users[0].Attributes.find(
      (attr) => attr.Name === 'email'
    ).Value;

    const plan = studyPlan(new Date(), deck.cards);

    console.log(
      `${deck.language}: ${Object.entries(plan)
        .map(([key, cards]) => `${key}: ${cards.length}`)
        .join(', ')} - ${userEmail}`
    );
  }

  console.log(`\nTotal objects: ${recentObjects.length}`);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
