import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

// Single source of truth for displayed column names
export const VOCAB_UI_COLS = {
  swedish: 'swedish',
  english: 'english',
} as const;

export const vocabulary = sqliteTable('vocabulary', {
  id: int('id').primaryKey({ autoIncrement: true }),
  [VOCAB_UI_COLS.swedish]: text().unique().notNull(),
  [VOCAB_UI_COLS.english]: text().notNull(),
});

export type VocabItem = InferSelectModel<typeof vocabulary>;
export type NewVocabItem = InferInsertModel<typeof vocabulary>;
