import { relations, sql } from 'drizzle-orm';
import {
  check,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { VALIDATION_LIMITS } from '../constants/validation';
import { AnswerModeSettingEnum, DirectionSettingEnum } from '../types/test';

// Tables
export const users = pgTable(
  'users',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    clerkId: varchar('clerk_id', { length: 255 }).notNull(),
    activeLanguagePairId: integer('active_language_pair_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (t) => [uniqueIndex('users_clerk_id_unique').on(t.clerkId)]
);

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
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex('language_pairs_user_source_target_unique').on(
      t.userId,
      t.sourceLanguage,
      t.targetLanguage
    ),
    check(
      'source_name_length_check',
      sql.raw(
        `length(source_language) <= ${VALIDATION_LIMITS.MAX_LANGUAGE_NAME_LENGTH_CH}`
      )
    ),
    check(
      'target_name_length_check',
      sql.raw(
        `length(target_language) <= ${VALIDATION_LIMITS.MAX_LANGUAGE_NAME_LENGTH_CH}`
      )
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
    check(
      'source_word_length_check',
      sql.raw(`length(source) <= ${VALIDATION_LIMITS.MAX_WORD_LENGTH_CH}`)
    ),
    check(
      'target_word_length_check',
      sql.raw(`length(target) <= ${VALIDATION_LIMITS.MAX_WORD_LENGTH_CH}`)
    ),
  ]
);

export const testSettings = pgTable(
  'test_settings',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    direction: text('direction', { enum: DirectionSettingEnum })
      .notNull()
      .default('random'),
    answerMode: text('answer_mode', { enum: AnswerModeSettingEnum })
      .notNull()
      .default('random'),
    questionLimit: integer('question_limit').default(10),
    timeLimitMins: integer('time_limit_mins'),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex('test_settings_user_id_unique').on(t.userId),
    check(
      'question_limit_check',
      sql.raw(
        `question_limit IS NULL OR question_limit <= ${VALIDATION_LIMITS.MAX_QUESTIONS}`
      )
    ),
    check(
      'time_limit_check',
      sql.raw(
        `time_limit_mins IS NULL OR time_limit_mins <= ${VALIDATION_LIMITS.MAX_TIME_MINS}`
      )
    ),
  ]
);

// Relationships
export const userRelations = relations(users, ({ many, one }) => ({
  languagePairs: many(languagePairs),
  testSettings: one(testSettings, {
    fields: [users.id],
    references: [testSettings.userId],
  }),
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

export const testSettingsRelations = relations(testSettings, ({ one }) => ({
  user: one(users, {
    fields: [testSettings.userId],
    references: [users.id],
  }),
}));
