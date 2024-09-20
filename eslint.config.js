import { defineConfig } from '@minko-fe/eslint-config'
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
