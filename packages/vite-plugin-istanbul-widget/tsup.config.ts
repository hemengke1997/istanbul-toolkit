import { defineConfig } from 'tsup'

export const tsup = defineConfig((option) => [
  {
    entry: {
      index: 'src/index.ts',
      astro: 'src/astro/index.ts',
    },
    dts: true,
    target: 'node16',
    format: ['cjs', 'esm'],
    platform: 'node',
    splitting: false,
    treeshake: true,
    clean: !option.watch,
    minify: !option.watch,
    sourcemap: !!option.watch,
  },
])
