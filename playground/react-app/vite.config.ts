import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget'

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  plugins: [
    react(),
    istanbulWidget({
      enabled: !(env.mode === 'production'),
      istanbulWidgetConfig: {
        defaultPosition: {
          x: 0,
          y: 100,
        },
        report: {
          async onAction(coverage) {
            window.__report(coverage)
          },
        },
      },
    }),
  ],
  server: {
    host: true,
  },
}))
