'server only';

import { and, eq, inArray, ne, sql } from 'drizzle-orm';
import { db } from '../db';
import { languagePairs, userVocabulary, vocabulary } from '../db/schema';
import { getLogger } from '../logger';
import { ServiceResult } from '../types/common';
import { Answer, AnswerResult, Direction } from '../types/test';
import { VocabItem } from '../types/vocab';
import { handleValidationError, shuffle } from '../utils';
import { vocabItemSelectSchema } from '../validation/vocab-schemas';

const logger = getLogger();

export const selectVocabItem = async (
  userId: number,
  languagePairId: number
): Promise<ServiceResult<VocabItem>> => {
  try {
    // Get vocab item from database - random selection weighted by accuracy
    const [vocabItem] = await db
      .select()
      .from(userVocabulary)
      .where(
        and(
          eq(userVocabulary.userId, userId),
          eq(userVocabulary.languagePairId, languagePairId)
        )
      )
      .orderBy(
        sql`(1 - COALESCE(${userVocabulary.correctAttempts}::float / 
          NULLIF(${userVocabulary.totalAttempts}, 0), 0.5)) * ${sql.raw('random()')} DESC`
      )
      .limit(1);

    if (!vocabItem) {
      const errorMsg =
        'No vocabulary item found for this user + language pair combination';
      logger.error(errorMsg);
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: errorMsg,
        },
      };
    }

    // Validate database response
    const parseResult = vocabItemSelectSchema.safeParse(vocabItem);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Select vocab item'
      );
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: validationError.message,
          details: validationError,
        },
      };
    }

    return { success: true, data: vocabItem };
  } catch (error) {
    const errorMsg = `Failed to select a vocabulary item for language pair ${languagePairId} and user ${userId}`;
    logger.error(errorMsg, error);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: errorMsg,
        details: error,
      },
    };
  }
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
  answerString: answer,
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
    return { correct: false, correctAnswer: correctAnswer.word };
  }
};

export const updateVocabStats = async (
  userId: number,
  vocabId: number,
  correct: boolean
): Promise<ServiceResult<null>> => {
  try {
    // Update item in database, matching user id with a subquery
    const result = await db
      .update(vocabulary)
      .set({
        totalAttempts: sql`${vocabulary.totalAttempts} + 1`,
        correctAttempts: correct
          ? sql`${vocabulary.correctAttempts} + 1`
          : vocabulary.correctAttempts,
        lastAttemptedAt: sql`NOW()`,
      })
      .where(
        and(
          eq(vocabulary.id, vocabId),
          inArray(
            vocabulary.languagePairId,
            db
              .select({ id: languagePairs.id })
              .from(languagePairs)
              .where(eq(languagePairs.userId, userId))
          )
        )
      );

    if (!result) {
      logger.warn(`Failed to update stats for vocab item ${vocabId}`);
    }

    logger.debug(`Updated stats for vocab item ${vocabId}`);
    return { success: true, data: null };
  } catch (error) {
    const errorMsg = `Failed to update stats for vocab item ${vocabId}`;
    logger.error(errorMsg, error);
    return {
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: errorMsg,
        details: error,
      },
    };
  }
};
