/** Pushes schema.ts straight to the `development` Neon branch; run with `pnpm db:push`. */

import { spawnSync } from 'node:child_process';
import { neonConnectionString } from './neon';

// Resolved by branch name rather than read from DATABASE_URL, so a push can
// only ever reach development
const DATABASE_URL = neonConnectionString('development');

const { status } = spawnSync('drizzle-kit push', {
  stdio: 'inherit',
  // Windows can only run the drizzle-kit.cmd shim through a shell
  shell: true,
  // drizzle.config.ts keeps a DATABASE_URL that's already set, so this wins
  // over .env.local
  env: { ...process.env, DATABASE_URL },
});

// drizzle-kit has already printed any error, so just pass its result on
process.exit(status ?? 1);
