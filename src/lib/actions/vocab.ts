'use server';

import { db } from '@/lib/db';
import { vocabulary } from '@/lib/db/schema';
import { getLogger } from '@/lib/logger';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { ROUTES } from '../constants/routes';
import { getCurrentProfile } from '../services/auth';
import { createVocabItem, deleteVocabItem } from '../services/vocab';
import { Result } from '../types/types';
import { VocabItem } from '../types/vocab';
import { vocabInsertSchema } from '../validation/vocab-schemas';

const logger = getLogger();

export const createVocabAction = async (
  prevState: Result<VocabItem>,
  formData: FormData
): Promise<Result<VocabItem>> => {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  if (!profileCheck.success) {
    return profileCheck;
  }

  // Untyped - will be handled by validation
  const newVocabItem = {
    languagePairId: profileCheck.data.languagePairId,
    source: formData.get('source'),
    target: formData.get('target'),
  };

  // Parse form data before sending to service (fail fast)
  const parseResult = vocabInsertSchema.safeParse(newVocabItem);
  if (!parseResult.success) {
    const errors = z.flattenError(parseResult.error).fieldErrors;
    const errorMsg = `New vocabulary data validation failed: ${parseResult.error.message}`;
    logger.error(errorMsg, { error: errors });
    return { success: false, error: errorMsg };
  }

  // Add vocab item to database
  const createResult = await createVocabItem(
    profileCheck.data.userId,
    parseResult.data
  );
  if (!createResult.success) return createResult;

  // Revalidate route and return created item
  revalidatePath(ROUTES.VOCAB);
  return { success: true, data: createResult.data };
};

export const updateVocabAction = async ({
  id,
  source,
  target,
}: VocabItem): Promise<Result<VocabItem>> => {
  try {
    await db
      .update(vocabulary)
      .set({ source: source, target: target })
      .where(eq(vocabulary.id, id));
    logger.debug(`Updated vocab item ${id} with "${source}: ${target}"`);
    revalidatePath(ROUTES.VOCAB);
    return { success: true };
  } catch (error) {
    logger.error(`Failed to update vocab item ${id}`, error);
    return { success: false, error: `Failed to update vocab item ${id}` };
  }
};

export const deleteVocabAction = async (
  vocabId: number
): Promise<Result<VocabItem>> => {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  if (!profileCheck.success) {
    return profileCheck;
  }

  // Delete vocab item from database
  const deleteResult = await deleteVocabItem(profileCheck.data, vocabId);
  if (!deleteResult.success) return deleteResult;

  // Revalidate route and return deleted item
  revalidatePath(ROUTES.VOCAB);
  return { success: true, data: deleteResult.data };
};
