// Makes importing this from a client component a build error, rather than a
// validation failure in the browser where server variables don't exist
import 'server-only';
import { envSchema, parseEnv } from './schema';

// Validates again at runtime because Vercel functions never load
// next.config.ts, so the build-time check doesn't cover them
/** Validated server environment; use instead of `process.env`. */
export const env = parseEnv(envSchema);
