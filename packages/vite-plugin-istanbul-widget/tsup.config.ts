import { defineConfig } from 'tsup'

export const tsup = defineConfig((option) => {
  return [
    {
      entry: {
        'index': 'src/index.ts',
        'astro': 'src/astro/index.ts',
        'remix': 'src/remix/index.ts',
        'remix/client': 'src/remix/client.tsx',
      },
      dts: true,
      target: 'node16',
      format: ['cjs', 'esm'],
      external: ['vite-plugin-istanbul/*'],
      noExternal: ['vite-plugin-istanbul'],
      platform: 'node',
      splitting: false,
      treeshake: true,
      clean: !option.watch,
      minify: false,
      sourcemap: !!option.watch,
    },
  ]
})
