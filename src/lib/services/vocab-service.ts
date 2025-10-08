'server-only';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { vocabulary } from '../db/schema';
import { getLogger } from '../logger';
import { Result } from '../types/types';
import { VocabItem } from '../types/vocab';
import { vocabSelectSchema } from '../validation/vocab-schemas';
import { assertLanguagePairOwnership } from './check-ownership';

const logger = getLogger();

export const getVocab = async (
  userId: number,
  languagePairId: number
): Promise<Result<VocabItem[]>> => {
  try {
    // Verify the languagePair belongs to the user
    await assertLanguagePairOwnership(userId, languagePairId);

    // Fetch vocabulary data from db
    const vocab = await db
      .select()
      .from(vocabulary)
      .where(eq(vocabulary.languagePairId, languagePairId))
      .orderBy(vocabulary.source);

    // Validate db response with Zod
    const parseResult = vocabSelectSchema.safeParse(vocab);

    if (!parseResult.success) {
      const errors = z.flattenError(parseResult.error).fieldErrors;
      const errorMsg = `Vocabulary data validation failed: ${parseResult.error.message}`;
      logger.error(errorMsg, { error: errors });
      return { success: false, error: errorMsg };
    }

    return { success: true, data: vocab };
  } catch (error) {
    const errorMsg = `Failed to get vocabulary: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};
