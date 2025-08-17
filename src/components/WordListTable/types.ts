import { WORD_LIST_UI_COLS } from '@/db/schema';

export type WordListKeys = keyof typeof WORD_LIST_UI_COLS;
export type EditForm = Record<WordListKeys, string>;

export interface SortState {
  field: string | null;
  direction: 'asc' | 'desc';
}

export interface EditState {
  editingId: number | null;
  editForm: EditForm;
}
