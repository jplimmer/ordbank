'server-only';

import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import { getLogger } from '../logger';
import { ServiceResult } from '../types/common';
import { LanguagePair } from '../types/language-pair';
import { getLanguagePair } from './language-pairs';

const logger = getLogger();

export const fetchActiveLanguagePair = async (
  userId: number
): Promise<ServiceResult<LanguagePair>> => {
  try {
    // Fetch user's activeLanguagePairId from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { activeLanguagePairId: true },
    });

    if (!user || !user.activeLanguagePairId) {
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'No active language pair found in database for user',
        },
      };
    }

    // Get language pair details
    const languagePairResult = await getLanguagePair(
      userId,
      user.activeLanguagePairId
    );

    if (!languagePairResult.success) {
      return { success: false, error: languagePairResult.error };
    }

    return { success: true, data: languagePairResult.data };
  } catch (error) {
    const errorMsg = 'Failed to fetch active language pair from database';
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

export const updateActiveLanguagePair = async (
  userId: number,
  newActiveId: number
): Promise<ServiceResult<LanguagePair>> => {
  try {
    // Fetch language pair from database - includes ownership check and
    // parsing, result returned
    const languagePairResult = await getLanguagePair(userId, newActiveId);
    if (!languagePairResult.success) {
      return { success: false, error: languagePairResult.error };
    }

    // Update active language pair for the user in database
    const [updatedUser] = await db
      .update(users)
      .set({ activeLanguagePairId: newActiveId })
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.activeLanguagePairId === null) {
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'activeUserId is still null',
        },
      };
    }

    logger.debug(
      `Updated active language pair to ${updatedUser.activeLanguagePairId} for user ${updatedUser.id} in database`
    );
    return { success: true, data: languagePairResult.data };
  } catch (error) {
    const errorMsg = 'Failed to set active language pair in database';
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
