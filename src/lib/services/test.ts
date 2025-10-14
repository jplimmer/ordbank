'server only';

import { eq, sql } from 'drizzle-orm';
import { db } from '../db';
import { vocabulary } from '../db/schema';
import { QuestionVocabItem } from '../types/test';
import { assertLanguagePairOwnership, UserProfile } from './auth';

export const selectVocabItem = async (
  userProfile: UserProfile
): Promise<QuestionVocabItem> => {
  // Verify requested language pair belongs to user
  await assertLanguagePairOwnership(userProfile);

  // Get vocab item from database - random selection weighted by accuracy
  const [question] = await db
    .select({
      id: vocabulary.id,
      source: vocabulary.source,
      target: vocabulary.target,
    })
    .from(vocabulary)
    .where(eq(vocabulary.languagePairId, userProfile.languagePairId))
    .orderBy(
      sql`(1 - COALESCE(${vocabulary.correctAttempts}::float / 
          NULLIF(${vocabulary.totalAttempts}, 0), 0.5)) * random() DESC`
    )
    .limit(1);

  return question;
};
