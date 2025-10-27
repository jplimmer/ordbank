'server-only';

import { and, eq, inArray, sql } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import { db } from '../db';
import { languagePairs, vocabulary } from '../db/schema';
import { getLogger } from '../logger';
import { ServiceResult } from '../types/common';
import { InsertLanguagePair, LanguagePair } from '../types/language-pair';
import { generatePairName, handleValidationError } from '../utils';
import {
  languagePairArraySelectSchema,
  languagePairInsertSchema,
  languagePairSelectSchema,
} from '../validation/language-pair-schemas';

const logger = getLogger();

export const getLanguagePair = async (
  userId: number,
  languagePairId: number
): Promise<ServiceResult<LanguagePair>> => {
  try {
    // Fetch language pair data from database
    const langPair = await db.query.languagePairs.findFirst({
      where: eq(languagePairs.id, languagePairId),
    });

    if (!langPair) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Language pair not found in database',
        },
      };
    }

    // Validate database response
    const parseResult = languagePairSelectSchema.safeParse(langPair);
    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Get single language pair'
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

    // Verify the language pair belongs to the user
    if (parseResult.data.userId !== userId) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORISED',
          message: 'You do not have access to this language pair',
        },
      };
    }

    return { success: true, data: parseResult.data };
  } catch (error) {
    const errorMsg = `Failed to get language pair ${languagePairId} from database`;
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

export const getUserLanguagePairs = unstable_cache(
  async (userId: number): Promise<ServiceResult<LanguagePair[]>> => {
    try {
      const langPairs = await db.query.languagePairs.findMany({
        where: eq(languagePairs.userId, userId),
      });

      // Validate database response
      const parseResult = languagePairArraySelectSchema.safeParse(langPairs);

      if (!parseResult.success) {
        const validationError = handleValidationError(
          parseResult.error,
          "Get user's language pairs"
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

      return { success: true, data: parseResult.data };
    } catch (error) {
      const errorMsg = `Failed to get language pairs for user id ${userId}`;
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
  },
  ['language-pairs'],
  { tags: ['language-pairs'] }
);

export const createLanguagePairInDb = async (
  userId: number,
  newLanguagePair: InsertLanguagePair
): Promise<ServiceResult<LanguagePair>> => {
  try {
    // Validate user input
    const parseResult = languagePairInsertSchema.safeParse(newLanguagePair);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Add language pair'
      );
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError.message,
          details: validationError,
        },
      };
    }

    const { sourceLanguage, targetLanguage } = parseResult.data;

    // Create new languagePair for database
    const newLangPair = {
      userId: userId,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage,
      pairName: generatePairName(sourceLanguage, targetLanguage),
    };

    // Add to database and return new pair
    const [newPair] = await db
      .insert(languagePairs)
      .values(newLangPair)
      .returning();

    logger.info(
      `Added '${newPair.pairName}' to database with id ${newPair.id}`
    );
    return { success: true, data: newPair };
  } catch (error) {
    const errorMsg = 'Failed to create langauge pair';
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

export const updateLanguagePairInDb = async (
  userId: number,
  languagePairId: number,
  updates: InsertLanguagePair
): Promise<ServiceResult<LanguagePair>> => {
  try {
    // Validate language pair updates
    const parseResult = languagePairInsertSchema.safeParse(updates);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Update language pair'
      );
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError.message,
          details: validationError,
        },
      };
    }

    // Generate new pair name
    const newPair = {
      ...parseResult.data,
      pairName: generatePairName(
        parseResult.data.sourceLanguage,
        parseResult.data.targetLanguage
      ),
    };

    // Update item in database with matching user id
    const [updatedPair] = await db
      .update(languagePairs)
      .set(newPair)
      .where(
        and(
          eq(languagePairs.id, languagePairId),
          eq(languagePairs.userId, userId)
        )
      )
      .returning();

    if (!updatedPair) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Language pair not found or user not authorised',
        },
      };
    }

    logger.info(`Updated language pair ${updatedPair.id} in database`);
    return { success: true, data: updatedPair };
  } catch (error) {
    const errorMsg = `Failed to update language pair ${languagePairId}`;
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

export const deleteLanguagePairInDb = async (
  userId: number,
  languagePairId: number
): Promise<ServiceResult<LanguagePair>> => {
  try {
    // Delete language pair from database with matching user id
    const [deletedPair] = await db
      .delete(languagePairs)
      .where(
        and(
          eq(languagePairs.id, languagePairId),
          eq(languagePairs.userId, userId)
        )
      )
      .returning();

    if (!deletedPair) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Language pair not found or user not authorised',
        },
      };
    }

    logger.info(`Deleted language pair ${deletedPair.id} from database`);
    return { success: true, data: deletedPair };
  } catch (error) {
    const errorMsg = `Failed to delete language pair ${languagePairId}`;
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

export const getVocabCountByLanguagePairs = async (
  languagePairIds: number[]
): Promise<
  {
    langPairId: number;
    count: number;
  }[]
> => {
  if (languagePairIds.length === 0) return [];

  const results = await db
    .select({
      langPair: vocabulary.languagePairId,
      count: sql<number>`COUNT(*)`,
    })
    .from(vocabulary)
    .where(inArray(vocabulary.languagePairId, languagePairIds))
    .groupBy(vocabulary.languagePairId);

  // Fill in zeros for original id list if no vocab entries found
  const resultMap = new Map(results.map((r) => [r.langPair, r.count]));
  return languagePairIds.map((langPairId) => ({
    langPairId,
    count: resultMap.get(langPairId) ?? 0,
  }));
};
