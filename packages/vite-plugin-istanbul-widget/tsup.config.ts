import { defineConfig } from 'tsup'

export const tsup = defineConfig((option) => {
  return [
    {
      entry: {
        index: 'src/index.ts',
        astro: 'src/astro/index.ts',
      },
      dts: true,
      target: 'node16',
      format: ['cjs', 'esm'],
      external: ['vite-plugin-istanbul/*'],
      platform: 'node',
      splitting: false,
      treeshake: true,
      clean: !option.watch,
      minify: !option.watch,
      sourcemap: !!option.watch,
    },
  ]
})
