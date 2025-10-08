import { z } from 'zod';
import {
  languagePairInsertSchema,
  languagePairSelectSchema,
  languagePairUpdateSchema,
} from '../validation/language-pair-schemas';

export type LanguagePair = z.infer<typeof languagePairSelectSchema>;
export type InsertLanguagePair = z.infer<typeof languagePairInsertSchema>;
export type UpdateLanguagePair = z.infer<typeof languagePairUpdateSchema>;
