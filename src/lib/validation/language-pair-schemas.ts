import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { VALIDATION_LIMITS } from '../constants/validation';
import { languagePairs } from '../db/schema';

// Constants for validation
const max = VALIDATION_LIMITS.MAX_LANGUAGE_NAME_LENGTH_CH;

// Reusable word field schema
const languageFieldSchema = z
  .string()
  .trim()
  .min(1, { message: 'Field cannot be empty' })
  .max(max, {
    message: `Name cannot be longer than ${max} characters`,
  })
  .toLowerCase();

// Validation schema for fetching lanugage pairs
export const languagePairSelectSchema = createSelectSchema(languagePairs).omit({
  createdAt: true,
});
export const languagePairArraySelectSchema = z.array(languagePairSelectSchema);

// Validation schema for adding new language pair - user cannot define userId or
// name (should be handled by data service)
export const languagePairInsertSchema = createInsertSchema(languagePairs, {
  sourceLanguage: languageFieldSchema,
  targetLanguage: languageFieldSchema,
}).omit({ userId: true, pairName: true, createdAt: true });

// Validation schema for updating existing language pair - user cannot update userId or
// name (should be handled by data service)
export const languagePairUpdateSchema = createUpdateSchema(languagePairs, {
  sourceLanguage: languageFieldSchema.optional(),
  targetLanguage: languageFieldSchema.optional(),
}).omit({ userId: true, pairName: true, createdAt: true });
