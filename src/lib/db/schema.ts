import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

// Tables
export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 255 }).notNull(),
});

export const languagePairs = pgTable('language_pairs', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  sourceLanguage: text('source_language').notNull(),
  targetLanguage: text('target_language').notNull(),
  pairName: text('pair_name').notNull(),
});

export const vocabulary = pgTable('vocabulary', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  languagePairId: integer('language_pair_id')
    .notNull()
    .references(() => languagePairs.id, { onDelete: 'cascade' }),
  source: text('source').notNull().unique(),
  target: text('target').notNull(),
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
