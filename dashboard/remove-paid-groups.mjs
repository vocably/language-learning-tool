import { exec } from 'child_process';
import { config } from 'dotenv-flow';
import { inspect, promisify } from 'node:util';
import 'zx/globals';

config();

const execute = promisify(exec);

const userEmail = process.argv[2];

const listUsers = `aws cognito-idp list-users --user-pool-id ${process.env.USER_POOL_ID} --filter "email=\\"${userEmail}\\""`;

const listUsersResult = JSON.parse((await execute(listUsers)).stdout);

console.log('User', inspect(listUsersResult, { depth: null }));

console.log(
  await execute(
    `aws cognito-idp admin-remove-user-from-group --user-pool-id ${process.env.USER_POOL_ID} --username ${listUsersResult.Users[0].Username} --group-name paid`
  ).stdout
);
