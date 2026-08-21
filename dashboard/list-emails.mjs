import { exec } from 'child_process';
import { config } from 'dotenv-flow';
import { promisify } from 'node:util';
import 'zx/globals';

config();

const execute = promisify(exec);

// Lists emails of the Cognito users registered within a date range (UTC).
// Both boundaries are inclusive, so `2024-02-11 2024-02-13` covers
// everything from 2024-02-11T00:00:00Z to 2024-02-13T23:59:59Z.
//
// Usage:
//   node list-emails.mjs                        # uses the defaults below
//   node list-emails.mjs 2024-02-11 2024-02-13

const DEFAULT_FROM = '2024-02-11';
const DEFAULT_TO = '2024-02-13';

const [fromArg = DEFAULT_FROM, toArg = DEFAULT_TO] = process.argv.slice(2);

const isDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value);

if (!isDate(fromArg) || !isDate(toArg)) {
  console.error('Usage: node list-emails.mjs [YYYY-MM-DD] [YYYY-MM-DD]');
  process.exit(1);
}

const from = new Date(`${fromArg}T00:00:00.000Z`);
const to = new Date(`${toArg}T00:00:00.000Z`);
to.setUTCDate(to.getUTCDate() + 1); // make the upper boundary inclusive

if (from >= to) {
  console.error('The start date must be earlier than the end date.');
  process.exit(1);
}

const attr = (user, name) =>
  user.Attributes?.find((a) => a.Name === name)?.Value ?? '';

const listAllUsers = async () => {
  const users = [];
  let paginationToken = undefined;

  do {
    const command = [
      'aws cognito-idp list-users',
      `--user-pool-id ${process.env.USER_POOL_ID}`,
      '--limit 60',
      paginationToken ? `--pagination-token ${paginationToken}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const result = JSON.parse(
      (await execute(command, { maxBuffer: 50 * 1024 * 1024 })).stdout
    );

    users.push(...(result.Users ?? []));
    paginationToken = result.PaginationToken;
  } while (paginationToken);

  return users;
};

const users = await listAllUsers();

const registered = users
  .filter((user) => {
    const createdAt = new Date(user.UserCreateDate);
    return createdAt >= from && createdAt < to;
  })
  .sort((a, b) => new Date(a.UserCreateDate) - new Date(b.UserCreateDate));

console.error(
  `Users registered between ${fromArg} and ${toArg} (UTC): ${registered.length} of ${users.length} total.`
);

for (const user of registered) {
  console.log(attr(user, 'email') || user.Username);
}
