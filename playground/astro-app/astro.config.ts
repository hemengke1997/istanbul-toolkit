import react from '@astrojs/react'
import { defineConfig } from 'astro/config'
import { exclude, istanbulWidget } from 'vite-plugin-istanbul-widget/astro'
import { publicTypescript } from 'vite-plugin-public-typescript'

export default defineConfig({
  integrations: [
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
        debug: true,
      },
      fullReport: true,
    }),
    react({
      exclude,
    }),
  ],
  vite: {
    plugins: [
      publicTypescript({
        babel: true,
      }),
    ],
  },
})
