import { defineConfig, loadEnv } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget'
import { publicTypescript } from 'vite-plugin-public-typescript'

export default defineConfig(() => {
  const nextEnv = loadEnv(process.env.NODE_ENV || 'development', '', 'NEXT_')

  const env = Object.keys(nextEnv).reduce((acc, key) => {
    acc[`process.env.${key}`] = JSON.stringify(nextEnv[key])
    return acc
  }, {})

  return {
    build: {
      write: false,
    },
    define: {
      ...env,
    },
    logLevel: 'silent' as const,
    css: {
      postcss: {},
    },
    plugins: [
      publicTypescript({
        outputDir: '/assets/js',
        destination: 'file',
        cacheDir: 'public-typescript',
        babel: false,
      }),
      istanbulWidget({
        enabled: true,
        istanbulWidgetConfig: false,
      }),
    ],
  }
})
