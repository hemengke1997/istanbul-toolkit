import { defineConfig, type Options } from 'tsup'
import { bundleless } from 'tsup-plugin-bundleless'
import { cssLegacy } from 'tsup-plugin-css-legacy'
import pkg from './package.json'

const common = (option: Options): Options => ({
  clean: true,
  outExtension: () => ({ js: '.js' }),
  outDir: 'dist',
  minify: false,
  target: 'es3',
  define: {
    __VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [...(option.plugins || []), cssLegacy()],
  treeshake: true,
})

const lib = (option: Options): Options => ({
  format: ['cjs', 'esm'],
  entry: {
    'istanbul-widget.lib': 'src/istanbul-widget.ts',
  },
  dts: option.watch
    ? false
    : {
        entry: {
          'istanbul-widget': 'src/istanbul-widget.ts',
        },
      },
  outExtension: ({ format }) => ({ js: format === 'esm' ? '.js' : '.cjs' }),
  noExternal: Object.keys(pkg.dependencies),
  splitting: false,
  minify: false,
  injectStyle: true,
})

const iife = (_option: Options): Options => ({
  injectStyle: true,
  format: 'iife',
  entry: {
    'istanbul-widget.min': 'src/istanbul-widget.iife.ts',
  },
  esbuildOptions(options) {
    options.logOverride ??= {}
    options.logOverride['empty-import-meta'] = 'silent'
  },
  dts: false,
})

const esm = (option: Options): Options => ({
  entry: ['src/**/*.{ts,tsx,css}'],
  dts: !option.watch,
  format: 'esm',
  outDir: 'dist/esm',
  minify: false,
  ...bundleless(),
})

export default defineConfig((option) => {
  return [
    {
      ...common(option),
      ...lib(option),
    },
    {
      ...common(option),
      ...iife(option),
    },
    {
      ...common(option),
      ...esm(option),
      plugins: [...(common(option).plugins || []), ...(esm(option).plugins || [])],
    },
  ]
})
