import { generateDrizzleJson, generateMigration } from 'drizzle-kit/api';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import * as schema from './schema';

// drizzle.config.ts writes migrations here, relative to the repo root
const MIGRATIONS_FOLDER = 'drizzle';

const readJson = (file: string) =>
  JSON.parse(readFileSync(`${MIGRATIONS_FOLDER}/meta/${file}`, 'utf8'));

describe('database schema', () => {
  // The same diff `drizzle-kit generate` runs, without writing files, so a
  // schema change committed without its migration fails `just ci`
  it('matches the latest migration', async () => {
    const { entries } = readJson('_journal.json');
    const latestIdx = String(entries.at(-1).idx).padStart(4, '0');
    const latestSnapshot = readJson(`${latestIdx}_snapshot.json`);

    const missing = await generateMigration(
      latestSnapshot,
      generateDrizzleJson(schema)
    );

    expect(
      missing,
      'schema.ts has changes without a migration: run `just db-generate`, review the SQL and commit it'
    ).toEqual([]);
  });
});
