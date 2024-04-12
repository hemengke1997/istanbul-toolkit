import { defineConfig } from 'tsup'

export const tsup = defineConfig((option) => ({
  entry: ['src/index.ts'],
  dts: !option.watch,
  target: 'node16',
  format: ['cjs', 'esm'],
  platform: 'node',
  splitting: false,
  treeshake: true,
  clean: !option.watch,
  minify: !option.watch,
  sourcemap: false,
}))
