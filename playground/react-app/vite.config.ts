import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget'

export default defineConfig((env) => ({
  plugins: [
    react(),
    istanbulWidget({
      enabled: !(env.mode === 'production'),
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
            text: '!设置文案!',
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
    }),
  ],
  build: {
    minify: false,
  },
  server: {
    host: true,
  },
}))
