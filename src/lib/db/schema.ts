import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

// Tables
export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 255 }).notNull(),
  activeLanguagePairId: integer('active_language_pair_id').notNull(),
});

export const languagePairs = pgTable(
  'language_pairs',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    sourceLanguage: text('source_language').notNull(),
    targetLanguage: text('target_language').notNull(),
    pairName: text('pair_name').notNull(),
  },
  (t) => [
    uniqueIndex('language_pairs_user_source_target_unique').on(
      t.userId,
      t.sourceLanguage,
      t.targetLanguage
    ),
  ]
);

export const vocabulary = pgTable(
  'vocabulary',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    languagePairId: integer('language_pair_id')
      .notNull()
      .references(() => languagePairs.id, { onDelete: 'cascade' }),
    source: text('source').notNull(),
    target: text('target').notNull(),
    totalAttempts: integer('total_attempts').notNull().default(0),
    correctAttempts: integer('correct_attempts').notNull().default(0),
    lastAttemptedAt: timestamp('last_attempted_at'),
  },
  (t) => [
    uniqueIndex('vocabulary_language_pair_source_unique').on(
      t.languagePairId,
      t.source
    ),
  ]
);

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
