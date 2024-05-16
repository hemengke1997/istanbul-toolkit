import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const { defineConfig } = require('@minko-fe/eslint-config')
export default defineConfig(
  [
    {
      ignores: ['**/packages/istanbul-widget/src/components/**/*'],
    },
  ],
  {
    astro: true,
    react: true,
    vue: true,
  },
)
