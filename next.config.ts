import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';
import { envSchema, parseEnv } from './src/lib/env/schema';

// Here rather than only at runtime so a misconfigured deployment never builds,
// and because NEXT_PUBLIC_* values are inlined at build: this is their only check
parseEnv(envSchema);

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSerwist(nextConfig);
