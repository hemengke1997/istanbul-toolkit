import { execaCommand } from 'execa'
import { type IstanbulWidgetOptions } from 'istanbul-widget'
import { createRequire } from 'node:module'
import path from 'node:path'
import serialize from 'serialize-javascript'
import { normalizePath } from 'vite'
import { type VitePluginIstanbulWidgetOptions } from '../types'
import { debug } from './debug'
import { logger } from './logger'

export async function getCommitId() {
  try {
    const { stdout } = await execaCommand('git rev-parse HEAD', { stdio: 'pipe' })
    const commitid = stdout.trim()
    debug(`Resolved git HEAD: ${commitid}`)
    return commitid
  } catch {
    logger.warnOnce(`[vite-plugin-istanbul-widget]: Failed to resolve git HEAD\n`)
    return ''
  }
}

export function resolveInlineScript(
  mode: 'lib' | 'min',
  config: IstanbulWidgetOptions,
  options?: {
    delayIstanbulWidgetInit?: number
  },
) {
  const require = createRequire(import.meta.url)
  const { delayIstanbulWidgetInit = 0 } = options || {}

  const istanbulWidgetPath = normalizePath(
    `/@fs/${path.join(path.dirname(require.resolve('istanbul-widget')), `istanbul-widget.${mode}.js`)}`,
  )

  debug('istanbul-widget path:', istanbulWidgetPath)

  const map = {
    lib: {
      src: istanbulWidgetPath,
      script: /*js*/ `
        import { IstanbulWidget } from "${istanbulWidgetPath}";
        if(typeof window !== 'undefined' && typeof document !== 'undefined') {
          const timer = setTimeout(() => {
            new IstanbulWidget(${serialize(config)});
            clearTimeout(timer);
          }, ${delayIstanbulWidgetInit});
        }
      `,
    },
    min: {
      src: istanbulWidgetPath,
      script: /*js*/ `
        if(typeof window !== 'undefined' && typeof document !== 'undefined') {
          const timer = setTimeout(() => {
            new window.IstanbulWidget(${serialize(config)});
            clearTimeout(timer);
          }, ${delayIstanbulWidgetInit});
        }
      `,
    },
  }

  return map[mode]
}

export function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return []
  }
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}

export function resolveOptions(opts: VitePluginIstanbulWidgetOptions) {
  const defaultOptions: VitePluginIstanbulWidgetOptions = {
    enabled: false,
    fullReport: true,
    istanbulPluginConfig: {},
    istanbulWidgetConfig: {},
    checkProd: true,
    delayIstanbulWidgetInit: 0,
  }
  return {
    ...defaultOptions,
    ...opts,
  } as Required<VitePluginIstanbulWidgetOptions>
}

export function checkPluginEnabled(enabled: boolean, checkProd: boolean) {
  if (checkProd && process.env.NODE_ENV === 'production') {
    return false
  }

  return enabled
}
