import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { db } from '../db';
import { users } from '../db/schema';
import { getLogger } from '../logger';
import { LanguagePair } from '../types/language-pair';
import { Result } from '../types/types';
import { getLanguagePair } from './language-pairs';

const logger = getLogger();

const getCookiesActiveLanguagePair = async (): Promise<number | undefined> => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.get('activeLanguagePairId')?.value;
  const parsedString = Number(cookieString);
  const langPairId = Number.isFinite(parsedString) ? parsedString : undefined;
  logger.info('Cookies activeLanguagePairId:', langPairId);
  return langPairId;
};

const getDbActiveLanguagePair = async (
  userId: number
): Promise<number | undefined> => {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { activeLanguagePairId: true },
  });

  logger.info('Database activeLanguagePairId:', result?.activeLanguagePairId);
  return result?.activeLanguagePairId;
};

export const getActiveLanguagePair = async (
  userId: number
): Promise<Result<LanguagePair>> => {
  let activeLanguagePairId: number | undefined;

  // Get active language pair id from cookies
  activeLanguagePairId = await getCookiesActiveLanguagePair();

  // If doesn't exist in cookies, get from database
  if (!activeLanguagePairId) {
    activeLanguagePairId = await getDbActiveLanguagePair(userId);
  }

  if (!activeLanguagePairId)
    return { success: false, error: 'No active language pair id found' };

  return await getLanguagePair(userId, activeLanguagePairId);
};
