import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { languagePairs } from '../db/schema';

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
