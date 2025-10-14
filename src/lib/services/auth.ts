'use server';

import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { languagePairs, vocabulary } from '../db/schema';
import { Result } from '../types/common';
import { getActiveLanguagePair } from './active-language-pair';

export interface UserProfile {
  userId: number;
  languagePairId: number;
}

export const getCurrentProfile = async (): Promise<Result<UserProfile>> => {
  // TO DO - authenticate user
  const userId = 1;
  if (!userId) {
    return { success: false, error: 'User not authenticated' };
  }

  // Get user's last active languagePair
  const activeLanguage = await getActiveLanguagePair(userId);
  if (!activeLanguage.success) {
    return { success: false, error: activeLanguage.error };
  }

  return {
    success: true,
    data: { userId, languagePairId: activeLanguage.data.id },
  };
};

export const languagePairBelongsToUser = async (
  userProfile: UserProfile
): Promise<boolean> => {
  const result = await db.query.languagePairs.findFirst({
    where: and(
      eq(languagePairs.id, userProfile.languagePairId),
      eq(languagePairs.userId, userProfile.userId)
    ),
    columns: { id: true },
  });

  return result !== undefined;
};

export const assertLanguagePairOwnership = async (userProfile: UserProfile) => {
  const belongs = await languagePairBelongsToUser(userProfile);
  if (!belongs) {
    throw new Error(
      'Unauthorised: Language pair does not belong to the current user.'
    );
  }
};

export const vocabItemBelongsToLanguagePair = async (
  languagePairId: number,
  vocabItemId: number
): Promise<boolean> => {
  const result = await db.query.vocabulary.findFirst({
    where: and(
      eq(vocabulary.id, vocabItemId),
      eq(vocabulary.languagePairId, languagePairId)
    ),
    columns: { id: true },
  });

  return result !== undefined;
};

export const assertVocabItemOwnership = async (
  languagePairId: number,
  vocabItemId: number
) => {
  const belongs = await vocabItemBelongsToLanguagePair(
    languagePairId,
    vocabItemId
  );
  if (!belongs) {
    throw new Error(
      'Error: Vocab item does not belong to the specified lanugage pair.'
    );
  }
};
