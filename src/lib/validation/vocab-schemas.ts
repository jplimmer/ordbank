import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { vocabulary } from '../db/schema';

// Constants for validation
const MAX_WORD_LENGTH = 50;

// Reusable word field schema
const wordFieldSchema = z
  .string()
  .trim()
  .min(1, { message: 'Field cannot be empty' })
  .max(MAX_WORD_LENGTH, {
    message: `Word cannot be longer than ${MAX_WORD_LENGTH} characters`,
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
  source: wordFieldSchema,
  target: wordFieldSchema,
}).omit({ languagePairId: true });
