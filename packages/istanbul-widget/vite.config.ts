import react from '@vitejs/plugin-react'
import path from 'node:path'
import { visualizer as rollupVisualizer } from 'rollup-plugin-visualizer'
import { defineConfig, type PluginOption } from 'vite'
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

// https://vitejs.dev/config/
export default defineConfig((env) => {
  return {
    plugins: [react(), visualizer()],
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
    },
    define: {
      __VERSION__: JSON.stringify(pkg.version),
    },
    build: {
      target: ['es2015'],
      sourcemap: env.mode !== 'production',
    },
    optimizeDeps: {
      exclude: ['istanbul-widget'],
    },
    server: {
      host: '0.0.0.0',
    },
  }
})
