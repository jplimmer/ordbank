'use server';

import { updateTestSettings } from '../services/test-settings';
import { Result } from '../types/common';
import { UpdateTestSettings } from '../types/test';
import { handleValidationError } from '../utils';
import { testSettingsUpdateSchema } from '../validation/test-settings-schemas';

export const saveSettings = async (
  testSettingsId: number,
  settings: UpdateTestSettings
): Promise<Result<null>> => {
  // TO DO - Authenticate user profile with error-handling
  const userId = 1;

  // Parse settings before sending to service (fail fast)
  const parseResult = testSettingsUpdateSchema.safeParse(settings);
  if (!parseResult.success) {
    const validationError = handleValidationError(
      parseResult.error,
      'Update test settings'
    );
    return {
      success: false,
      error: validationError.message,
    };
  }

  // Update item in database
  const updateResult = await updateTestSettings(
    userId,
    testSettingsId,
    parseResult.data
  );
  if (!updateResult.success) {
    return { success: false, error: updateResult.error };
  }

  return { success: true, data: null };
};
