import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { languagePairs } from '../db/schema';

// Constants for validation
const MAX_NAME_LENGTH = 20;

// Reusable word field schema
const languageFieldSchema = z
  .string()
  .trim()
  .min(1, { message: 'Field cannot be empty' })
  .max(MAX_NAME_LENGTH, {
    message: `Name cannot be longer than ${MAX_NAME_LENGTH} characters`,
  })
  .toLowerCase();

// Validation schema for fetching lanugage pairs
export const languagePairSelectSchema = createSelectSchema(languagePairs);
export const languagePairArraySelectSchema = z.array(languagePairSelectSchema);

// Validation schema for adding new language pair - user cannot define userId or
// name (should be handled by data service)
export const languagePairInsertSchema = createInsertSchema(languagePairs, {
  sourceLanguage: languageFieldSchema,
  targetLanguage: languageFieldSchema,
}).omit({ userId: true, pairName: true });

// Validation schema for updating existing language pair - user cannot update userId or
// name (should be handled by data service)
export const languagePairUpdateSchema = createUpdateSchema(languagePairs, {
  sourceLanguage: languageFieldSchema,
  targetLanguage: languageFieldSchema,
}).omit({ userId: true, pairName: true });
