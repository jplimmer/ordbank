'server-only';

import { and, eq, inArray } from 'drizzle-orm';
import { db } from '../db';
import { languagePairs, userVocabulary, vocabulary } from '../db/schema';
import { getLogger } from '../logger';
import { ServiceResult } from '../types/common';
import { InsertVocabItem, UpdateVocabItem, VocabItem } from '../types/vocab';
import { handleValidationError } from '../utils';
import {
  vocabInsertSchema,
  vocabSelectSchema,
  vocabUpdateSchema,
} from '../validation/vocab-schemas';
import { languagePairBelongsToUser } from './auth';

const logger = getLogger();

export const getVocab = async (
  userId: number,
  languagePairId: number
): Promise<ServiceResult<VocabItem[]>> => {
  try {
    // Fetch vocabulary data from db for matching user and language pair ids
    const vocab = await db
      .select()
      .from(userVocabulary)
      .where(
        and(
          eq(userVocabulary.userId, userId),
          eq(userVocabulary.languagePairId, languagePairId)
        )
      )
      .orderBy(userVocabulary.source);

    if (vocab.length === 0) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message:
            'No vocabulary found for this user + language pair combination',
        },
      };
    }

    // Validate database response
    const parseResult = vocabSelectSchema.safeParse(vocab);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Get vocab'
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
    const errorMsg = `Failed to get vocabulary for language pair ${languagePairId} and user ${userId}`;
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

export const createVocabItemInDb = async (
  userId: number,
  newVocabItem: InsertVocabItem
): Promise<ServiceResult<VocabItem>> => {
  try {
    // Validate new vocab item
    const parseResult = vocabInsertSchema.safeParse(newVocabItem);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Add vocab item'
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

    // Verify the languagePair belongs to the user
    if (!languagePairBelongsToUser(userId, newVocabItem.languagePairId)) {
      return {
        success: false,
        error: {
          code: 'UNAUTHORISED',
          message: 'User not authorised for this language pair',
        },
      };
    }

    // Add to database and return new item
    const [newItem] = await db
      .insert(vocabulary)
      .values(parseResult.data)
      .returning();

    logger.info(`Added '${newItem.source}' to database with id ${newItem.id}`);
    return { success: true, data: newItem };
  } catch (error) {
    const errorMsg = 'Failed to create vocab item';
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

export const updateVocabItemInDb = async (
  userId: number,
  vocabItemId: number,
  updates: UpdateVocabItem
): Promise<ServiceResult<VocabItem>> => {
  try {
    // Validate vocab item updates
    const parseResult = vocabUpdateSchema.safeParse(updates);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Update vocab item'
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

    // Update item in database, matching user id with a subquery
    const [updatedItem] = await db
      .update(vocabulary)
      .set(parseResult.data)
      .where(
        and(
          eq(vocabulary.id, vocabItemId),
          inArray(
            vocabulary.languagePairId,
            db
              .select({ id: languagePairs.id })
              .from(languagePairs)
              .where(eq(languagePairs.userId, userId))
          )
        )
      )
      .returning();

    if (!updatedItem) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Vocabulary item not found or user not authorised',
        },
      };
    }

    logger.info(`Updated vocab item ${updatedItem.id} in database`);
    return { success: true, data: updatedItem };
  } catch (error) {
    const errorMsg = `Failed to update vocab item ${vocabItemId}`;
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

export const deleteVocabItemInDb = async (
  userId: number,
  vocabItemId: number
): Promise<ServiceResult<VocabItem>> => {
  try {
    // Delete item from database, matching user id with a subquery
    const [deletedItem] = await db
      .delete(vocabulary)
      .where(
        and(
          eq(vocabulary.id, vocabItemId),
          inArray(
            vocabulary.languagePairId,
            db
              .select({ id: languagePairs.id })
              .from(languagePairs)
              .where(eq(languagePairs.userId, userId))
          )
        )
      )
      .returning();

    if (!deletedItem) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Vocabulary item not found or user not authorised',
        },
      };
    }

    logger.info(`Deleted vocab item ${deletedItem.id} from database`);
    return { success: true, data: deletedItem };
  } catch (error) {
    const errorMsg = `Failed to delete vocab item ${vocabItemId}`;
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
