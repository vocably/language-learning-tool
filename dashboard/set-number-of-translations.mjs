import { exec } from 'child_process';
import { config } from 'dotenv-flow';
import { writeFileSync } from 'fs';
import { set } from 'lodash-es';
import { inspect, promisify } from 'node:util';
import 'zx/globals';

config();

const execute = promisify(exec);

const userEmail = process.argv[2];

if (!process.argv[3]) {
  throw 'Number of lookups must be provided.';
}

const lookups = Number(process.argv[3]);

const listUsers = `aws cognito-idp list-users --user-pool-id ${process.env.USER_POOL_ID} --filter "email=\\"${userEmail}\\""`;

const listUsersResult = JSON.parse((await execute(listUsers)).stdout);

console.log('User', inspect(listUsersResult, { depth: null }));

const sub = listUsersResult.Users[0].Attributes.find(
  (attr) => attr.Name === 'sub'
).Value;

const s3FileLocation = `s3://${process.env.USER_FILES_BUCKET}/${sub}/files/metadata.json`;

const metadataJson =
  (await execute(`aws s3 cp ${s3FileLocation} -`)).stdout || '""';
writeFileSync('./original-metadata.json', metadataJson, 'utf8');
const userMetadata = JSON.parse(metadataJson);

set(userMetadata, 'usageStats.totalLookups', lookups);

console.log('User metadata', inspect(userMetadata, { depth: null }));

const tempFileName = './temp-metadata.json';

writeFileSync(tempFileName, JSON.stringify(userMetadata));

await execute(
  `aws s3 cp ${tempFileName} ${s3FileLocation} --content-type "application/json"`
);
