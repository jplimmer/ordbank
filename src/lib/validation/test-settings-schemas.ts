import { createSelectSchema } from 'drizzle-zod';
import { VALIDATION_LIMITS } from '../constants/validation';
import { testSettings } from '../db/schema';

// Validation schema for fetching test settings
export const testSettingsSelectSchema = createSelectSchema(testSettings).omit({
  updatedAt: true,
});

// No 'insert' schema required as table has default values

// Validation schema for updating test settings
export const testSettingsUpdateSchema = createSelectSchema(testSettings, {
  questionLimit: (schema) => schema.min(1).max(VALIDATION_LIMITS.MAX_QUESTIONS),
  timeLimitMins: (schema) => schema.min(1).max(VALIDATION_LIMITS.MAX_TIME_MINS),
}).omit({ id: true, userId: true, updatedAt: true });
