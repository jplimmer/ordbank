import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

// Single source of truth for displayed column names
export const WORD_LIST_UI_COLS = {
  swedish: 'swedish',
  english: 'english',
} as const;

export const wordListTable = sqliteTable('word_list_table', {
  id: int('id').primaryKey({ autoIncrement: true }),
  [WORD_LIST_UI_COLS.swedish]: text().unique().notNull(),
  [WORD_LIST_UI_COLS.english]: text().notNull(),
});

export type WordListItem = InferSelectModel<typeof wordListTable>;
export type NewWordListItem = InferInsertModel<typeof wordListTable>;
