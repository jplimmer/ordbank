import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from '../db/schema';

export const userSelectSchema = createSelectSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});
export const userInsertSchema = createInsertSchema(users).omit({
  activeLanguagePairId: true,
  createdAt: true,
  updatedAt: true,
});
