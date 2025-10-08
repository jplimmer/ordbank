import { z } from 'zod';
import {
  vocabInsertSchema,
  vocabItemSelectSchema,
  vocabUpdateSchema,
} from '../validation/vocab-schemas';

export type VocabItem = z.infer<typeof vocabItemSelectSchema>;
export type InsertVocabItem = z.infer<typeof vocabInsertSchema>;
export type UpdateVocabItem = z.infer<typeof vocabUpdateSchema>;
