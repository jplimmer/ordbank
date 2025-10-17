'server-only';

import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { testSettings } from '../db/schema';
import { getLogger } from '../logger';
import { Result } from '../types/common';
import { TestSettings, UpdateTestSettings } from '../types/test';
import { handleValidationError } from '../utils';
import {
  testSettingsSelectSchema,
  testSettingsUpdateSchema,
} from '../validation/test-settings-schemas';

const logger = getLogger();

export const getTestSettings = async (
  userId: number
): Promise<Result<TestSettings>> => {
  try {
    // Fetch test settings from database
    const settings = await db.query.testSettings.findFirst({
      where: eq(testSettings.userId, userId),
      columns: { updatedAt: false },
    });

    // Validate database response
    const parseResult = testSettingsSelectSchema.safeParse(settings);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        "Get user's test settings"
      );
      return { success: false, error: validationError.message };
    }

    return { success: true, data: parseResult.data };
  } catch (error) {
    const errorMsg = `Failed to get test settings: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

export const updateTestSettings = async (
  userId: number,
  testSettingsId: number,
  updates: UpdateTestSettings
): Promise<Result<TestSettings>> => {
  try {
    // Validate test settings updates
    const parseResult = testSettingsUpdateSchema.safeParse(updates);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Update test settings'
      );
      return { success: false, error: validationError.message };
    }

    // Update test settings in database and return updated settings
    logger.debug('Reached db update');
    const [updatedSettings] = await db
      .update(testSettings)
      .set(parseResult.data)
      .where(
        and(
          eq(testSettings.userId, userId),
          eq(testSettings.id, testSettingsId)
        )
      )
      .returning();

    logger.info(`Updated test settings for user ${userId}`);
    return { success: true, data: updatedSettings };
  } catch (error) {
    const errorMsg = `Failed to update test settings: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};
