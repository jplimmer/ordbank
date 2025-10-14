'server only';

import { and, eq, ne, sql } from 'drizzle-orm';
import { db } from '../db';
import { vocabulary } from '../db/schema';
import { Direction } from '../types/test';
import { VocabItem } from '../types/vocab';
import { shuffle } from '../utils';
import { assertLanguagePairOwnership, UserProfile } from './auth';

export const selectVocabItem = async (
  userProfile: UserProfile
): Promise<VocabItem> => {
  // Verify requested language pair belongs to user
  await assertLanguagePairOwnership(userProfile);

  // Get vocab item from database - random selection weighted by accuracy
  const [vocabItem] = await db
    .select()
    .from(vocabulary)
    .where(eq(vocabulary.languagePairId, userProfile.languagePairId))
    .orderBy(
      sql`(1 - COALESCE(${vocabulary.correctAttempts}::float / 
          NULLIF(${vocabulary.totalAttempts}, 0), 0.5)) * random() DESC`
    )
    .limit(1);

  return vocabItem;
};

export const generateMultipleChoiceAnswers = async (
  correctItem: VocabItem,
  direction: Direction,
  numFalseAnswers = 2
): Promise<string[]> => {
  const column = direction === 'sourceToTarget' ? 'target' : 'source';
  const correct = correctItem[column];

  const queryColumn = vocabulary[column];
  const incorrectObjects = await db
    .select({ word: queryColumn })
    .from(vocabulary)
    .where(
      and(
        eq(vocabulary.languagePairId, correctItem.languagePairId),
        ne(vocabulary.id, correctItem.id)
      )
    )
    .limit(numFalseAnswers);

  const incorrect = incorrectObjects.map((row) => row.word);

  const answerArray = [correct, ...incorrect];
  return shuffle(answerArray);
};
