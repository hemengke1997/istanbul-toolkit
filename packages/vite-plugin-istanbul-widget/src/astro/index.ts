import type { AstroIntegration } from 'astro'
import { istanbulWidget as viteIstanbulWidget } from '../index'
import { type VitePluginIstanbulWidgetOptions } from '../types'
import { resolveInlineScript } from '../utils'

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
                  exclude: [...(opts.istanbulPluginConfig?.exclude ?? []), '**/astro:scripts/*.js'],
                },
              }),
              {
                name: 'vite:plugin-istanbul-widget:astro',
                enforce: 'pre',
                transform(code, id) {
                  if (opts.istanbulWidgetConfig !== false) {
                    if (id === 'astro:scripts/page.js') {
                      const { script } = resolveInlineScript('esm', opts.istanbulWidgetConfig)

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
            ],
          },
        })
        if (opts.istanbulWidgetConfig !== false) {
          injectScript(
            'page',
            /*js*/ `
            // hack to inject istanbul-widget
          `,
          )
        }
      },
    },
  } as AstroIntegration
}

export const exclude = [/istanbul-widget.esm/]