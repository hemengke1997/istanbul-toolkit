import type { Plugin } from 'vite'
import MagicString from 'magic-string'
import serialize from 'serialize-javascript'
import ts from 'typescript'
import { istanbulWidget as viteIstanbulWidget } from '..'
import { type VitePluginIstanbulWidgetOptions } from '../types'
import { checkPluginEnabled, resolveOptions } from '../utils'
import { debug } from '../utils/debug'

export function istanbulWidget(opts: VitePluginIstanbulWidgetOptions): any {
  const { enabled, checkProd, istanbulWidgetConfig } = resolveOptions(opts)

  if (!checkPluginEnabled(enabled, checkProd)) return

  debug('remix istanbulWidget options:', opts)

  return [
    {
      name: 'vite:plugin-istanbul-widget:remix',
      enforce: 'pre',
      transform: {
        order: 'pre',
        async handler(code, id) {
          if (id.endsWith('/root.tsx')) {
            const app = 'AppExport'

            const s = new MagicString(code)
            const sourceFile = ts.createSourceFile('source.tsx', code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

            function visit(node: ts.Node) {
              if (
                ts.isFunctionDeclaration(node) &&
                node.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword)
              ) {
                s.remove(node.modifiers.pos, node.modifiers.end)
                if (node.name) {
                  s.overwrite(node.name.pos + 1, node.name.end, app)
                } else {
                  s.prependLeft(node.pos, `\nconst ${app} =`)
                }
              } else if (ts.isExportAssignment(node)) {
                s.overwrite(node.pos, node.expression.pos, `\nconst ${app} =`)
              }
              ts.forEachChild(node, visit)
            }

            visit(sourceFile)

            const imports = [/*js*/ `import { withIstanbulWidget } from "vite-plugin-istanbul-widget/remix/client";`]
            const defaultExport = /*js*/ `export default withIstanbulWidget(${app}, ${serialize(istanbulWidgetConfig)})();`

            return {
              code: `${imports.join('\n')}\n${s.toString()}\n${defaultExport}`,
              map: null,
            }
          }
        },
      },
    },
    ...viteIstanbulWidget(opts),
  ] as Plugin[]
}
