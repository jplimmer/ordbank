'use server';

import { PERMISSION_ERROR } from '../constants/errors';
import { updateTestSettings } from '../services/test-settings';
import { getCurrentUserOrRedirect } from '../services/user';
import { ActionResult, ServiceErrorCode } from '../types/common';
import { UpdateTestSettings } from '../types/test';
import { handleValidationError } from '../utils';
import { testSettingsUpdateSchema } from '../validation/test-settings-schemas';

const errorMessages: Record<ServiceErrorCode, string> = {
  NOT_FOUND: 'Word not found in your vocabulary list',
  UNAUTHORISED: PERMISSION_ERROR,
  VALIDATION_ERROR: 'Invalid word pair',
  DATABASE_ERROR: 'Something went wrong. Please try again.',
};

export const saveSettings = async (
  testSettingsId: number,
  settings: UpdateTestSettings
): Promise<ActionResult<null>> => {
  // Authenticate user profile
  const user = await getCurrentUserOrRedirect();

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
    user.id,
    testSettingsId,
    parseResult.data
  );
  if (!updateResult.success) {
    return {
      success: false,
      error:
        errorMessages[updateResult.error.code] ||
        'An unexpected error occurred',
    };
  }

  return { success: true, data: null };
};
