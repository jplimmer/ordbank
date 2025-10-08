import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { languagePairs, vocabulary } from '../db/schema';

export const languagePairBelongsToUser = async (
  userId: number,
  languagePairId: number
): Promise<boolean> => {
  const result = await db.query.languagePairs.findFirst({
    where: and(
      eq(languagePairs.id, languagePairId),
      eq(languagePairs.userId, userId)
    ),
    columns: { id: true },
  });

  return result !== undefined;
};

export const assertLanguagePairOwnership = async (
  userId: number,
  languagePairId: number
) => {
  const belongs = await languagePairBelongsToUser(userId, languagePairId);
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
