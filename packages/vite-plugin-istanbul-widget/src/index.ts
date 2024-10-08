import type { Plugin } from 'vite'
import { isArray, set } from 'lodash-es'
import istanbul from 'vite-plugin-istanbul'
import { vendor } from './meta'
import { type VitePluginIstanbulWidgetOptions } from './types'
import { checkPluginEnabled, ensureArray, getCommitId, resolveInlineScript, resolveOptions } from './utils'
import { debug } from './utils/debug'

declare global {
  // eslint-disable-next-line vars-on-top, no-var
  var __GIT_COMMIT_ID__: string
}

export function istanbulWidget(opts: VitePluginIstanbulWidgetOptions): any {
  const { enabled, fullReport, istanbulPluginConfig, istanbulWidgetConfig, checkProd, delayIstanbulWidgetInit } =
    resolveOptions(opts)

  if (!checkPluginEnabled(enabled, checkProd)) return

  debug('istanbulWidget options:', opts)

  return [
    {
      name: 'vite:plugin-istanbul-widget:pre',
      enforce: 'pre',
      async config(c) {
        if (c.build?.ssr) return

        return {
          define: {
            __GIT_COMMIT_ID__: JSON.stringify(await getCommitId()),
          },
        }
      },
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          if (istanbulWidgetConfig !== false) {
            const { src, script } = resolveInlineScript('min', istanbulWidgetConfig, { delayIstanbulWidgetInit })
            return {
              html,
              tags: [
                {
                  tag: 'script',
                  attrs: {
                    type: 'module',
                    defer: true,
                    src,
                  },
                  injectTo: 'body',
                },
                {
                  tag: 'script',
                  attrs: {
                    type: 'module',
                  },
                  injectTo: 'body',
                  children: script,
                },
              ],
            }
          }
          return html
        },
      },
    },
    istanbul({
      extension: ['.js', '.cjs', '.mjs', '.ts', '.tsx', '.jsx', '.vue', '.astro', '.svelte'],
      ...istanbulPluginConfig,
      exclude: [...ensureArray(istanbulPluginConfig?.exclude), '**/index.html?html-proxy*.js', '**/node_modules/**'],
      forceBuildInstrument: enabled,
    }),
    {
      name: 'vite:plugin-istanbul-widget:post',
      enforce: 'post',
      config: {
        order: 'post',
        handler(c) {
          c.build ??= {}

          if (!c.build.ssr) {
            if (fullReport) {
              const manualChunks = (id: string) => {
                const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/
                const isCSSRequest = (request: string): boolean => CSS_LANGS_RE.test(request)
                if (isCSSRequest(id)) return

                if (id.includes('node_modules')) {
                  return vendor
                } else if (id.startsWith(process.cwd())) {
                  return 'src'
                }
              }

              c.build.rollupOptions ??= {}
              const output = c.build?.rollupOptions.output

              if (output) {
                if (isArray(output)) {
                  output.forEach((_, index) => {
                    set(c, `build.rollupOptions.output[${index}].manualChunks`, manualChunks)
                  })
                } else {
                  set(c, 'build.rollupOptions.output.manualChunks', manualChunks)
                }
              } else {
                set(c, 'build.rollupOptions.output.manualChunks', manualChunks)
              }
            }
          }
        },
      },
    },
  ] as Plugin[]
}

export default istanbulWidget
