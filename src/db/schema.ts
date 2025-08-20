import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const vocabulary = sqliteTable('vocabulary', {
  id: int('id').primaryKey({ autoIncrement: true }),
  source: text().unique().notNull(),
  target: text().notNull(),
});

export type VocabItem = InferSelectModel<typeof vocabulary>;
export type NewVocabItem = InferInsertModel<typeof vocabulary>;
