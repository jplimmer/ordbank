'server-only';

import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { languagePairs } from '../db/schema';
import { getLogger } from '../logger';
import { LanguagePair } from '../types/language-pair';
import { Result } from '../types/types';
import { languagePairSelectSchema } from '../validation/language-pair-schemas';
import { assertLanguagePairOwnership } from './auth';

const logger = getLogger();

export const getLanguagePair = async (
  userId: number,
  languagePairId: number
): Promise<Result<LanguagePair>> => {
  try {
    // Verify the language pair belongs to the user
    await assertLanguagePairOwnership(userId, languagePairId);

    // Fetch language pair data from db
    const langPair = await db.query.languagePairs.findFirst({
      where: eq(languagePairs.id, languagePairId),
    });

    // Validate database response
    const parseResult = languagePairSelectSchema.safeParse(langPair);

    if (!parseResult.success) {
      const errors = z.flattenError(parseResult.error).fieldErrors;
      const errorMsg = `Language pair validation failed: ${parseResult.error.message}`;
      logger.error(errorMsg, { error: errors });
      return { success: false, error: errorMsg };
    }

    logger.info(
      `Fetched data for active language pair (${parseResult.data.pairName})`
    );
    return { success: true, data: parseResult.data };
  } catch (error) {
    const errorMsg = `Failed to get LanguagePair: ${error instanceof Error ? error.message : String(error)}`;
    logger.error(errorMsg, { error });
    return { success: false, error: errorMsg };
  }
};
