import { WORD_LIST_UI_COLS } from '@/db/schema';

export type WordListKeys = keyof typeof WORD_LIST_UI_COLS;
export type SortDirection = 'asc' | 'desc';
export type EditForm = Record<WordListKeys, string>;
