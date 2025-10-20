import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { VALIDATION_LIMITS } from '../constants/validation';
import { vocabulary } from '../db/schema';

// Constants for validation
const max = VALIDATION_LIMITS.MAX_WORD_LENGTH_CH;

// Reusable word field schema
const wordFieldSchema = z
  .string()
  .trim()
  .min(1, { message: 'Field cannot be empty' })
  .max(max, {
    message: `Word cannot be longer than ${max} characters`,
  })
  .toLowerCase();

// Validation schema for fetching vocab
export const vocabItemSelectSchema = createSelectSchema(vocabulary);
export const vocabSelectSchema = z.array(vocabItemSelectSchema);

// Validation schema for adding new vocab
export const vocabInsertSchema = createInsertSchema(vocabulary, {
  source: wordFieldSchema,
  target: wordFieldSchema,
}).omit({ totalAttempts: true, correctAttempts: true, lastAttemptedAt: true });

// Validation schema for updating existing vocab - user cannot update languagePairId
export const vocabUpdateSchema = createUpdateSchema(vocabulary, {
  source: wordFieldSchema.optional(),
  target: wordFieldSchema.optional(),
}).omit({ languagePairId: true });
