import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';
import { envSchema, parseEnv } from './src/lib/env/schema';

// Same files and precedence as `next build`, so drizzle-kit always targets the
// database the app uses
loadEnvConfig(process.cwd());

const { DATABASE_URL } = parseEnv(envSchema.pick({ DATABASE_URL: true }));

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
  },
  strict: true,
});
