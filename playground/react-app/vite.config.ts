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
