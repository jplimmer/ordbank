'use server';

import { db } from '@/db';
import { wordListTable } from '@/db/schema';
import { getLogger } from '@/utils/logger';
import { eq } from 'drizzle-orm/sqlite-core/expressions';
import { revalidatePath } from 'next/cache';
import { ROUTES } from './routes';

const logger = getLogger();

export async function getWordList() {
  logger.debug('Fetching wordListTable...');
  return await db.select().from(wordListTable).orderBy(wordListTable.id);
}

export async function addWord(formData: FormData) {
  const swedish = formData.get('swedish') as string;
  const english = formData.get('english') as string;

  if (!swedish || !english) {
    logger.error('Both words are required');
    throw new Error('Both words are required');
  }

  try {
    await db.insert(wordListTable).values({
      swedish: swedish.trim(),
      english: english.trim(),
    });

    revalidatePath(ROUTES.WORD_LIST);
  } catch (error) {
    logger.error('Failed to add word pair', error);
  }
}

export async function deleteWord(id: number) {
  await db.delete(wordListTable).where(eq(wordListTable.id, id));
  revalidatePath(ROUTES.WORD_LIST);
}

export async function updateWord() {
  logger.info('Update logic goes here...');
}
