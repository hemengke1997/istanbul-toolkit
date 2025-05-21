import type { AstroIntegration } from 'astro'
import { istanbulWidget as viteIstanbulWidget } from '../index'
import { vendor } from '../meta'
import { type VitePluginIstanbulWidgetOptions } from '../types'
import { checkPluginEnabled, ensureArray, resolveOptions, resolveWidgetScript } from '../utils'
import { debug } from '../utils/debug'

export function istanbulWidget(opts: VitePluginIstanbulWidgetOptions): any {
  const { enabled, istanbulPluginConfig, istanbulWidgetConfig, checkProd, autoInjectWidget } = resolveOptions(opts)

  if (!checkPluginEnabled(enabled, checkProd)) return

  debug('astro istanbulWidget options:', opts)

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
                  ...istanbulPluginConfig,
                  exclude: [
                    ...ensureArray(istanbulPluginConfig?.exclude),
                    '**/astro:scripts/*.js',
                    '**/node_modules/**',
                  ],
                },
              }),
              {
                name: 'vite:plugin-istanbul-widget:astro:pre',
                enforce: 'pre',
                transform(code, id) {
                  if (istanbulWidgetConfig !== false) {
                    if (id === 'astro:scripts/page.js') {
                      debug('istanbulWidget transform:', id)

                      const widget = resolveWidgetScript(istanbulWidgetConfig, autoInjectWidget)

                      code = /*js*/ `${widget}
                      \n${code}`

                      return {
                        code,
                        map: null,
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
                  handler(options, bundle) {
                    for (const file in bundle) {
                      const chunk = bundle[file]
                      if (chunk.type === 'chunk') {
                        if ([vendor].includes(chunk.name)) {
                          const { format } = options
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
        if (istanbulWidgetConfig !== false) {
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

export const exclude = [/istanbul-widget.*\.js/]
