/** Seeds the `staging` Neon branch with sample data; run with `just db-seed`. */

import { Pool } from '@neondatabase/serverless';
import { loadEnvConfig } from '@next/env';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { execSync } from 'node:child_process';
import { z } from 'zod';
import {
  languagePairs,
  testSettings,
  users,
  vocabulary,
} from '../src/lib/db/schema';
import { parseEnv } from '../src/lib/env/schema';

// Every non-production branch is a child of staging and inherits this data.
// Named explicitly because `neonctl connection-string` with no branch returns
// the project's default branch, which is production.
const TARGET_BRANCH = 'staging';

type Word = [
  source: string,
  target: string,
  totalAttempts: number,
  correctAttempts: number,
  daysSinceLastAttempt?: number,
];

// A mix of untested, mostly wrong and mostly right words, so adaptive question
// selection has something to prioritise
const words: Word[] = [
  // Untested
  ['fjäril', 'butterfly', 0, 0],
  ['sked', 'spoon', 0, 0],
  ['gaffel', 'fork', 0, 0],
  ['kniv', 'knife', 0, 0],
  ['regnbåge', 'rainbow', 0, 0],
  ['sjukhus', 'hospital', 0, 0],
  ['ägg', 'egg', 0, 0],
  ['ost', 'cheese', 0, 0],
  ['nyckel', 'key', 0, 0],
  ['fönster', 'window', 0, 0],
  // Mostly wrong
  ['sköldpadda', 'turtle', 6, 1, 1],
  ['ekorre', 'squirrel', 5, 1, 2],
  ['kylskåp', 'fridge', 4, 0, 1],
  ['dammsugare', 'vacuum cleaner', 7, 2, 3],
  ['glasögon', 'glasses', 5, 2, 5],
  ['tandläkare', 'dentist', 6, 2, 2],
  ['sjuksköterska', 'nurse', 8, 3, 4],
  ['ögonblick', 'moment', 3, 0, 6],
  ['förlåt', 'sorry', 4, 1, 1],
  ['eftermiddag', 'afternoon', 5, 1, 7],
  // Mostly right
  ['hund', 'dog', 10, 10, 1],
  ['katt', 'cat', 9, 9, 2],
  ['hus', 'house', 8, 7, 3],
  ['bok', 'book', 8, 8, 1],
  ['vatten', 'water', 7, 6, 4],
  ['bröd', 'bread', 6, 6, 2],
  ['äpple', 'apple', 9, 8, 5],
  ['bil', 'car', 7, 7, 3],
  ['sol', 'sun', 6, 5, 6],
  ['stol', 'chair', 8, 7, 2],
];

const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000);

async function main() {
  loadEnvConfig(process.cwd());
  const { SEED_CLERK_USER_ID: clerkId } = parseEnv(
    z.object({
      SEED_CLERK_USER_ID: z
        .string()
        .startsWith('user_', 'Expected a Clerk user ID (user_…)'),
    })
  );

  // Resolved by branch name rather than read from DATABASE_URL, so the seed
  // can only ever reach staging
  const connectionString = execSync(
    `neonctl connection-string ${TARGET_BRANCH}`,
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] }
  ).trim();

  // A WebSocket pool rather than the app's HTTP driver, which can't run a
  // transaction whose later statements need earlier results (the new IDs)
  const pool = new Pool({ connectionString });
  const db = drizzle({ client: pool });

  try {
    await db.transaction(async (tx) => {
      // Deleting the seed user cascades to all their data, so a re-run
      // replaces the seed rather than duplicating it
      await tx.delete(users).where(eq(users.clerkId, clerkId));

      const [user] = await tx
        .insert(users)
        .values({ clerkId })
        .returning({ id: users.id });

      const [pair] = await tx
        .insert(languagePairs)
        .values({
          userId: user.id,
          sourceLanguage: 'Swedish',
          targetLanguage: 'English',
          pairName: 'SWE-ENG',
        })
        .returning({ id: languagePairs.id });

      await tx.insert(vocabulary).values(
        words.map(([source, target, totalAttempts, correctAttempts, days]) => ({
          languagePairId: pair.id,
          source,
          target,
          totalAttempts,
          correctAttempts,
          lastAttemptedAt: days === undefined ? null : daysAgo(days),
        }))
      );

      await tx
        .update(users)
        .set({ activeLanguagePairId: pair.id })
        .where(eq(users.id, user.id));

      await tx.insert(testSettings).values({ userId: user.id });
    });
  } finally {
    await pool.end();
  }

  console.log(
    `Seeded ${TARGET_BRANCH}: 1 language pair, ${words.length} words. ` +
      'Run `just db-reset-dev` to pick it up in development.'
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
