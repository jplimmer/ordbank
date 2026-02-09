import { z } from 'zod';
import { userInsertSchema, userSelectSchema } from '../validation/user-schemas';

export type User = z.infer<typeof userSelectSchema>;
export type InsertUser = z.infer<typeof userInsertSchema>;
