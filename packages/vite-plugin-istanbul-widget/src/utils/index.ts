import { type IstanbulWidgetOptions } from 'istanbul-widget'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import serialize from 'serialize-javascript'
import { normalizePath } from 'vite'
import { debug } from './debug'

export function getCommitId() {
  try {
    const commitid = execSync('git rev-parse HEAD').toString().trim()
    debug(`Resolved git HEAD: ${commitid}`)
    return commitid
  } catch (e) {
    console.error(`Failed to resolve git HEAD:\n${e}`)
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
        const timer = setTimeout(() => {
          new IstanbulWidget(${serialize(config)});
          clearTimeout(timer);
        }, ${delayIstanbulWidgetInit});
      `,
    },
    min: {
      src: istanbulWidgetPath,
      script: /*js*/ `
        const timer = setTimeout(() => {
          new window.IstanbulWidget(${serialize(config)});
          clearTimeout(timer);
        }, ${delayIstanbulWidgetInit});
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
