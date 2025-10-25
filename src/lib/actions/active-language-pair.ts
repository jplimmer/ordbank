'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { PERMISSION_ERROR } from '../constants/errors';
import { ROUTES } from '../constants/routes';
import { getLogger } from '../logger';
import {
  fetchActiveLanguagePairFromDb,
  updateActiveLanguagePairInDb,
} from '../services/active-language-pair';
import { getLanguagePair } from '../services/language-pairs';
import { getCurrentUser } from '../services/user';
import { ActionResult, ServiceErrorCode } from '../types/common';
import { LanguagePair } from '../types/language-pair';

const logger = getLogger();

const activePairCookieName = 'activeLanguagePairId';
const errorMessages: Record<ServiceErrorCode, string> = {
  NOT_FOUND: 'Language pair not found',
  UNAUTHORISED: PERMISSION_ERROR,
  VALIDATION_ERROR: 'Invalid language pair',
  DATABASE_ERROR: 'Something went wrong. Please try again.',
};

export const setActiveLanguagePair = async (
  languagePairId: number | null
): Promise<ActionResult<LanguagePair | null>> => {
  // Authenticate user profile
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: 'You must be logged in to perform this action',
    };
  }

  // Call service to update database
  const result = await updateActiveLanguagePairInDb(user.id, languagePairId);
  if (!result.success) {
    const errorMessages: Record<ServiceErrorCode, string> = {
      NOT_FOUND: 'Language pair not found',
      UNAUTHORISED: "You don't have access to this language pair",
      VALIDATION_ERROR: 'Invalid language pair',
      DATABASE_ERROR: 'Something went wrong. Please try again.',
    };

    return {
      success: false,
      error: errorMessages[result.error.code] || 'An unexpected error occurred',
    };
  }

  // Update cookie
  await updateCookie(languagePairId);

  // Revalidate paths
  revalidatePath(ROUTES.LANGUAGES);

  // Return success status
  return { success: true, data: result.data };
};

export const getActiveLanguagePair = async (): Promise<
  ActionResult<LanguagePair>
> => {
  // Authenticate user profile
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      error: 'Not authenticated',
    };
  }

  // Try getting from cookies
  const cookieResult = await getActiveLanguagePairFromCookie(user.id);
  if (cookieResult.success) {
    return { success: true, data: cookieResult.data };
  }

  // If no valid cookie, try database
  const result = await fetchActiveLanguagePairFromDb(user.id);

  if (!result.success) {
    return { success: false, error: 'Failed to load active language pair' };
  }

  // Update cookie with database value
  await updateCookie(result.data.id);

  // Return success status with language pair
  return { success: true, data: result.data };
};

const updateCookie = async (languagePairId: number | null) => {
  try {
    const cookieStore = await cookies();
    if (languagePairId !== null) {
      cookieStore.set(activePairCookieName, languagePairId.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
      logger.debug(`Set cookie for active language pair: ${languagePairId}`);
    } else {
      cookieStore.delete(activePairCookieName);
      logger.debug(`Deleted cookie for active lanugage pair`);
    }
  } catch (error) {
    logger.warn('Failed to set cookie:', error);
  }
};

const getActiveLanguagePairFromCookie = async (
  userId: number
): Promise<ActionResult<LanguagePair>> => {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(activePairCookieName)?.value;

    if (!cookieValue) {
      return {
        success: false,
        error: 'No cookie value found',
      };
    }

    const languagePairId = parseInt(cookieValue, 10);
    const result = await getLanguagePair(userId, languagePairId);

    if (!result.success) {
      return {
        success: false,
        error:
          errorMessages[result.error.code] || 'An unexpected error occurred',
      };
    }

    return { success: true, data: result.data };
  } catch (error) {
    logger.warn('Failed to read cookie:', error);
    return {
      success: false,
      error: 'Failed to read cookie',
    };
  }
};
