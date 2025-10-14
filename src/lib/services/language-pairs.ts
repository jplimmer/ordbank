'server-only';

import { eq } from 'drizzle-orm';
import { db } from '../db';
import { languagePairs } from '../db/schema';
import { getLogger } from '../logger';
import {
  InsertLanguagePair,
  LanguagePair,
  UpdateLanguagePair,
} from '../types/language-pair';
import { Result } from '../types/types';
import { handleValidationError } from '../utils';
import {
  languagePairArraySelectSchema,
  languagePairInsertSchema,
  languagePairSelectSchema,
  languagePairUpdateSchema,
} from '../validation/language-pair-schemas';
import { assertLanguagePairOwnership, UserProfile } from './auth';

const logger = getLogger();

export const getLanguagePair = async (
  userProfile: UserProfile
): Promise<Result<LanguagePair>> => {
  try {
    // Verify the language pair belongs to the user
    await assertLanguagePairOwnership(userProfile);

    // Fetch language pair data from database
    const langPair = await db.query.languagePairs.findFirst({
      where: eq(languagePairs.id, userProfile.languagePairId),
    });

    if (!langPair) {
      return { success: false, error: 'Language pair not found' };
    }

    // Validate database response
    const parseResult = languagePairSelectSchema.safeParse(langPair);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Get single language pair'
      );
      return { success: false, error: validationError.message };
    }

    logger.info(
      `Fetched data for active language pair (${parseResult.data.pairName})`
    );
    return { success: true, data: parseResult.data };
  } catch (error) {
    const errorMsg = `Failed to get LanguagePair: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

export const getLanguagePairs = async (
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

const generatePairName = (sourceName: string, targetName: string): string => {
  return `${sourceName.slice(0, 3).toUpperCase()}-${targetName.slice(0, 3).toUpperCase()}`;
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
