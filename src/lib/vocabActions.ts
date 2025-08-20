'use server';

import { db } from '@/db';
import { VocabItem, vocabulary } from '@/db/schema';
import { getLogger } from '@/utils/logger';
import { eq } from 'drizzle-orm/sqlite-core/expressions';
import { revalidatePath } from 'next/cache';
import { ROUTES } from './routes';

const logger = getLogger();

export interface VocabActionResult<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function getVocab(): Promise<VocabActionResult<VocabItem[]>> {
  try {
    const vocab = await db
      .select()
      .from(vocabulary)
      .orderBy(vocabulary.swedish);

    return { success: true, data: vocab, message: '' };
  } catch (error) {
    logger.error('Failed to retrieve Vocabulary', error);
    return { success: false, message: 'Failed to retrieve Vocabulary' };
  }
}

export async function addVocab(
  prevState: VocabActionResult,
  formData: FormData
): Promise<VocabActionResult> {
  const swedish = formData.get('swedish') as string;
  const english = formData.get('english') as string;

  if (!swedish || !english) {
    logger.error('Both words are required');
    return { success: false, message: 'Both words are required' };
  }

  try {
    await db.insert(vocabulary).values({
      swedish: swedish.trim(),
      english: english.trim(),
    });

    revalidatePath(ROUTES.VOCAB);

    return { success: true };
  } catch (error) {
    logger.error('Failed to add vocab', error);
    return { success: false, message: 'Failed to add vocab.' };
  }
}

export async function deleteVocabItem(id: number): Promise<VocabActionResult> {
  try {
    await db.delete(vocabulary).where(eq(vocabulary.id, id));
    logger.debug(`Deleted vocab item ${id}`);
    revalidatePath(ROUTES.VOCAB);
    return { success: true };
  } catch (error) {
    logger.error(`Failed to delete vocab item ${id}`, error);
    return {
      success: false,
      message: `Failed to delete vocab item ${id}`,
    };
  }
}

export async function updateVocabItem({
  id,
  swedish,
  english,
}: VocabItem): Promise<VocabActionResult> {
  try {
    await db
      .update(vocabulary)
      .set({ swedish: swedish, english: english })
      .where(eq(vocabulary.id, id));
    logger.debug(`Updated vocab item ${id} with "${swedish}: ${english}"`);
    revalidatePath(ROUTES.VOCAB);
    return { success: true };
  } catch (error) {
    logger.error(`Failed to update vocab item ${id}`, error);
    return { success: false, message: `Failed to update vocab item ${id}` };
  }
}
