'server-only';

import { eq, inArray, sql } from 'drizzle-orm';
import { db } from '../db';
import { languagePairs, vocabulary } from '../db/schema';
import { getLogger } from '../logger';
import { Result, ServiceResult } from '../types/common';
import {
  InsertLanguagePair,
  LanguagePair,
  UpdateLanguagePair,
} from '../types/language-pair';
import { generatePairName, handleValidationError } from '../utils';
import {
  languagePairArraySelectSchema,
  languagePairInsertSchema,
  languagePairSelectSchema,
  languagePairUpdateSchema,
} from '../validation/language-pair-schemas';
import { assertLanguagePairOwnership, UserProfile } from './auth';

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
          code: 'VALIDATION_ERROR',
          message: validationError.message,
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

export const getUserLanguagePairs = async (
  userId: number
): Promise<Result<LanguagePair[]>> => {
  // Fetch language pairs data from database
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
      return { success: false, error: validationError.message };
    }

    return { success: true, data: parseResult.data };
  } catch (error) {
    const errorMsg = `Failed to get language pairs: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

export const createLanguagePair = async (
  userId: number,
  newLanguagePair: InsertLanguagePair
): Promise<Result<LanguagePair>> => {
  try {
    // Validate user input
    const parseResult = languagePairInsertSchema.safeParse(newLanguagePair);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Add language pair'
      );
      return { success: false, error: validationError.message };
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
    const errorMsg = `Failed to create language pair: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

export const updateLanguagePair = async (
  userProfile: UserProfile,
  updates: UpdateLanguagePair
): Promise<Result<LanguagePair>> => {
  try {
    // Verify the languagePair belongs to the user
    await assertLanguagePairOwnership(userProfile);

    // Validate language pair updates
    const parseResult = languagePairUpdateSchema.safeParse(updates);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Update language pair'
      );
      return { success: false, error: validationError.message };
    }

    // Update item in database and return updated item
    const [updatedItem] = await db
      .update(languagePairs)
      .set(parseResult.data)
      .where(eq(languagePairs.id, userProfile.languagePairId))
      .returning();

    logger.info(`Updated language pair ${updatedItem.id} in database`);
    return { success: true, data: updatedItem };
  } catch (error) {
    const errorMsg = `Failed to update language pair: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

export const deleteLanguagePair = async (
  userId: number,
  languagePairId: number
): Promise<Result<LanguagePair>> => {
  try {
    // Verify the languagePair belongs to the user
    await assertLanguagePairOwnership({ userId, languagePairId });

    // Delete language pair from database and return deleted pair
    const [deletedPair] = await db
      .delete(languagePairs)
      .where(eq(languagePairs.id, languagePairId))
      .returning();

    logger.info(`Deleted language pair ${deletedPair.id} from database`);
    return { success: true, data: deletedPair };
  } catch (error) {
    const errorMsg = `Failed to delete language pair: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
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
