import { exec } from 'child_process';
import { config } from 'dotenv-flow';
import { promisify } from 'node:util';
import 'zx/globals';

config();

const execute = promisify(exec);

const YEARS = 2;
const CONCURRENCY = 10;

const shouldRemove = process.argv.slice(2).includes('remove');

if (shouldRemove) {
  console.log(`Users will be removed from the "paid" group.`);
}

const deadline = new Date();
deadline.setFullYear(deadline.getFullYear() - YEARS);

const attr = (user, name) =>
  user.Attributes?.find((a) => a.Name === name)?.Value ?? '';

const listPaidUsers = async () => {
  const users = [];
  let nextToken = undefined;

  do {
    const command = [
      'aws cognito-idp list-users-in-group',
      `--user-pool-id ${process.env.USER_POOL_ID}`,
      `--group-name paid`,
      '--limit 60',
      nextToken ? `--next-token ${nextToken}` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const result = JSON.parse(
      (await execute(command, { maxBuffer: 50 * 1024 * 1024 })).stdout
    );

    users.push(...(result.Users ?? []));
    nextToken = result.NextToken;
  } while (nextToken);

  return users;
};

// The most recent LastModified across all the decks of a user.
// Returns null when the user has no decks at all.
const lastDeckUpdate = async (sub) => {
  const command = [
    'aws s3api list-objects-v2',
    `--bucket ${process.env.DECKS_BUCKET}`,
    `--prefix "${sub}/"`,
    `--query "Contents[].LastModified"`,
    '--output json',
  ].join(' ');

  const stdout = (
    await execute(command, { maxBuffer: 10 * 1024 * 1024 })
  ).stdout.trim();

  const dates = JSON.parse(stdout || 'null');

  if (!dates || dates.length === 0) {
    return null;
  }

  return dates
    .map((date) => new Date(date))
    .reduce((latest, date) => (date > latest ? date : latest));
};

const inBatches = async (items, size, callback) => {
  const results = [];

  for (let i = 0; i < items.length; i += size) {
    results.push(
      ...(await Promise.all(items.slice(i, i + size).map(callback)))
    );
  }

  return results;
};

const format = (date) => (date ? date.toISOString().slice(0, 10) : 'never');

const paidUsers = await listPaidUsers();

console.log(`Users in the "paid" group: ${paidUsers.length}`);
console.log(`Deck update deadline: ${format(deadline)}\n`);

const withActivity = await inBatches(paidUsers, CONCURRENCY, async (user) => ({
  username: user.Username,
  email: attr(user, 'email'),
  sub: attr(user, 'sub') || user.Username,
  created: new Date(user.UserCreateDate),
  lastUpdate: await lastDeckUpdate(attr(user, 'sub') || user.Username),
}));

const inactive = withActivity
  .filter((user) => user.lastUpdate === null || user.lastUpdate < deadline)
  .sort((a, b) => (a.lastUpdate ?? 0) - (b.lastUpdate ?? 0));

const columns = [
  ['EMAIL', (user) => user.email],
  ['SUB', (user) => user.sub],
  ['CREATED', (user) => format(user.created)],
  ['LAST DECK UPDATE', (user) => format(user.lastUpdate)],
];

const widths = columns.map(([title, value]) =>
  Math.max(title.length, ...inactive.map((user) => value(user).length))
);

console.log(columns.map(([title], i) => title.padEnd(widths[i])).join('  '));

for (const user of inactive) {
  console.log(
    columns.map(([, value], i) => value(user).padEnd(widths[i])).join('  ')
  );
}

console.log(
  `\nInactive for ${YEARS}+ years: ${inactive.length} of ${paidUsers.length}`
);

if (!shouldRemove) {
  console.log('\nRun with the "remove" argument to remove them from "paid".');
  process.exit(0);
}

console.log('\nRemoving the users above from the "paid" group...');

for (const user of inactive) {
  const command = [
    'aws cognito-idp admin-remove-user-from-group',
    `--user-pool-id ${process.env.USER_POOL_ID}`,
    `--username ${user.username}`,
    '--group-name paid',
  ].join(' ');

  try {
    await execute(command);
    console.log(`Removed ${user.email}`);
  } catch (error) {
    console.error(`Failed to remove ${user.email}:`, error.toString());
  }
}
