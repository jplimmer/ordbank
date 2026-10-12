/** Applies pending migrations in a Vercel production build; runs before `next build`. */

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { migrationTargets } from './migration-targets';

async function main() {
  const targets = migrationTargets(process.env);
  if (targets.length === 0) {
    console.log('Skipping migrations: not a Vercel production build');
    return;
  }

  for (const { branch, url } of targets) {
    console.log(`Migrating ${branch}…`);
    const db = drizzle(url);
    try {
      // All pending migrations run in one transaction, so a failure rolls back
      // and fails the build, leaving the previous deployment live
      await migrate(db, { migrationsFolder: 'drizzle' });
    } finally {
      await db.$client.end();
    }
  }
  console.log('Migrations applied');
}

main().catch((error: unknown) => {
  // The whole error, not just its message: Drizzle's names only the failed
  // query, and the database's reason is in its `cause`
  console.error(error);
  process.exit(1);
});
