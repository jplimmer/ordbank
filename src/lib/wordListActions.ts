'use server';

import { db } from '@/db';
import { WordListItem, wordListTable } from '@/db/schema';
import { getLogger } from '@/utils/logger';
import { eq } from 'drizzle-orm/sqlite-core/expressions';
import { revalidatePath } from 'next/cache';
import { ROUTES } from './routes';

const logger = getLogger();

export interface WordListActionResult<T = void> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function getWordList(): Promise<
  WordListActionResult<WordListItem[]>
> {
  try {
    const wordList = await db
      .select()
      .from(wordListTable)
      .orderBy(wordListTable.id);

    return { success: true, data: wordList, message: '' };
  } catch (error) {
    logger.error('Failed to retrieve WordList', error);
    return { success: false, message: 'Failed to retrieve WordList' };
  }
}

export async function addWord(
  prevState: WordListActionResult,
  formData: FormData
): Promise<WordListActionResult> {
  const swedish = formData.get('swedish') as string;
  const english = formData.get('english') as string;

  if (!swedish || !english) {
    logger.error('Both words are required');
    return { success: false, message: 'Both words are required' };
  }

  try {
    await db.insert(wordListTable).values({
      swedish: swedish.trim(),
      english: english.trim(),
    });

    revalidatePath(ROUTES.WORD_LIST);

    return { success: true };
  } catch (error) {
    logger.error('Failed to add word pair', error);
    return { success: false, message: 'Failed to add word pair.' };
  }
}

export async function deleteWord(id: number): Promise<WordListActionResult> {
  try {
    await db.delete(wordListTable).where(eq(wordListTable.id, id));
    logger.debug(`Deleted word with id ${id}`);
    revalidatePath(ROUTES.WORD_LIST);
    return { success: true, message: '' };
  } catch (error) {
    logger.error(`Failed to delete word (id: ${id})`, error);
    return { success: false, message: 'Failed to delete word with id ' };
  }
}

export async function updateWord({
  id,
  swedish,
  english,
}: WordListItem): Promise<WordListActionResult> {
  try {
    await db
      .update(wordListTable)
      .set({ swedish: swedish, english: english })
      .where(eq(wordListTable.id, id));
    logger.debug(`Updated id ${id} with "${swedish}: ${english}"`);
    revalidatePath(ROUTES.WORD_LIST);
    return { success: true, message: '' };
  } catch (error) {
    logger.error('Failed to update word', error);
    return { success: false, message: 'Failed to update word' };
  }
}
