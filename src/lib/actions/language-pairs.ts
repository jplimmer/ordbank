'use server';

import { revalidatePath } from 'next/cache';
import { ROUTES } from '../constants/routes';
import {
  createLanguagePair,
  deleteLanguagePair,
  updateLanguagePair,
} from '../services/language-pairs';
import { FormResult, Result } from '../types/common';
import { LanguagePair } from '../types/language-pair';
import { handleValidationError } from '../utils';
import {
  languagePairInsertSchema,
  languagePairUpdateSchema,
} from '../validation/language-pair-schemas';

export const createLanguagePairAction = async (
  prevState: FormResult<LanguagePair>,
  formData: FormData
): Promise<FormResult<LanguagePair>> => {
  // TO DO - authenticate user profile
  const userId = 1;

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
  const createResult = await createLanguagePair(userId, parseResult.data);
  if (!createResult.success) {
    return { success: false, error: createResult.error, formData: formData };
  }

  // Revalidate route and return created item
  revalidatePath(ROUTES.ACCOUNT);
  return { success: true, data: createResult.data };
};

export const updateLanguagePairAction = async (
  languagePairId: number,
  prevState: FormResult<LanguagePair>,
  formData: FormData
): Promise<FormResult<LanguagePair>> => {
  // TO DO - authenticate user profile
  const userId = 1;

  // Untyped object from formData for validation
  const updates = {
    sourceLanguage: formData.get('source-language'),
    targetLanguage: formData.get('target-language'),
  };

  // Parse form data before sending to service (fail fast)
  const parseResult = languagePairUpdateSchema.safeParse(updates);
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
  const updateResult = await updateLanguagePair(
    {
      userId: userId,
      languagePairId: languagePairId,
    },
    parseResult.data
  );
  if (!updateResult.success) {
    return { success: false, error: updateResult.error, formData: formData };
  }

  // Revalidate route and return updated item
  revalidatePath(ROUTES.ACCOUNT);
  return { success: true, data: updateResult.data };
};

export const deleteLanguagePairAction = async (
  languagePairId: number
): Promise<Result<LanguagePair>> => {
  // TO DO - authenticate user profile
  const userId = 1;

  // Delete language pair from database
  const deleteResult = await deleteLanguagePair(userId, languagePairId);
  if (!deleteResult.success) return deleteResult;

  // Revalidate route and return deleted item;
  revalidatePath(ROUTES.ACCOUNT);
  return { success: true, data: deleteResult.data };
};
