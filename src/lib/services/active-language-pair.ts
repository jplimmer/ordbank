'server-only';

import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db } from '../db';
import { users } from '../db/schema';
import { getLogger } from '../logger';
import { Result } from '../types/common';
import { LanguagePair } from '../types/language-pair';
import { assertLanguagePairOwnership, UserProfile } from './auth';
import { getLanguagePair } from './language-pairs';

const logger = getLogger();

const activePairCookieName = 'activeLanguagePairId';

const getCookiesActiveLanguagePair = async (): Promise<number | undefined> => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.get(activePairCookieName)?.value;
  const parsedString = Number(cookieString);
  const langPairId = Number.isFinite(parsedString) ? parsedString : undefined;
  logger.debug(`Fetched cookie ${activePairCookieName}:`, langPairId);
  return langPairId;
};

const setCookiesActiveLanguagePair = async (
  languagePairId: number
): Promise<Result<number>> => {
  try {
    const cookieStore = await cookies();
    cookieStore.set(activePairCookieName, languagePairId.toString());

    logger.info(
      'Set cookies for active language pair:',
      cookieStore.get(activePairCookieName)
    );
    return { success: true, data: languagePairId };
  } catch (error) {
    const errorMsg = `Failed to set active language pair in cookies: ${error instanceof Error ? error.message : String(error)}`;
    logger.warn(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

const getDbActiveLanguagePair = async (
  userId: number
): Promise<number | null | undefined> => {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { activeLanguagePairId: true },
  });

  logger.debug(
    'Fetched database activeLanguagePairId:',
    result?.activeLanguagePairId
  );
  return result?.activeLanguagePairId;
};

const setDbActiveLanguagePair = async (
  userProfile: UserProfile
): Promise<Result<number>> => {
  try {
    // Verify the languagePair belongs to the user
    await assertLanguagePairOwnership(userProfile);

    // Update active language pair for the user in database
    const [updatedUser] = await db
      .update(users)
      .set({ activeLanguagePairId: userProfile.languagePairId })
      .where(eq(users.id, userProfile.userId))
      .returning();

    if (updatedUser.activeLanguagePairId === null) {
      return { success: false, error: 'Returned value is still null' };
    }

    logger.info(
      `Updated active language pair to ${updatedUser.activeLanguagePairId} for user ${updatedUser.id} in database`
    );
    return { success: true, data: updatedUser.activeLanguagePairId };
  } catch (error) {
    const errorMsg = `Failed to set active language pair in database: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};

export const getActiveLanguagePair = async (
  userId: number
): Promise<Result<LanguagePair>> => {
  let activeLanguagePairId: number | null | undefined;

  // Get active language pair id from cookies
  activeLanguagePairId = await getCookiesActiveLanguagePair();

  // If doesn't exist in cookies, get from database
  if (!activeLanguagePairId) {
    activeLanguagePairId = await getDbActiveLanguagePair(userId);
  }

  if (!activeLanguagePairId)
    return { success: false, error: 'No active language pair id found' };

  return await getLanguagePair({
    userId,
    languagePairId: activeLanguagePairId,
  });
};

export const setActiveLanguagePair = async (
  userProfile: UserProfile
): Promise<Result<LanguagePair>> => {
  // Set cookies
  const cookiesResult = await setCookiesActiveLanguagePair(
    userProfile.languagePairId
  );

  // Update database
  const dbResult = await setDbActiveLanguagePair(userProfile);

  if (!cookiesResult.success && !dbResult.success) {
    return {
      success: false,
      error: 'Both cookies and database updates failed',
    };
  }

  return await getLanguagePair(userProfile);
};
