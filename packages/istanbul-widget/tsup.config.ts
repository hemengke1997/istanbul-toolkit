import { match } from 'bundle-require'
import glob from 'fast-glob'
import fs from 'node:fs'
import path from 'node:path'
import stripDirs from 'strip-dirs'
import { type Options, defineConfig } from 'tsup'
import pkg from './package.json'

function rmExt(filePath: string) {
  return filePath.split(path.extname(filePath))[0]
}

export function getEntry(entryGlob = 'src/index.ts{,x}') {
  const entries = glob.sync(entryGlob)
  const entry: Record<string, string> = {}
  entries.forEach((e) => {
    entry[rmExt(stripDirs(e, 1))] = e
  })

  return entry
}

const fileSuffixPlugin = (
  format: 'cjs' | 'esm',
  tsupOptions?: Options,
): Exclude<Options['esbuildPlugins'], undefined>[number] => ({
  name: 'add-file-suffix',
  setup(build) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.kind === 'entry-point') return
      let importeePath = args.path

      if (importeePath.endsWith('.css')) {
        return { external: true }
      }

      const { external, noExternal } = tsupOptions ?? {}
      if (match(importeePath, noExternal)) {
        return
      }
      if (match(importeePath, external)) {
        return { external: true }
      }
      if (match(args.importer, noExternal)) {
        return
      }
      if (match(args.importer, external)) {
        return { external: true }
      }
      if (importeePath[0] !== '.' && !path.isAbsolute(importeePath)) {
        return { external: true }
      }
      const suffix = format === 'cjs' ? '.cjs' : '.js'
      if (!path.extname(importeePath) && !importeePath.endsWith('.js')) {
        const filePath = path.join(args.resolveDir, importeePath)

        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          importeePath += `/index${suffix}`
        } else {
          importeePath += suffix
        }
        return { path: importeePath, external: true }
      }
    })
  },
})

const common = (option: Options): Options => ({
  clean: true,
  outExtension: () => ({ js: '.js' }),
  outDir: 'dist',
  minify: !option.watch,
  target: 'es3',
  define: {
    '__VERSION__': JSON.stringify(pkg.version),
    'process.env.NODE_ENV': JSON.stringify(option.watch ? 'development' : 'production'),
  },
  esbuildOptions(options, ...args) {
    option.esbuildOptions?.(options, ...args)

    // css 兼容处理
    // https://esbuild.github.io/api/#supported
    const cssUnSupported = [
      'color-functions',
      'gradient-double-position',
      'gradient-interpolation',
      'gradient-midpoints',
      'hwb',
      'hex-rgba',
      'inline-style',
      'inset-property',
      'is-pseudo-class',
      'modern-rgb-hsl',
      'nesting',
      'rebecca-purple',
    ]
    options.supported ??= {}
    cssUnSupported.forEach((css) => {
      options.supported![css] = false
    })
  },
})

const esmBundle: Options = {
  format: ['esm'],
  entry: {
    'istanbul-widget.esm': 'src/istanbul-widget.ts',
  },
  dts: {
    entry: {
      'istanbul-widget': 'src/istanbul-widget.ts',
    },
  },
  banner() {
    return {
      js: `import './istanbul-widget.esm.css';`,
    }
  },
}

const iife: Options = {
  injectStyle: true,
  format: ['iife'],
  entry: {
    'istanbul-widget.min': 'src/istanbul-widget.ts',
  },
  esbuildOptions(options) {
    if (!options.logOverride) {
      options.logOverride = {}
    }
    options.logOverride!['empty-import-meta'] = 'silent'
  },
  dts: false,
}

const esmBundleless: Options = {
  entry: ['src/**/*.{ts,tsx,css}'],
  dts: {
    entry: getEntry('src/**/*.{ts,tsx}'),
  },
  format: ['esm'],
  outDir: 'dist/es',
  outExtension: () => ({ js: '.js' }),
  esbuildPlugins: [fileSuffixPlugin('esm')],
  splitting: false,
  external: ['react', 'react-dom'],
}

export default defineConfig((option) => {
  return [
    {
      ...common(option),
      ...esmBundleless,
    },
    {
      ...common(option),
      ...esmBundle,
    },
    {
      ...common(option),
      ...iife,
    },
  ]
})
