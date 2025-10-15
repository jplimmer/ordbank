'server only';

import { and, eq, ne, sql } from 'drizzle-orm';
import { db } from '../db';
import { vocabulary } from '../db/schema';
import { getLogger } from '../logger';
import { Result } from '../types/common';
import { Answer, AnswerResult, Direction } from '../types/test';
import { VocabItem } from '../types/vocab';
import { shuffle } from '../utils';
import {
  assertLanguagePairOwnership,
  assertVocabItemOwnership,
  UserProfile,
} from './auth';

const logger = getLogger();

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

export const checkAnswer = async ({
  vocabId,
  direction,
  answer,
}: Answer): Promise<AnswerResult> => {
  const column = direction === 'sourceToTarget' ? 'target' : 'source';
  const queryColumn = vocabulary[column];

  const [correctAnswer] = await db
    .select({ word: queryColumn })
    .from(vocabulary)
    .where(eq(vocabulary.id, vocabId))
    .limit(1);

  const correct = answer === correctAnswer.word;

  if (correct) {
    return { correct: true };
  } else {
    return { correct: false, answer: correctAnswer.word };
  }
};

export const updateVocabStats = async (
  userProfile: UserProfile,
  vocabId: number,
  correct: boolean
): Promise<Result<null>> => {
  try {
    // Verify requested language pair belongs to user
    await assertLanguagePairOwnership(userProfile);

    // Verify the vocabItem belongs to the languagePair
    await assertVocabItemOwnership(userProfile.languagePairId, vocabId);

    await db
      .update(vocabulary)
      .set({
        totalAttempts: sql`${vocabulary.totalAttempts} + 1`,
        correctAttempts: correct
          ? sql`${vocabulary.correctAttempts} + 1`
          : vocabulary.correctAttempts,
        lastAttemptedAt: sql`NOW()`,
      })
      .where(eq(vocabulary.id, vocabId));
    logger.debug(`Updated stats for vocab item ${vocabId}`);
    return { success: true, data: null };
  } catch (error) {
    const errorMsg = `Failed to update stats for vocab item ${vocabId}: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};
