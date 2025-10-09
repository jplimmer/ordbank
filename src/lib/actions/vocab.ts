'use server';

import { getLogger } from '@/lib/logger';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ROUTES } from '../constants/routes';
import { getCurrentProfile } from '../services/auth';
import {
  createVocabItem,
  deleteVocabItem,
  updateVocabItem,
} from '../services/vocab';
import { Result } from '../types/types';
import { VocabItem } from '../types/vocab';
import {
  vocabInsertSchema,
  vocabUpdateSchema,
} from '../validation/vocab-schemas';

const logger = getLogger();

export const createVocabAction = async (
  prevState: Result<VocabItem>,
  formData: FormData
): Promise<Result<VocabItem>> => {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  if (!profileCheck.success) {
    return profileCheck;
  }

  // Untyped object from formData for validation
  const newVocabItem = {
    languagePairId: profileCheck.data.languagePairId,
    source: formData.get('source'),
    target: formData.get('target'),
  };

  // Parse form data before sending to service (fail fast)
  const parseResult = vocabInsertSchema.safeParse(newVocabItem);
  if (!parseResult.success) {
    const errors = z.flattenError(parseResult.error).fieldErrors;
    const errorMsg = `New vocabulary data validation failed: ${parseResult.error.message}`;
    logger.error(errorMsg, { error: errors });
    return { success: false, error: errorMsg };
  }

  // Add vocab item to database
  const createResult = await createVocabItem(
    profileCheck.data.userId,
    parseResult.data
  );
  if (!createResult.success) return createResult;

  // Revalidate route and return created item
  revalidatePath(ROUTES.VOCAB);
  return { success: true, data: createResult.data };
};

export const updateVocabAction = async (
  prevState: Result<VocabItem>,
  vocabId: number,
  formData: FormData
): Promise<Result<VocabItem>> => {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  if (!profileCheck.success) {
    return profileCheck;
  }

  // Untyped object from formData for validation
  const updates = {
    source: formData.get('source'),
    target: formData.get('target'),
  };

  // Parse form data before sending to service (fail fast)
  const parseResult = vocabUpdateSchema.safeParse(updates);
  if (!parseResult.success) {
    const errors = z.flattenError(parseResult.error).fieldErrors;
    const errorMsg = `Updated vocabulary data validation failed: ${parseResult.error.message}`;
    logger.error(errorMsg, { error: errors });
    return { success: false, error: errorMsg };
  }

  // Update item in database
  const updateResult = await updateVocabItem(
    profileCheck.data,
    vocabId,
    parseResult.data
  );
  if (!updateResult.success) return updateResult;

  // Revalidate route and return updated item
  revalidatePath(ROUTES.VOCAB);
  return { success: true, data: updateResult.data };
};

export const deleteVocabAction = async (
  vocabId: number
): Promise<Result<VocabItem>> => {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  if (!profileCheck.success) {
    return profileCheck;
  }

  // Delete vocab item from database
  const deleteResult = await deleteVocabItem(profileCheck.data, vocabId);
  if (!deleteResult.success) return deleteResult;

  // Revalidate route and return deleted item
  revalidatePath(ROUTES.VOCAB);
  return { success: true, data: deleteResult.data };
};
