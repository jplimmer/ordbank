import { VOCAB_UI_COLS } from '@/db/schema';

export type VocabKeys = keyof typeof VOCAB_UI_COLS;
export type SortDirection = 'asc' | 'desc';
export type EditForm = Record<VocabKeys, string>;
