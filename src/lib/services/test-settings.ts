'server-only';

import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { testSettings } from '../db/schema';
import { getLogger } from '../logger';
import { ServiceResult } from '../types/common';
import { TestSettings, UpdateTestSettings } from '../types/test';
import { handleValidationError } from '../utils';
import {
  testSettingsSelectSchema,
  testSettingsUpdateSchema,
} from '../validation/test-settings-schemas';

const logger = getLogger();

export const getTestSettings = async (
  userId: number
): Promise<ServiceResult<TestSettings>> => {
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
    const errorMsg = `Failed to get test settings for user ${userId}`;
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

export const createUserTestSettingsInDb = async (
  userId: number
): Promise<ServiceResult<TestSettings>> => {
  try {
    const [newSettings] = await db
      .insert(testSettings)
      .values({ userId: userId })
      .returning();

    return { success: true, data: newSettings };
  } catch (error) {
    const errorMsg = `Failed to create test settings for user ${userId}`;
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

export const updateTestSettingsInDB = async (
  userId: number,
  testSettingsId: number,
  updates: UpdateTestSettings
): Promise<ServiceResult<TestSettings>> => {
  try {
    // Validate test settings updates
    const parseResult = testSettingsUpdateSchema.safeParse(updates);

    if (!parseResult.success) {
      const validationError = handleValidationError(
        parseResult.error,
        'Update test settings'
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

    // Update test settings in database and return updated settings
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

    if (!updatedSettings) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Test settings not found or user is not authorised',
        },
      };
    }

    logger.info(`Updated test settings for user ${userId}`);
    return { success: true, data: updatedSettings };
  } catch (error) {
    const errorMsg = `Failed to update test settings for user ${userId}`;
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
