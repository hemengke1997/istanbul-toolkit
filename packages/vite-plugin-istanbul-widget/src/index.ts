import type { Plugin } from 'vite'
import { isArray, set } from '@minko-fe/lodash-pro'
import istanbul from 'vite-plugin-istanbul'
import { type VitePluginIstanbulWidgetOptions } from './types'
import { ensureArray, getCommitId, resolveInlineScript } from './utils'

export const VENDOR = 'vendor'
export const ISTANBUL_WIDGET = 'istanbul-widget'

export function istanbulWidget(opts: VitePluginIstanbulWidgetOptions): any {
  const {
    enabled = false,
    fullReport = true,
    istanbulPluginConfig,
    istanbulWidgetConfig,
    checkProd = true,
  } = opts || {}

  if (checkProd && process.env.NODE_ENV === 'production') return undefined

  if (!enabled) return undefined

  return [
    {
      name: 'vite:plugin-istanbul-widget:pre',
      enforce: 'pre',
      config(c) {
        if (!c.build?.sourcemap) {
          c.build ??= {}
          c.build.sourcemap = 'hidden'
        }
        return {
          define: {
            __GIT_COMMIT_ID__: JSON.stringify(getCommitId()),
          },
        }
      },
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          if (istanbulWidgetConfig !== false) {
            const { src, script } = resolveInlineScript('min', istanbulWidgetConfig)

            return {
              html,
              tags: [
                {
                  tag: 'script',
                  attrs: {
                    type: 'module',
                    src,
                    defer: true,
                  },
                  injectTo: 'body',
                },
                {
                  tag: 'script',
                  attrs: {
                    type: 'module',
                    defer: true,
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
          c.build.sourcemap = false

          if (!c.build.ssr) {
            if (fullReport) {
              const manualChunks = (id: string) => {
                const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/
                const isCSSRequest = (request: string): boolean => CSS_LANGS_RE.test(request)
                if (isCSSRequest(id)) return

                if (id.match(/istanbul-widget.*\.js$/)) {
                  return ISTANBUL_WIDGET
                }
                if (id.includes('node_modules')) {
                  return VENDOR
                }
                if (id.startsWith(process.cwd())) {
                  return 'src'
                }
              }

              const output = c.build?.rollupOptions?.output
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
