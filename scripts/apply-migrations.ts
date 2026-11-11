import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { readFileSync } from 'node:fs';

// drizzle.config.ts writes migrations here, relative to the repo root
const MIGRATIONS_FOLDER = 'drizzle';

type Journal = { entries: { tag: string; when: number }[] };

/** Applies pending migrations to a database, logging the host and migrations. */
export async function applyMigrations(url: string, label?: string) {
  // The host isn't secret and identifies the database: on Neon, the branch's
  // compute endpoint
  const { host } = new URL(url);
  console.log(`Migrating ${label ? `${label} (${host})` : host}`);

  const db = drizzle(url);
  try {
    const pending = await pendingMigrations(db);
    // All pending migrations run in one transaction, so a failure rolls back
    // every one of them
    await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER });
    console.log(
      pending.length > 0
        ? pending.map((tag) => `Applied ${tag}`).join('\n')
        : 'Nothing to apply'
    );
  } finally {
    await db.$client.end();
  }
}

// Drizzle's own rule: every journal entry newer than the latest recorded one
async function pendingMigrations(db: ReturnType<typeof drizzle>) {
  const { entries }: Journal = JSON.parse(
    readFileSync(`${MIGRATIONS_FOLDER}/meta/_journal.json`, 'utf8')
  );

  // Checked first because an empty database has no history table to query
  const { rows: tables } = await db.execute<{ exists: boolean }>(
    sql`SELECT to_regclass('drizzle.__drizzle_migrations') IS NOT NULL AS exists`
  );
  const latest = tables[0].exists
    ? (
        await db.execute<{ latest: string | null }>(
          sql`SELECT max(created_at) AS latest FROM drizzle.__drizzle_migrations`
        )
      ).rows[0].latest
    : null;

  return entries
    .filter((entry) => latest === null || entry.when > Number(latest))
    .map((entry) => entry.tag);
}
