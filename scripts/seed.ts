/** Seeds the `template` Neon branch with sample data; run with `just db-seed`. */

import { Pool } from '@neondatabase/serverless';
import { loadEnvConfig } from '@next/env';
import { eq, inArray } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { z } from 'zod';
import { VALIDATION_LIMITS } from '../src/lib/constants/validation';
import {
  languagePairs,
  testSettings,
  users,
  vocabulary,
} from '../src/lib/db/schema';
import { parseEnv } from '../src/lib/env/schema';
import { generatePairName } from '../src/lib/utils';
import { languagePairInsertSchema } from '../src/lib/validation/language-pair-schemas';
import { vocabInsertSchema } from '../src/lib/validation/vocab-schemas';
import { neonConnectionString } from './neon';

// Every non-production branch is copied from template and inherits this data
const TARGET_BRANCH = 'template';

// Edge-case users nobody signs in as. Real Clerk IDs start with `user_`, so
// these can never match a real sign-in.
const NO_LIMITS_DANGLING_PAIR_CLERK_ID = 'seed_no_limits_dangling_pair';
const NEW_USER_CLERK_ID = 'seed_new_user';

type Word = [
  source: string,
  target: string,
  totalAttempts?: number,
  correctAttempts?: number,
  daysSinceLastAttempt?: number,
];

// As long as the app allows, in both directions
const longestWord: Word = [
  'arbetsmiljöförbättringsåtgärdsprogramuppföljningen',
  'follow-up of the work environment improvement plan',
];

// A mix of untested, mostly wrong and mostly right words, so adaptive question
// selection has something to prioritise
const swedishWords: Word[] = [
  // Untested
  ['fjäril', 'butterfly'],
  ['sked', 'spoon'],
  ['gaffel', 'fork'],
  ['kniv', 'knife'],
  ['regnbåge', 'rainbow'],
  ['sjukhus', 'hospital'],
  ['ägg', 'egg'],
  ['ost', 'cheese'],
  ['nyckel', 'key'],
  ['fönster', 'window'],
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
  // Edge cases
  longestWord,
  ['god morgon', 'good morning', 2, 1, 3],
  ['glad', 'happy', 4, 3, 2],
  ['lycklig', 'happy', 3, 1, 2],
];

const frenchWords: Word[] = [
  ['bonjour', 'hello', 3, 3, 10],
  ['merci', 'thank you', 2, 1, 10],
  ['chien', 'dog'],
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

  // Fails loudly if the limit changes, so the seed keeps covering it
  const maxWordLength = VALIDATION_LIMITS.MAX_WORD_LENGTH_CH;
  const [longestSource, longestTarget] = longestWord;
  if (
    longestSource.length !== maxWordLength ||
    longestTarget.length !== maxWordLength
  ) {
    throw new Error(
      `longestWord must be exactly ${maxWordLength} characters each way`
    );
  }

  // Resolved by branch name rather than read from DATABASE_URL, so the seed
  // can only ever reach template
  const connectionString = neonConnectionString(TARGET_BRANCH);

  // A WebSocket pool rather than the app's HTTP driver, which can't run a
  // transaction whose later statements need earlier results (the new IDs)
  const pool = new Pool({ connectionString });
  const db = drizzle({ client: pool });

  try {
    await db.transaction(async (tx) => {
      const insertUser = async (clerkId: string) => {
        const [user] = await tx
          .insert(users)
          .values({ clerkId })
          .returning({ id: users.id });
        return user.id;
      };

      // Parsed with the app's own schema and named by its own function, so
      // the seed stores languages exactly as the app would (lowercased)
      const insertPair = async (
        userId: number,
        sourceLanguage: string,
        targetLanguage: string,
        words: Word[] = []
      ) => {
        const languages = languagePairInsertSchema.parse({
          sourceLanguage,
          targetLanguage,
        });
        const [pair] = await tx
          .insert(languagePairs)
          .values({
            userId,
            ...languages,
            pairName: generatePairName(
              languages.sourceLanguage,
              languages.targetLanguage
            ),
          })
          .returning({ id: languagePairs.id });

        if (words.length > 0) {
          await tx.insert(vocabulary).values(
            words.map(([source, target, total = 0, correct = 0, days]) => ({
              ...vocabInsertSchema.parse({
                languagePairId: pair.id,
                source,
                target,
              }),
              totalAttempts: total,
              correctAttempts: correct,
              lastAttemptedAt: days === undefined ? null : daysAgo(days),
            }))
          );
        }
        return pair.id;
      };

      const setActivePair = (userId: number, pairId: number) =>
        tx
          .update(users)
          .set({ activeLanguagePairId: pairId })
          .where(eq(users.id, userId));

      // Deleting the seed users cascades to all their data, so a re-run
      // replaces the seed rather than duplicating it
      await tx
        .delete(users)
        .where(
          inArray(users.clerkId, [
            clerkId,
            NO_LIMITS_DANGLING_PAIR_CLERK_ID,
            NEW_USER_CLERK_ID,
          ])
        );

      const seedUserId = await insertUser(clerkId);
      const swedishId = await insertPair(
        seedUserId,
        'Swedish',
        'English',
        swedishWords
      );
      await insertPair(seedUserId, 'Norwegian', 'English');
      await setActivePair(seedUserId, swedishId);
      await tx.insert(testSettings).values({ userId: seedUserId });

      // No test limits, and an active pair that no longer exists: deleting the
      // active pair leaves this behind (#138)
      const noLimitsUserId = await insertUser(NO_LIMITS_DANGLING_PAIR_CLERK_ID);
      await insertPair(noLimitsUserId, 'French', 'English', frenchWords);
      const germanId = await insertPair(noLimitsUserId, 'German', 'English');
      await setActivePair(noLimitsUserId, germanId);
      await tx.delete(languagePairs).where(eq(languagePairs.id, germanId));
      await tx.insert(testSettings).values({
        userId: noLimitsUserId,
        questionLimit: null,
        timeLimitMins: null,
      });

      await insertUser(NEW_USER_CLERK_ID);
    });
  } finally {
    await pool.end();
  }

  console.log(
    `Seeded ${TARGET_BRANCH}: ` +
      `${swedishWords.length + frenchWords.length} words. ` +
      'Run `just db-reset-dev` to pick it up in development.'
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
