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
import { FormResult, Result } from '../types/types';
import { VocabItem } from '../types/vocab';
import {
  vocabInsertSchema,
  vocabUpdateSchema,
} from '../validation/vocab-schemas';

const logger = getLogger();

export const createVocabAction = async (
  prevState: FormResult<VocabItem>,
  formData: FormData
): Promise<FormResult<VocabItem>> => {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  if (!profileCheck.success) {
    return { success: false, error: profileCheck.error, formData: formData };
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
    logger.debug('flattenError', z.flattenError(parseResult.error));
    const fieldErrors = z.flattenError(parseResult.error).fieldErrors;
    logger.error('Validation failed:', { error: fieldErrors });
    return {
      success: false,
      error: 'Please correct the invalid form inputs',
      fieldErrors: fieldErrors,
      formData: formData,
    };
  }

  // Add vocab item to database
  const createResult = await createVocabItem(
    profileCheck.data.userId,
    parseResult.data
  );
  if (!createResult.success) {
    return { success: false, error: createResult.error, formData: formData };
  }

  // Revalidate route and return created item
  revalidatePath(ROUTES.VOCAB);
  return { success: true, data: createResult.data };
};

export const updateVocabAction = async (
  vocabId: number,
  prevState: FormResult<VocabItem>,
  formData: FormData
): Promise<FormResult<VocabItem>> => {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  if (!profileCheck.success) {
    return { success: false, error: profileCheck.error, formData: formData };
  }

  // Untyped object from formData for validation
  const updates = {
    source: formData.get('source'),
    target: formData.get('target'),
  };

  // Parse form data before sending to service (fail fast)
  const parseResult = vocabUpdateSchema.safeParse(updates);
  if (!parseResult.success) {
    const fieldErrors = z.flattenError(parseResult.error).fieldErrors;
    logger.error('Validation failed:', { error: fieldErrors });
    return {
      success: false,
      error: 'Please correct the invalid form inputs',
      fieldErrors: fieldErrors,
      formData: formData,
    };
  }

  // Update item in database
  const updateResult = await updateVocabItem(
    profileCheck.data,
    vocabId,
    parseResult.data
  );
  if (!updateResult.success) {
    return { success: false, error: updateResult.error, formData: formData };
  }

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
