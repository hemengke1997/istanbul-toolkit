import { isArray, set } from 'lodash-es'
import glob from 'tiny-glob'
import { normalizePath, type Plugin, type ResolvedConfig } from 'vite'
import istanbul from 'vite-plugin-istanbul'
import { vendor } from './meta'
import { type VitePluginIstanbulWidgetOptions } from './types'
import { checkPluginEnabled, ensureArray, getCommitId, resolveOptions, resolveWidgetScript } from './utils'
import { debug } from './utils/debug'
import { resolvedVirtualModuleId, runtimeId, vmods } from './virtual'

export function istanbulWidget(opts: VitePluginIstanbulWidgetOptions): any {
  const {
    enabled,
    fullReport,
    istanbulPluginConfig,
    istanbulWidgetConfig = {},
    checkProd,
    entry,
  } = resolveOptions(opts)

  if (!checkPluginEnabled(enabled, checkProd)) return

  let entryFile = entry || ''
  let config: ResolvedConfig

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
      configResolved: {
        order: 'pre',
        async handler(_config) {
          config = _config
          if (!entryFile) {
            // Auto detect entry file
            const maybeEntry = ['src/main', 'src/root', 'app/main', 'app/root']
            for (const file of maybeEntry) {
              try {
                const files = await glob(`${file}.{ts,tsx,js,jsx}`, {
                  cwd: config.root,
                  filesOnly: true,
                  absolute: true,
                })
                if (files.length) {
                  entryFile = normalizePath(files[0])
                  break
                }
              } catch {}
            }

            if (!entryFile) {
              console.warn(
                '\n[vite-plugin-istanbul-widget]: Entry file not found, please specify the "entry" in the options',
              )
            }
          }
        },
      },
      resolveId(id) {
        if (vmods.includes(id)) {
          return resolvedVirtualModuleId(id)
        }
        return null
      },
      async load(id) {
        switch (id) {
          case resolvedVirtualModuleId(runtimeId): {
            return {
              code: resolveWidgetScript(istanbulWidgetConfig || {}),
              map: null,
            }
          }
          default:
            break
        }
      },
      transform: {
        order: 'pre',
        handler(code, id) {
          if (!entryFile) return

          let isEntry = false
          if (entryFile instanceof RegExp && entryFile.test(id)) {
            isEntry = true
          } else if (new RegExp(entryFile).test(id)) {
            isEntry = true
          } else if (entryFile === id) {
            isEntry = true
          }

          if (isEntry) {
            return {
              code: `import '${runtimeId}';
              ${code}
            `,
              map: null,
            }
          }
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
