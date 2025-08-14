import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
});

export const wordListTable = sqliteTable('word_list_table', {
  id: int('id').primaryKey({ autoIncrement: true }),
  swedish: text('swedish').unique().notNull(),
  english: text('english').notNull(),
});
