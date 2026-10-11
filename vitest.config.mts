import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Reads the `@/*` alias from tsconfig.json, so it has one definition
    tsconfigPaths: true,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
