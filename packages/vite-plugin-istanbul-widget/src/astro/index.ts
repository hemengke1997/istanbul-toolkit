import type { AstroIntegration } from 'astro'
import { ISTANBUL_WIDGET, VENDOR, istanbulWidget as viteIstanbulWidget } from '../index'
import { type VitePluginIstanbulWidgetOptions } from '../types'
import { ensureArray, resolveInlineScript } from '../utils'

export function istanbulWidget(opts: VitePluginIstanbulWidgetOptions): any {
  return {
    name: 'vite-plugin-istanbul-widget-integration',
    hooks: {
      'astro:config:setup': ({ injectScript, updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              viteIstanbulWidget({
                ...opts,
                istanbulPluginConfig: {
                  ...opts.istanbulPluginConfig,
                  exclude: [
                    ...ensureArray(opts.istanbulPluginConfig?.exclude),
                    '**/astro:scripts/*.js',
                    '**/node_modules/**',
                  ],
                },
              }),
              {
                name: 'vite:plugin-istanbul-widget:astro:pre',
                enforce: 'pre',
                transform(code, id) {
                  if (opts.istanbulWidgetConfig !== false) {
                    if (id === 'astro:scripts/page.js') {
                      const { script } = resolveInlineScript('lib', opts.istanbulWidgetConfig)

                      code = /*js*/ `${script}
                      \n${code}`

                      return {
                        code,
                        map: { mappings: '' },
                      }
                    }
                  }
                },
              },
              {
                name: 'vite:plugin-istanbul-widget:astro:post',
                enforce: 'post',
                generateBundle: {
                  order: 'post',
                  handler(opts, bundle) {
                    for (const file in bundle) {
                      const chunk = bundle[file]
                      if (chunk.type === 'chunk') {
                        if ([VENDOR, ISTANBUL_WIDGET].includes(chunk.name)) {
                          const { format } = opts
                          const emptyCss = `\\/\\*\\s*empty\\s*css\\s*\\*\\/`
                          const emptyChunkRE = new RegExp(
                            format === 'es'
                              ? `${emptyCss}\\bimport\\s*["'][^"']*(?:.*)["'];`
                              : `${emptyCss}(\\b|,\\s*)require\\(\\s*["'][^"']*(?:.*)["']\\)(;|,)`,
                            'g',
                          )

                          chunk.code = chunk.code.replace(emptyChunkRE, '')
                        }
                      }
                    }
                  },
                },
              },
            ],
          },
        })
        if (opts.istanbulWidgetConfig !== false) {
          injectScript(
            'page',
            // hack to inject istanbul-widget
            '',
          )
        }
      },
    },
  } as AstroIntegration
}

export const exclude = [/istanbul-widget\..*\.js/]
