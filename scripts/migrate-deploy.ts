/** Applies pending migrations in a Vercel production build; runs before `next build`. */

import { applyMigrations } from './apply-migrations';
import { migrationTargets } from './migration-targets';

async function main() {
  const targets = migrationTargets(process.env);
  if (targets.length === 0) {
    console.log('Skipping migrations: not a Vercel production build');
    return;
  }

  for (const { branch, url } of targets) {
    // A failure rolls back, fails the build and leaves the previous deployment
    // live; template is never migrated past production
    await applyMigrations(url, branch);
  }
}

main().catch((error: unknown) => {
  // The whole error, not just its message: Drizzle's names only the failed
  // query, and the database's reason is in its `cause`
  console.error(error);
  process.exit(1);
});
