import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget/remix'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  optimizeDeps: {
    force: true,
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    istanbulWidget({
      enabled: true,
      checkProd: false,
      istanbulWidgetConfig: {
        defaultPosition: {
          x: 0,
          y: 100,
        },
        plugin: {
          report: {
            async onReport(coverage, ...args) {
              console.log(coverage, ...args)
            },
          },
          setting: {
            autoReport: false,
            onLeavePage: true,
            requireReporter: false,
          },
        },
      },
      fullReport: true,
    }),
  ],
})
