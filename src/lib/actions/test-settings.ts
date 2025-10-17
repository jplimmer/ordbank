'use server';

import { updateTestSettings } from '../services/test-settings';
import { FormResult } from '../types/common';
import { handleValidationError } from '../utils';
import { testSettingsUpdateSchema } from '../validation/test-settings-schemas';

export const saveSettings = async (
  testSettingsId: number,
  prevState: FormResult<null>,
  formData: FormData
): Promise<FormResult<null>> => {
  // TO DO - Authenticate user profile with error-handling
  const userId = 1;

  // Untyped obejct from formData for validation
  const updates = Object.fromEntries(formData);

  // Parse form data before sending to service (fail fast)
  const parseResult = testSettingsUpdateSchema.safeParse(updates);
  if (!parseResult.success) {
    const validationError = handleValidationError(
      parseResult.error,
      'Update test settings'
    );
    return {
      success: false,
      error: validationError.message,
      fieldErrors: validationError.fieldErrors,
      formData,
    };
  }

  // Update item in database
  const updateResult = await updateTestSettings(
    userId,
    testSettingsId,
    parseResult.data
  );
  if (!updateResult.success) {
    return { success: false, error: updateResult.error, formData: formData };
  }

  return { success: true, data: null };
};
