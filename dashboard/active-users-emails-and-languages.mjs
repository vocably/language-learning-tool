#!/usr/bin/env node
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { exec } from 'child_process';
import { config } from 'dotenv-flow';
import { appendFileSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import 'zx/globals';

config();

const execute = promisify(exec);

const s3Client = new S3Client({
  region: 'eu-central-1',
});

const days = 28;
const deadline = new Date();
deadline.setDate(deadline.getDate() - days);

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

  console.log(
    `Objects modified in the last ${days} days ${recentObjects.length}. Output as CSV:`
  );
  recentObjects.sort((a, b) => b.LastModified - a.LastModified);

  const statsObjects = [];

  const csvFileName = './result.csv';

  const header = `deckLanguage\tcardsInDeck\tuserEmail\tfirstCardSource\tfirstCardTranslation\t expectedUserLanguage`;

  console.log(header);

  writeFileSync(csvFileName, header + '\n');

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

    if (!users || !users.Users[0] || !users.Users[0].Attributes) {
      continue;
    }

    const userEmail = users.Users[0].Attributes.find(
      (attr) => attr.Name === 'email'
    ).Value;
    const deckLanguage = deck.language;
    const deckSource = deck.cards[0].data.source;
    const deckTranslation = deck.cards[0].data.translation;
    const cardsInDeck = deck.cards.length;
    const expectedUserLanguage = deckLanguage !== 'en' ? 'en' : '';

    statsObjects.push({
      deckLanguage,
      cardsInDeck,
      userEmail,
      deckSource,
      deckTranslation,
      expectedUserLanguage,
    });

    const row = `${deckLanguage}\t${cardsInDeck}\t${userEmail}\t${deckSource}\t${deckTranslation}\t${expectedUserLanguage}`;

    console.log(row);

    appendFileSync(csvFileName, row + '\n');
  }

  console.log(`\nTotal objects: ${statsObjects.length}`);
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}
