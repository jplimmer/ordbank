'use server';

import { APP_CONFIG } from '@/config/config';
import { TestSettings } from '@/config/test-settings';
import { db } from '@/db';
import { testSettings } from '@/db/schema';
import { getLogger } from '@/utils/logger';
import { eq } from 'drizzle-orm';

const logger = getLogger();

export interface TestSettingsActionResult {
  success: boolean;
  data?: string;
  message?: string;
}

export async function getTestSettings(userId: number): Promise<TestSettings> {
  const defaultSettings = APP_CONFIG.defaultTestSettings;

  try {
    const userSettings = await db
      .select()
      .from(testSettings)
      .where(eq(testSettings.userId, userId))
      .limit(1);

    // Return default settings if none found
    if (userSettings.length === 0) {
      return defaultSettings;
    }

    const settings = userSettings[0];

    // Merge with defaults to handle any missing fields
    return {
      testLength: settings.testLength ?? defaultSettings.testLength,
      testFormat: settings.testFormat ?? defaultSettings.testFormat,
      languageDirection:
        settings.languageDirection ?? defaultSettings.languageDirection,
    };
  } catch (error) {
    logger.error('Error fetching test settings', error);
    return defaultSettings;
  }
}

export async function updateTestSettings(): Promise<TestSettingsActionResult> {
  return { success: true };
}
