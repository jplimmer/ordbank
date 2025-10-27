import { z } from 'zod';
import {
  userInsertSchema,
  userSelectSchema,
  userUpdateScema,
} from '../validation/user-schemas';

export type User = z.infer<typeof userSelectSchema>;
export type InsertUser = z.infer<typeof userInsertSchema>;
export type UpdateUser = z.infer<typeof userUpdateScema>;
