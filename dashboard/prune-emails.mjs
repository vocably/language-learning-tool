import { exec } from 'child_process';
import { config } from 'dotenv-flow';
import { readFileSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import 'zx/globals';

config();

const execute = promisify(exec);

// Prunes an email list down to the users who are actually inactive.
//
// Reads tmp/emails.txt, resolves the Cognito sub of every email and checks
// when the decks of that sub (s3://$DECKS_BUCKET/<sub>/) were last updated.
// Everyone with a deck touched within the last 2 years is considered active:
// their email moves to tmp/emails-active.txt and leaves tmp/emails.txt.
// Emails without a Cognito user, or without any recent deck update, stay in
// tmp/emails.txt.
//
// Usage:
//   node prune-emails.mjs             # rewrites both files
//   node prune-emails.mjs --dry-run   # only prints what would happen

const YEARS = 2;
const CONCURRENCY = 8;
const EMAILS_FILE = 'tmp/emails.txt';
const ACTIVE_FILE = 'tmp/emails-active.txt';

const dryRun = process.argv.slice(2).includes('--dry-run');

const deadline = new Date();
deadline.setFullYear(deadline.getFullYear() - YEARS);

const format = (date) => (date ? date.toISOString().slice(0, 10) : 'never');

const readLines = (file) => {
  try {
    return readFileSync(file, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const attr = (user, name) =>
  user.Attributes?.find((a) => a.Name === name)?.Value ?? '';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// AWS throttles both ListUsers and ListObjectsV2, so every call is retried.
const withRetry = async (callback, attempts = 5) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await callback();
    } catch (error) {
      const message = error.stderr ?? error.toString();
      const throttled = /TooManyRequests|Throttling|Rate exceeded/i.test(
        message
      );

      if (!throttled || attempt === attempts) {
        throw error;
      }

      await sleep(2 ** attempt * 250);
    }
  }
};

const findSub = async (email) =>
  withRetry(async () => {
    const command = [
      'aws cognito-idp list-users',
      `--user-pool-id ${process.env.USER_POOL_ID}`,
      `--filter ${JSON.stringify(`email = "${email}"`)}`,
      '--limit 1',
    ].join(' ');

    const result = JSON.parse(
      (await execute(command, { maxBuffer: 10 * 1024 * 1024 })).stdout
    );

    const user = result.Users?.[0];

    return user ? attr(user, 'sub') || user.Username : null;
  });

// The most recent LastModified across all the decks of a user.
// Returns null when the user has no decks at all.
const lastDeckUpdate = async (sub) =>
  withRetry(async () => {
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
  });

const inBatches = async (items, size, callback) => {
  const results = [];

  for (let i = 0; i < items.length; i += size) {
    results.push(
      ...(await Promise.all(items.slice(i, i + size).map(callback)))
    );
    console.error(
      `Checked ${Math.min(i + size, items.length)} of ${items.length}...`
    );
  }

  return results;
};

const emails = readLines(EMAILS_FILE);

if (emails.length === 0) {
  console.error(`${EMAILS_FILE} is empty or missing.`);
  process.exit(1);
}

console.error(`Emails to check: ${emails.length}`);
console.error(`Deck update deadline: ${format(deadline)}\n`);

const checked = await inBatches(emails, CONCURRENCY, async (email) => {
  try {
    const sub = await findSub(email);

    if (!sub) {
      return { email, sub: null, lastUpdate: null, missing: true };
    }

    return { email, sub, lastUpdate: await lastDeckUpdate(sub) };
  } catch (error) {
    console.error(`Failed to check ${email}: ${error.stderr ?? error}`);
    return { email, sub: null, lastUpdate: null, failed: true };
  }
});

const active = checked.filter(
  (user) => user.lastUpdate !== null && user.lastUpdate >= deadline
);
const missing = checked.filter((user) => user.missing);
const failed = checked.filter((user) => user.failed);
const activeEmails = new Set(active.map((user) => user.email));

// Everything that isn't active - including the failed checks - stays in place.
const remaining = emails.filter((email) => !activeEmails.has(email));

console.error('');
for (const user of active.sort((a, b) => b.lastUpdate - a.lastUpdate)) {
  console.error(`active  ${format(user.lastUpdate)}  ${user.email}`);
}

console.error(
  [
    '',
    `Active (deck updated since ${format(deadline)}): ${active.length}`,
    `Inactive (kept in ${EMAILS_FILE}): ${remaining.length}`,
    `  of them without a Cognito user: ${missing.length}`,
    `  of them failed to check: ${failed.length}`,
  ].join('\n')
);

if (dryRun) {
  console.error('\nDry run, no files were changed.');
  process.exit(0);
}

// The active list is appended to, so the results of the previous runs survive.
const previouslyActive = readLines(ACTIVE_FILE);
const allActive = [...new Set([...previouslyActive, ...activeEmails])];

writeFileSync(ACTIVE_FILE, allActive.map((email) => `${email}\n`).join(''));
writeFileSync(EMAILS_FILE, remaining.map((email) => `${email}\n`).join(''));

console.error(
  `\nWrote ${remaining.length} emails to ${EMAILS_FILE} and ${allActive.length} to ${ACTIVE_FILE}.`
);
