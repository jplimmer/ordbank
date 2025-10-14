'server-only';

import { eq } from 'drizzle-orm';
import { db } from '../db';
import { vocabulary } from '../db/schema';
import { getLogger } from '../logger';
import { Result } from '../types/types';
import { InsertVocabItem, UpdateVocabItem, VocabItem } from '../types/vocab';
import { handleValidationError } from '../utils';
import {
  vocabInsertSchema,
  vocabSelectSchema,
  vocabUpdateSchema,
} from '../validation/vocab-schemas';
import {
  assertLanguagePairOwnership,
  assertVocabItemOwnership,
  UserProfile,
} from './auth';

const logger = getLogger();

export const getVocab = async (
  userProfile: UserProfile
): Promise<Result<VocabItem[]>> => {
  try {
    // Verify the languagePair belongs to the user
    await assertLanguagePairOwnership(
      userProfile.userId,
      userProfile.languagePairId
    );

    // Fetch vocabulary data from db
    const vocab = await db
      .select()
      .from(vocabulary)
      .where(eq(vocabulary.languagePairId, userProfile.languagePairId))
      .orderBy(vocabulary.source);

    // Validate database response
    const parseResult = vocabSelectSchema.safeParse(vocab);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Get vocab'
      );
      return { success: false, error: validationError.message };
    }

    return { success: true, data: parseResult.data };
  } catch (error) {
    const errorMsg = `Failed to get vocabulary: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

export const createVocabItem = async (
  userId: number,
  newVocabItem: InsertVocabItem
): Promise<Result<VocabItem>> => {
  try {
    // Verify the languagePair belongs to the user
    await assertLanguagePairOwnership(userId, newVocabItem.languagePairId);

    // Validate new vocab item
    const parseResult = vocabInsertSchema.safeParse(newVocabItem);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Add vocab item'
      );
      return { success: false, error: validationError.message };
    }

    // Add to database and return new item
    const [newItem] = await db
      .insert(vocabulary)
      .values(parseResult.data)
      .returning();

    logger.info(`Added '${newItem.source}' to database with id ${newItem.id}`);
    return { success: true, data: newItem };
  } catch (error) {
    const errorMsg = `Failed to create vocab item: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

export const updateVocabItem = async (
  userProfile: UserProfile,
  vocabItemId: number,
  updates: UpdateVocabItem
): Promise<Result<VocabItem>> => {
  try {
    // Verify the languagePair belongs to the user
    await assertLanguagePairOwnership(
      userProfile.userId,
      userProfile.languagePairId
    );

    // Verify the vocabItem belongs to the languagePair
    await assertVocabItemOwnership(userProfile.languagePairId, vocabItemId);

    // Validate vocab item updates
    const parseResult = vocabUpdateSchema.safeParse(updates);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Update vocab item'
      );
      return { success: false, error: validationError.message };
    }

    // Update item in database and return updated item
    const [updatedItem] = await db
      .update(vocabulary)
      .set(parseResult.data)
      .where(eq(vocabulary.id, vocabItemId))
      .returning();

    logger.info(`Updated vocab item ${updatedItem.id} in database`);
    return { success: true, data: updatedItem };
  } catch (error) {
    const errorMsg = `Failed to update vocab item: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

export const deleteVocabItem = async (
  userProfile: UserProfile,
  vocabId: number
): Promise<Result<VocabItem>> => {
  try {
    // Verify the languagePair belongs to the user
    await assertLanguagePairOwnership(
      userProfile.userId,
      userProfile.languagePairId
    );

    // Verify the vocabItem belongs to the languagePair
    await assertVocabItemOwnership(userProfile.languagePairId, vocabId);

    // Delete item from database and return deleted item
    const [deletedItem] = await db
      .delete(vocabulary)
      .where(eq(vocabulary.id, vocabId))
      .returning();

    logger.info(`Deleted vocab item ${deletedItem.id} from database`);
    return { success: true, data: deletedItem };
  } catch (error) {
    const errorMsg = `Failed to delete vocab item: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};
