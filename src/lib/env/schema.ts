import { z } from 'zod';

/** Every environment variable the app needs, and the format each must have. */
export const envSchema = z.object({
  DATABASE_URL: z.url({
    protocol: /^postgres(ql)?$/,
    error: 'Expected a Postgres connection string (postgresql://…)',
  }),
  CLERK_SECRET_KEY: z
    .string()
    .startsWith('sk_', 'Expected a Clerk secret key (sk_…)'),
  // Required rather than defaulted: Clerk reads these from `process.env`
  // itself, so a default here would pass validation while Clerk saw nothing
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .startsWith('pk_', 'Expected a Clerk publishable key (pk_…)'),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().startsWith('/'),
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().startsWith('/'),
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().startsWith('/'),
});

/** Validates env vars, throwing an error that names every invalid one. */
export function parseEnv<T extends z.ZodType>(
  schema: T,
  source: Record<string, string | undefined> = process.env
): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    // Every problem in one error, so a broken deployment is fixed in one pass
    // rather than one variable per failed build
    throw new Error(
      `Invalid environment variables:\n${z.prettifyError(result.error)}`
    );
  }
  return result.data;
}
