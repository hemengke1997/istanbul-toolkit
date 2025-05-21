import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget'

export default defineConfig(() => ({
  plugins: [
    react(),
    istanbulWidget({
      enabled: true,
      istanbulWidgetConfig: {
        theme: 'dark',
        defaultPosition: {
          x: 0,
          y: 100,
        },
        plugin: {
          report: {
            async onReport(coverage: any, ...args: any[]) {
              await window.__report(coverage, ...args)
            },
          },
          setting: {
            autoReport: false,
            onLeavePage: true,
            requireReporter: true,
          },
          buttonGroup: [
            {
              text: '自定义按钮',
              onClick(...args: any[]) {
                window.__customClick(...args)
              },
            },
          ],
        },
      },
      fullReport: true,
      autoInjectWidget: false,
    }),
  ],
  build: {
    minify: false,
  },
  optimizeDeps: {
    force: true,
  },
  server: {
    host: '0.0.0.0',
  },
}))
