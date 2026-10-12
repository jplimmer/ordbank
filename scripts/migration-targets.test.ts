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

  it('migrates production, then template, in a Vercel production build', () => {
    expect(
      migrationTargets({
        VERCEL_ENV: 'production',
        DATABASE_URL: PRODUCTION_URL,
        TEMPLATE_DATABASE_URL: TEMPLATE_URL,
      })
    ).toEqual([
      { branch: 'production', url: PRODUCTION_URL },
      { branch: 'template', url: TEMPLATE_URL },
    ]);
  });

  // Before migrating anything, so production never moves ahead of template
  // because of a misconfigured variable
  it('rejects a production build without a template connection string', () => {
    expect(() =>
      migrationTargets({
        VERCEL_ENV: 'production',
        DATABASE_URL: PRODUCTION_URL,
      })
    ).toThrow('TEMPLATE_DATABASE_URL');
  });
});
