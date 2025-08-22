import {
  LanugageDirection,
  TestFormat,
  TestLength,
} from '@/config/test-settings';
import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Tables
export const users = sqliteTable('users', {
  id: int('id').primaryKey({ autoIncrement: true }),
  username: text().notNull(),
});

export const vocabulary = sqliteTable('vocabulary', {
  id: int('id').primaryKey({ autoIncrement: true }),
  userId: int()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  source: text().unique().notNull(),
  target: text().notNull(),
});

export const testSettings = sqliteTable('test_settings', {
  id: int('id').primaryKey({ autoIncrement: true }),
  userId: int()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  testLength: text().$type<TestLength>(),
  testFormat: text().$type<TestFormat>(),
  languageDirection: text().$type<LanugageDirection>(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  vocabulary: many(vocabulary),
  testSettings: many(testSettings),
}));

export const vocabularyRelations = relations(vocabulary, ({ one }) => ({
  user: one(users, {
    fields: [vocabulary.userId],
    references: [users.id],
  }),
}));

export const testSettingsRelations = relations(testSettings, ({ one }) => ({
  user: one(users, {
    fields: [testSettings.userId],
    references: [users.id],
  }),
}));

// Generated types
export type VocabItem = InferSelectModel<typeof vocabulary>;
export type NewVocabItem = InferInsertModel<typeof vocabulary>;
