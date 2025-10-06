import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

// Tables
export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});

export const languagePairs = pgTable('language_pairs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sourceLanguage: text().notNull(),
  targetLanguage: text().notNull(),
  name: text().notNull(),
});

export const vocabulary = pgTable('vocabulary', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  languagePairId: integer()
    .notNull()
    .references(() => languagePairs.id, { onDelete: 'cascade' }),
  source: text().notNull().unique(),
  target: text().notNull(),
});

// Relationships
export const userRelations = relations(users, ({ many }) => ({
  languagePairs: many(languagePairs),
}));

export const languagePairsRelations = relations(
  languagePairs,
  ({ one, many }) => ({
    user: one(users, {
      fields: [languagePairs.userId],
      references: [users.id],
    }),
    vocabulary: many(vocabulary),
  })
);

export const vocabularyRelations = relations(vocabulary, ({ one }) => ({
  languagePair: one(languagePairs, {
    fields: [vocabulary.languagePairId],
    references: [languagePairs.id],
  }),
}));

// Generated types
export type VocabItem = InferSelectModel<typeof vocabulary>;
export type NewVocabItem = InferInsertModel<typeof vocabulary>;
