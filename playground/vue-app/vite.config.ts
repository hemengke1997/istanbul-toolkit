import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget'

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  plugins: [
    vue(),
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
}))
