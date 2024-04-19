import type { Plugin } from 'vite'
import { isArray, isFunction, isObject, set } from '@minko-fe/lodash-pro'
import { type IstanbulWidgetOptions } from 'istanbul-widget'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import glob from 'tiny-glob'
import istanbul, { type IstanbulPluginOptions } from 'vite-plugin-istanbul'

type VitePluginIstanbulWidgetOptions = {
  /**
   * 入口文件
   * @default 'src/main.{ts,tsx}'
   */
  entry?: string
  /**
   * 是否开启插件
   * @default false
   */
  enabled?: boolean
  /**
   * 全量上报
   * @default true
   */
  fullReport?: boolean
  /**
   * vite-plugin-istanbul 配置
   */
  istanbulPluginConfig?: IstanbulPluginOptions
  /**
   * istanbul-widget 配置
   */
  istanbulWidgetConfig: IstanbulWidgetOptions
}

function getCommitId() {
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch {
    return ''
  }
}

export function istanbulWidget(opts: VitePluginIstanbulWidgetOptions): any {
  let {
    entry = 'src/main.{ts,tsx}',
    enabled = false,
    fullReport = true,
    istanbulPluginConfig,
    istanbulWidgetConfig,
  } = opts || {}

  if (!enabled) return undefined

  return [
    {
      name: 'vite:plugin-istanbul-widget:config:pre',
      enforce: 'pre',
      config(c) {
        if (!c.build?.sourcemap) {
          c.build ??= {}
          c.build.sourcemap = 'inline'
        }
        return {
          define: {
            __GIT_COMMIT_ID__: JSON.stringify(getCommitId()),
          },
        }
      },
      async configResolved(c) {
        if (c.root && !path.isAbsolute(entry)) {
          entry = (
            await glob(path.resolve(c.root, entry), {
              absolute: true,
              filesOnly: true,
            })
          )?.[0]
        }
      },
    },
    {
      name: 'vite:plugin-istanbul-widget:config:post',
      enforce: 'post',
      config(c) {
        if (fullReport) {
          const manualChunks = (id: string) => {
            const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/
            const isCSSRequest = (request: string): boolean => CSS_LANGS_RE.test(request)
            if (isCSSRequest(id)) return
            if (id.includes('node_modules')) {
              return 'vendor'
            } else if (id.startsWith(process.cwd())) {
              return 'source'
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
      },
    },
    {
      name: 'vite:plugin-istanbul-widget',
      enforce: 'post',
      transform(source, id) {
        if (entry === id) {
          const require = createRequire(import.meta.url)
          const istanbulWidgetPath = path.join(
            path.dirname(require.resolve('istanbul-widget')),
            'istanbul-widget.esm.js',
          )

          const code = `
            import IstanbulWidget from "${istanbulWidgetPath}";
            new IstanbulWidget(${parseIstanbulWidgetOptions(istanbulWidgetConfig)});

            ${source}`

          return {
            code,
            map: null,
          }
        }
        return {
          code: source,
          map: null,
        }
      },
    },
    istanbul({
      ...istanbulPluginConfig,
      forceBuildInstrument: enabled,
    }),
  ] as Plugin[]
}

export default istanbulWidget

const parseIstanbulWidgetOptions = (config: Record<string, any>) => {
  const parse = (config: Record<string, any> | undefined) => {
    if (!config) return ''

    return Object.keys(config).reduce((code, key) => {
      const value = config[key]

      if (isFunction(value)) {
        if (/^[(f]/.test(value.toString())) {
          code += `${key}: ${value},`
          return code
        } else {
          code += `${value},`
          return code
        }
      }

      if (isObject(value)) {
        code += `${key}: {${parse(value)}},`
        return code
      }

      code += `${key}: ${JSON.stringify(config[key])},`
      return code
    }, '')
  }
  return `{${parse(config)}}`
}
