'server-only';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { vocabulary } from '../db/schema';
import { getLogger } from '../logger';
import { Result } from '../types/types';
import { InsertVocabItem, UpdateVocabItem, VocabItem } from '../types/vocab';
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
  userId: number,
  languagePairId: number
): Promise<Result<VocabItem[]>> => {
  try {
    // Verify the languagePair belongs to the user
    await assertLanguagePairOwnership(userId, languagePairId);

    // Fetch vocabulary data from db
    const vocab = await db
      .select()
      .from(vocabulary)
      .where(eq(vocabulary.languagePairId, languagePairId))
      .orderBy(vocabulary.source);

    // Validate database response
    const parseResult = vocabSelectSchema.safeParse(vocab);

    if (!parseResult.success) {
      const errors = z.flattenError(parseResult.error).fieldErrors;
      const errorMsg = `Vocabulary data validation failed: ${parseResult.error.message}`;
      logger.error(errorMsg, { error: errors });
      return { success: false, error: errorMsg };
    }

    return { success: true, data: vocab };
  } catch (error) {
    const errorMsg = `Failed to get vocabulary: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

export const createVocabItem = async (
  userId: number,
  newVocabItem: InsertVocabItem
): Promise<Result<number>> => {
  try {
    // Verify the languagePair belongs to the user
    await assertLanguagePairOwnership(userId, newVocabItem.languagePairId);

    // Validate new vocab item
    const parseResult = vocabInsertSchema.safeParse(newVocabItem);

    if (!parseResult.success) {
      const errors = z.flattenError(parseResult.error).fieldErrors;
      const errorMsg = `New vocabulary data validation failed: ${parseResult.error.message}`;
      logger.error(errorMsg, { error: errors });
      return { success: false, error: errorMsg };
    }

    // Add to database and return new id
    const [newId] = await db
      .insert(vocabulary)
      .values(parseResult.data)
      .returning({ id: vocabulary.id });

    return { success: true, data: newId.id };
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
    assertLanguagePairOwnership(userProfile.userId, userProfile.languagePairId);

    // Verify the vocabItem belongs to the langaugePair
    assertVocabItemOwnership(userProfile.languagePairId, vocabItemId);

    // Validate vocab item updates
    const parseResult = vocabUpdateSchema.safeParse(updates);

    if (!parseResult.success) {
      const errors = z.flattenError(parseResult.error).fieldErrors;
      const errorMsg = `Updated vocabulary data validation failed: ${parseResult.error.message}`;
      logger.error(errorMsg, { error: errors });
      return { success: false, error: errorMsg };
    }

    // Update item in database and return updated item
    const [updatedItem] = await db
      .update(vocabulary)
      .set(parseResult.data)
      .where(eq(vocabulary.id, vocabItemId))
      .returning();

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
    assertLanguagePairOwnership(userProfile.userId, userProfile.languagePairId);

    // Verify the vocabItem belongs to the langaugePair
    assertVocabItemOwnership(userProfile.languagePairId, vocabId);

    // Delete item from database and return deleted item
    const [deletedItem] = await db
      .delete(vocabulary)
      .where(eq(vocabulary.id, vocabId))
      .returning();

    return { success: true, data: deletedItem };
  } catch (error) {
    const errorMsg = `Failed to delete vocab item: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};
