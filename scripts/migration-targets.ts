import { z } from 'zod';
import { envSchema, parseEnv } from '../src/lib/env/schema';

const productionEnvSchema = z.object({
  DATABASE_URL: envSchema.shape.DATABASE_URL,
  TEMPLATE_DATABASE_URL: envSchema.shape.DATABASE_URL,
});

/** A Neon branch a deploy migrates, and how to connect to it. */
export type MigrationTarget = {
  branch: 'production' | 'template';
  url: string;
};

/** The databases a build applies pending migrations to, in order. */
export function migrationTargets(
  env: Record<string, string | undefined>
): MigrationTarget[] {
  // Previews share `development` with local dev, so only production deploys
  // migrate; everything else is migrated by hand or by CI
  if (env.VERCEL_ENV !== 'production') return [];

  const urls = parseEnv(productionEnvSchema, env);
  // Production first: template only ever records what production has
  return [
    { branch: 'production', url: urls.DATABASE_URL },
    { branch: 'template', url: urls.TEMPLATE_DATABASE_URL },
  ];
}
