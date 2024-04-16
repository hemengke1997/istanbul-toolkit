import react from '@vitejs/plugin-react'
import path from 'node:path'
import { visualizer as rollupVisualizer } from 'rollup-plugin-visualizer'
import { minify } from 'terser'
import { type PluginOption, defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

function visualizer() {
  if (process.env.REPORT === 'true') {
    return rollupVisualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: false,
    }) as PluginOption
  }
  return undefined
}

function minifyBundles(): PluginOption {
  return {
    name: 'minifyBundles',
    async generateBundle(_, bundle) {
      for (const key in bundle) {
        if (bundle[key].type === 'chunk' && key.endsWith('.js')) {
          // @ts-expect-error
          const minifyCode = await minify(bundle[key].code, { sourceMap: false })
          // @ts-expect-error
          bundle[key].code = minifyCode.code
        }
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return {
    plugins: [
      react(),
      cssInjectedByJsPlugin(),
      visualizer(),
      dts({
        rollupTypes: true,
        root: __dirname,
        include: ['src/**/*'],
      }),
      minifyBundles(),
    ],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
    },
    define: {
      '__VERSION__': JSON.stringify(pkg.version),
      'process.env.NODE_ENV': JSON.stringify(env.mode),
    },
    build: {
      target: ['es2015'],
      sourcemap: env.mode !== 'production',
      lib: {
        entry: path.resolve(__dirname, 'src/istanbul-widget.ts'),
        name: 'istanbul-widget',
        fileName: (format) =>
          ({
            umd: `${pkg.name}.min.js`,
            es: `${pkg.name}.esm.js`,
          })[format],
        formats: ['umd', 'es'],
      },
      cssCodeSplit: false,
      rollupOptions: {
        treeshake: true,
        input: undefined,
      },
    },
  }
})
