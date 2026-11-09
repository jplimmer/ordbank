import { execSync } from 'node:child_process';

/** Connection string for a Neon branch, looked up by name with `neonctl`. */
export function neonConnectionString(branch: string): string {
  // Named explicitly because `neonctl connection-string` with no branch
  // returns the project's default branch, which is production
  return execSync(`neonctl connection-string ${branch}`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  }).trim();
}
