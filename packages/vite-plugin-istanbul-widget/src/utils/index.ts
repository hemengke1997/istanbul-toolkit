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

export function resolveWidgetScript(config: IstanbulWidgetOptions) {
  const require = createRequire(import.meta.url)

  const istanbulWidgetPath = normalizePath(
    `/@fs/${path.join(path.dirname(require.resolve('istanbul-widget')), `istanbul-widget.lib.js`)}`,
  )

  debug('istanbul-widget path:', istanbulWidgetPath)

  return /*js*/ `import { IstanbulWidget } from "${istanbulWidgetPath}";
  if (typeof window !== 'undefined') {
    setTimeout(() => {
      new IstanbulWidget(${serialize(config)});
    }, 200);
  }
`
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
