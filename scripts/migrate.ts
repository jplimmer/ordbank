/** Applies pending migrations to the DATABASE_URL database; run with `just db-migrate`. */

import { loadEnvConfig } from '@next/env';
import { envSchema, parseEnv } from '../src/lib/env/schema';
import { applyMigrations } from './apply-migrations';

async function main() {
  // Same files and precedence as `next build`, as in drizzle.config.ts
  loadEnvConfig(process.cwd());
  const { DATABASE_URL } = parseEnv(envSchema.pick({ DATABASE_URL: true }));
  await applyMigrations(DATABASE_URL);
}

main().catch((error: unknown) => {
  // The whole error, not just its message: Drizzle's names only the failed
  // query, and the database's reason is in its `cause`. drizzle-kit migrate
  // printed neither, which is why this script exists.
  console.error(error);
  process.exit(1);
});
