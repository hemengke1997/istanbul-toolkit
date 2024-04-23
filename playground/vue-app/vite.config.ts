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
        plugin: {
          report: {
            async onReport(coverage: any) {
              await window.__report(coverage)
            },
          },
          setting: {
            autoReport: false,
            onLeavePage: true,
            requireReporter: true,
            text: '!设置文案!',
          },
        },
      },
    }),
  ],
}))
