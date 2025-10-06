// import { FlatCompat } from '@eslint/eslintrc';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends(
//     'next/core-web-vitals',
//     'next/typescript',
//     'plugin:prettier/recommended'
//   ),
// ];

// export default eslintConfig;

import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import nextConfig from 'next/eslint-config-next';

export default [
  nextConfig,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
