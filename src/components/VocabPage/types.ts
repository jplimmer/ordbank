import { VocabItem } from '@/lib/db/schema';

export type VocabTableKeys = Exclude<keyof VocabItem, 'id'>;
export type SortDirection = 'asc' | 'desc';
export type EditForm = Record<VocabTableKeys, string>;
