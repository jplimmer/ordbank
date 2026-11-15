import { describe, expect, it } from 'vitest';
import { migrationTargets } from './migration-targets';

const PRODUCTION_URL = 'postgresql://app:secret@production.example.com/neondb';
const TEMPLATE_URL = 'postgresql://app:secret@template.example.com/neondb';

describe('migrationTargets', () => {
  it.each([
    ['a local or CI build', {}],
    ['a Vercel preview build', { VERCEL_ENV: 'preview' }],
    ['a Vercel development build', { VERCEL_ENV: 'development' }],
  ])('migrates nothing in %s', (_, vercelEnv) => {
    expect(
      migrationTargets({
        ...vercelEnv,
        DATABASE_URL: PRODUCTION_URL,
        TEMPLATE_DATABASE_URL: TEMPLATE_URL,
      })
    ).toEqual([]);
  });

  it('migrates production, then template, in a Vercel production build of main', () => {
    expect(
      migrationTargets({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        DATABASE_URL: PRODUCTION_URL,
        TEMPLATE_DATABASE_URL: TEMPLATE_URL,
      })
    ).toEqual([
      { branch: 'production', url: PRODUCTION_URL },
      { branch: 'template', url: TEMPLATE_URL },
    ]);
  });

  // Their migrations haven't been reviewed, and skipping them would put the
  // code live without its schema
  it.each([
    ['a promoted preview', { VERCEL_GIT_COMMIT_REF: 'feature/notes' }],
    ['a CLI deploy', {}],
  ])('rejects a production build of %s', (_, git) => {
    expect(() =>
      migrationTargets({
        ...git,
        VERCEL_ENV: 'production',
        DATABASE_URL: PRODUCTION_URL,
        TEMPLATE_DATABASE_URL: TEMPLATE_URL,
      })
    ).toThrow('Refusing to migrate production');
  });

  // Before migrating anything, so production never moves ahead of template
  // because of a misconfigured variable
  it('rejects a production build without a template connection string', () => {
    expect(() =>
      migrationTargets({
        VERCEL_ENV: 'production',
        VERCEL_GIT_COMMIT_REF: 'main',
        DATABASE_URL: PRODUCTION_URL,
      })
    ).toThrow('TEMPLATE_DATABASE_URL');
  });
});
