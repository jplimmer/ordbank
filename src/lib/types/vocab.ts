import { z } from 'zod';
import {
  vocabInsertSchema,
  vocabSelectSchema,
  vocabUpdateSchema,
} from '../validation/vocab-schemas';

export type VocabItem = z.infer<typeof vocabSelectSchema>;
export type InsertVocabItem = z.infer<typeof vocabInsertSchema>;
export type UpdateVocabItem = z.infer<typeof vocabUpdateSchema>;
