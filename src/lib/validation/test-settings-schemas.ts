import { createSelectSchema, createUpdateSchema } from 'drizzle-zod';
import { testSettings } from '../db/schema';

// Validation schema for fetching test settings
export const testSettingsSelectSchema = createSelectSchema(testSettings).omit({
  updatedAt: true,
});

// No 'insert' schema required as table has default values

// Validation schema for updating test settings
export const testSettingsUpdateSchema = createUpdateSchema(testSettings).omit({
  userId: true,
  updatedAt: true,
});

// Validation schema for TestSettingsInput
export const testSettingsInputSchema = createSelectSchema(testSettings).pick({
  direction: true,
  answerMode: true,
  questionLimit: true,
  timeLimitMins: true,
});
