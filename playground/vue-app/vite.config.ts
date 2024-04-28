import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget'

export default defineConfig(() => ({
  plugins: [
    vue(),
    istanbulWidget({
      enabled: true,
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
