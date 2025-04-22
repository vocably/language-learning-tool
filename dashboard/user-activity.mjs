import { exec } from 'child_process';
import { config } from 'dotenv-flow';
import { inspect, promisify } from 'node:util';
import 'zx/globals';

config();

const execute = promisify(exec);

const userEmail = process.argv[2];

const listUsers = `aws cognito-idp list-users --user-pool-id ${process.env.USER_POOL_ID} --filter "email=\\"${userEmail}\\""`;

const users = JSON.parse((await execute(listUsers)).stdout);

console.log('Received users', inspect(users, { depth: null }));

const sub = users.Users[0].Attributes.find((attr) => attr.Name === 'sub').Value;

try {
  const userCardCollections = JSON.parse(
    (
      await execute(
        `aws s3api list-objects --bucket vocably-prod-cards --prefix "${sub}/"`
      )
    ).stdout
  );

  console.log(
    'Cards collections',
    inspect(userCardCollections, { depth: null })
  );
} catch (error) {
  console.error(error);
}

const userMetadata = JSON.parse(
  (
    await execute(
      `aws s3 cp s3://vocably-prod-user-files/${sub}/files/metadata.json -`
    )
  ).stdout || '""'
);

console.log('User metadata', inspect(userMetadata, { depth: null }));
