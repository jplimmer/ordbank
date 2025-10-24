'use server';

import { revalidatePath } from 'next/cache';
import { PERMISSION_ERROR } from '../constants/errors';
import { ROUTES } from '../constants/routes';
import { getCurrentUserOrRedirect } from '../services/user';
import {
  createVocabItem,
  deleteVocabItem,
  updateVocabItem,
} from '../services/vocab';
import { ActionResult, FormResult, ServiceErrorCode } from '../types/common';
import { VocabItem } from '../types/vocab';
import { handleValidationError } from '../utils';
import {
  vocabInsertSchema,
  vocabUpdateSchema,
} from '../validation/vocab-schemas';

const errorMessages: Record<ServiceErrorCode, string> = {
  NOT_FOUND: 'Word not found in your vocabulary list',
  UNAUTHORISED: PERMISSION_ERROR,
  VALIDATION_ERROR: 'Invalid word pair',
  DATABASE_ERROR: 'Something went wrong. Please try again.',
};

export const createVocabAction = async (
  prevState: FormResult<VocabItem>,
  formData: FormData
): Promise<FormResult<VocabItem>> => {
  // Authenticate user profile
  const user = await getCurrentUserOrRedirect();

  // Untyped object from formData for validation
  const newVocabItem = {
    languagePairId: user.activeLanguagePairId,
    source: formData.get('source'),
    target: formData.get('target'),
  };

  // Parse form data before sending to service (fail fast)
  const parseResult = vocabInsertSchema.safeParse(newVocabItem);
  if (!parseResult.success) {
    const validationError = handleValidationError(
      parseResult.error,
      'Add vocab item'
    );
    return {
      success: false,
      error: validationError.message,
      fieldErrors: validationError.fieldErrors,
      formData: formData,
    };
  }

  // Add vocab item to database
  const createResult = await createVocabItem(user.id, parseResult.data);
  if (!createResult.success) {
    return {
      success: false,
      error:
        errorMessages[createResult.error.code] ||
        'An unexpected error occurred',
      formData: formData,
    };
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
  const user = await getCurrentUserOrRedirect();

  // Untyped object from formData for validation
  const updates = {
    source: formData.get('source'),
    target: formData.get('target'),
  };

  // Parse form data before sending to service (fail fast)
  const parseResult = vocabUpdateSchema.safeParse(updates);
  if (!parseResult.success) {
    const validationError = handleValidationError(
      parseResult.error,
      'Update vocab item'
    );
    return {
      success: false,
      error: validationError.message,
      fieldErrors: validationError.fieldErrors,
      formData: formData,
    };
  }

  // Update item in database
  const updateResult = await updateVocabItem(
    user.id,
    vocabId,
    parseResult.data
  );
  if (!updateResult.success) {
    return {
      success: false,
      error:
        errorMessages[updateResult.error.code] ||
        'An unexpected error occurred',
      formData: formData,
    };
  }

  // Revalidate route and return updated item
  revalidatePath(ROUTES.VOCAB);
  return { success: true, data: updateResult.data };
};

export const deleteVocabAction = async (
  vocabId: number
): Promise<ActionResult<VocabItem>> => {
  // Authenticate user profile
  const user = await getCurrentUserOrRedirect();

  // Delete vocab item from database
  const deleteResult = await deleteVocabItem(user.id, vocabId);
  if (!deleteResult.success) {
    return {
      success: false,
      error:
        errorMessages[deleteResult.error.code] ||
        'An unexpected error occurred',
    };
  }

  // Revalidate route and return deleted item
  revalidatePath(ROUTES.VOCAB);
  return { success: true, data: deleteResult.data };
};
