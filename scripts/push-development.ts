/** Pushes schema.ts straight to the `development` Neon branch; run with `pnpm db:push`. */

import { execSync } from 'node:child_process';
import { neonConnectionString } from './neon';

// Resolved by branch name rather than read from DATABASE_URL, so a push can
// only ever reach development. drizzle.config.ts keeps a DATABASE_URL that's
// already set, so this overrides .env.local.
const DATABASE_URL = neonConnectionString('development');

try {
  execSync('drizzle-kit push', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL },
  });
} catch {
  // drizzle-kit has already printed why
  process.exit(1);
}
