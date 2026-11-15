import { z } from 'zod';
import { envSchema, parseEnv } from '../src/lib/env/schema';

// Vercel's production branch
const PRODUCTION_BRANCH = 'main';

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

  // Anything else is a promoted preview or a CLI deploy, whose migrations
  // haven't been reviewed. Failing rather than skipping, because the code
  // would go live without its schema; a CLI deploy has no ref, so it fails too.
  if (env.VERCEL_GIT_COMMIT_REF !== PRODUCTION_BRANCH) {
    throw new Error(
      `Refusing to migrate production from ${env.VERCEL_GIT_COMMIT_REF ?? 'a deploy with no git branch'}: only ${PRODUCTION_BRANCH} deploys to production`
    );
  }

  const urls = parseEnv(productionEnvSchema, env);
  // Production first: template only ever records what production has
  return [
    { branch: 'production', url: urls.DATABASE_URL },
    { branch: 'template', url: urls.TEMPLATE_DATABASE_URL },
  ];
}
