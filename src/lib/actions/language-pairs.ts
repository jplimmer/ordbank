'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { PERMISSION_ERROR } from '../constants/errors';
import { ROUTES } from '../constants/routes';
import { getCurrentUserOrRedirect } from '../services/auth';
import {
  createLanguagePairInDb,
  deleteLanguagePairInDb,
  updateLanguagePairInDb,
} from '../services/language-pairs';
import { ActionResult, FormResult, ServiceErrorCode } from '../types/common';
import { LanguagePair } from '../types/language-pair';
import { handleValidationError } from '../utils';
import { languagePairInsertSchema } from '../validation/language-pair-schemas';

const errorMessages: Record<ServiceErrorCode, string> = {
  NOT_FOUND: 'Language pair not found',
  UNAUTHORISED: PERMISSION_ERROR,
  VALIDATION_ERROR: 'Invalid language pair',
  DATABASE_ERROR: 'Something went wrong. Please try again.',
};

export const createLanguagePair = async (
  prevState: FormResult<LanguagePair>,
  formData: FormData
): Promise<FormResult<LanguagePair>> => {
  // Authenticate user profile
  const user = await getCurrentUserOrRedirect();

  // Untyped object from formData for validation
  const newLanguagePair = {
    sourceLanguage: formData.get('source-language'),
    targetLanguage: formData.get('target-language'),
  };

  // Parse form data before sending to service (fail fast)
  const parseResult = languagePairInsertSchema.safeParse(newLanguagePair);
  if (!parseResult.success) {
    const validationError = handleValidationError(
      parseResult.error,
      'Add language pair'
    );
    return {
      success: false,
      error: validationError.message,
      fieldErrors: validationError.fieldErrors,
      formData: formData,
    };
  }

  // Add language pair to database
  const createResult = await createLanguagePairInDb(user.id, parseResult.data);
  if (!createResult.success) {
    return {
      success: false,
      error:
        errorMessages[
          createResult.error.code || 'An unexpected error occurred'
        ],
      formData: formData,
    };
  }

  // Revalidate tag and route, return created item
  revalidateTag('language-pairs');
  revalidatePath(ROUTES.LANGUAGES);
  return { success: true, data: createResult.data };
};

export const updateLanguagePair = async (
  languagePairId: number,
  prevState: FormResult<LanguagePair>,
  formData: FormData
): Promise<FormResult<LanguagePair>> => {
  // Authenticate user profile
  const user = await getCurrentUserOrRedirect();

  // Untyped object from formData for validation
  const updates = {
    sourceLanguage: formData.get('source-language'),
    targetLanguage: formData.get('target-language'),
  };

  // Parse form data before sending to service (fail fast)
  const parseResult = languagePairInsertSchema.safeParse(updates);
  if (!parseResult.success) {
    const validationError = handleValidationError(
      parseResult.error,
      'Update language pair'
    );
    return {
      success: false,
      error: validationError.message,
      fieldErrors: validationError.fieldErrors,
      formData: formData,
    };
  }

  // Update item in database
  const updateResult = await updateLanguagePairInDb(
    user.id,
    languagePairId,
    parseResult.data
  );
  if (!updateResult.success) {
    return {
      success: false,
      error:
        errorMessages[
          updateResult.error.code || 'An unexpected error occurred'
        ],
      formData: formData,
    };
  }

  // Revalidate tag and route, return created item
  revalidateTag('language-pairs');
  revalidatePath(ROUTES.LANGUAGES);
  return { success: true, data: updateResult.data };
};

export const deleteLanguagePair = async (
  languagePairId: number
): Promise<ActionResult<LanguagePair>> => {
  // Authenticate user profile
  const user = await getCurrentUserOrRedirect();

  // Delete language pair from database
  const deleteResult = await deleteLanguagePairInDb(user.id, languagePairId);
  if (!deleteResult.success) {
    return {
      success: false,
      error:
        errorMessages[deleteResult.error.code] ||
        'An unexpected error occurred',
    };
  }

  // Revalidate tag and route, return created item
  revalidateTag('language-pairs');
  revalidatePath(ROUTES.LANGUAGES);
  return { success: true, data: deleteResult.data };
};
