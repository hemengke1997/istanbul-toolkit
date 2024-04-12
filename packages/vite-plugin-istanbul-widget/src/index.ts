import type { Plugin } from 'vite'
import { isFunction, isObject } from '@minko-fe/lodash-pro'
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
   */
  enabled?: boolean
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
  let { enabled = false, entry = 'src/main.{ts,tsx}', istanbulPluginConfig, istanbulWidgetConfig } = opts || {}

  if (!enabled) return undefined

  return [
    {
      name: 'vite:plugin-istanbul-widget:config',
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
