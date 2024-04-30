import { type IstanbulWidgetOptions } from 'istanbul-widget'
import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import serialize from './serialize'

export function getCommitId() {
  try {
    return execSync('git rev-parse HEAD').toString().trim()
  } catch {
    return ''
  }
}

export function resolveInlineScript(mode: 'lib' | 'min', config: IstanbulWidgetOptions) {
  const require = createRequire(import.meta.url)

  const istanbulWidgetPath = path.join(path.dirname(require.resolve('istanbul-widget')), `istanbul-widget.${mode}.js`)

  const map = {
    lib: {
      src: istanbulWidgetPath,
      script: /*js*/ `import { IstanbulWidget } from "${istanbulWidgetPath}";
      new IstanbulWidget(${serialize(config)})`,
    },
    min: {
      src: istanbulWidgetPath,
      script: /*js*/ `new window.IstanbulWidget(${serialize(config)});`,
    },
  }

  return map[mode]
}
