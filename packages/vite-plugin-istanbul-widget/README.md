# vite-plugin-istanbul-widget

> 集成了 istanbul-widget 和 vite-plugin-istanbul 的vite插件
>
> 额外支持astro/remix

## 安装

```bash
npm install vite-plugin-istanbul-widget --save-dev
```

## 上手

### vite.config

[参考配置](../../playground/react-app/vite.config.ts)

```ts
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget'

// example
export default defineConfig((env) => ({
  plugins: [
    istanbulWidget({
      enabled: env.mode === 'test', // 按需启用
      istanbulWidgetConfig: {
        plugin: {
          report: {
            async onReport(coverage: any) {
              await window.__report(coverage)
            },
          },
          setting: {
            autoReport: false,
            onLeavePage: true,
            requireReporter: true,
          },
        },
      },
    }),
  ],
}))
```

## Astro项目

### astro.config

[参考配置](../../playground/astro-app/astro.config.ts)

```ts
import react from '@astrojs/react'
import { defineConfig } from 'astro/config'
import { exclude, istanbulWidget } from 'vite-plugin-istanbul-widget/astro'
import { publicTypescript } from 'vite-plugin-public-typescript'

export default defineConfig({
  integrations: [
    istanbulWidget({
      enabled: true,
      istanbulWidgetConfig: {
        theme: 'dark',
        defaultPosition: {
          x: 0,
          y: 100,
        },
        plugin: {
          report: {
            async onReport(coverage: any, ...args: any[]) {
              await window.__report(coverage, ...args)
            },
          },
          setting: {
            autoReport: false,
            onLeavePage: true,
            requireReporter: true,
          },
          buttonGroup: [
            {
              text: '自定义按钮',
              onClick(...args: any[]) {
                window.__customClick(...args)
              },
            },
          ],
        },
        debug: true,
      },
      fullReport: true,
    }),
    react({
      exclude,
    }),
  ],
  vite: {
    plugins: [
      publicTypescript(),
    ],
  },
})
```

## Remix项目

### vite.config
[参考配置](../../playground/remix-app/vite.config.ts)

```ts
import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget'

export default defineConfig({
  plugins: [
    remix(),
    istanbulWidget({
      enabled: true,
      checkProd: false,
      istanbulWidgetConfig: {
        defaultPosition: {
          x: 0,
          y: 100,
        },
        plugin: {
          report: {
            async onReport(coverage, ...args) {
              console.log(coverage, ...args)
            },
          },
          setting: {
            autoReport: false,
            onLeavePage: true,
            requireReporter: false,
          },
        },
      },
      fullReport: true,
    }),
  ],
})
```

## 配置项

```ts
type VitePluginIstanbulWidgetOptions = {
  /**
   * 是否开启插件
   * @default false
   */
  enabled?: boolean
  /**
   * 入口文件
   * 对于 csr 项目，入口通常是 src/main 或 app/main
   * 对于 remix/rr7 项目，入口通常是 app/root
   *
   * 默认情况自动探测 ['src/main', 'src/root', 'app/main', 'app/root']
   */
  entry?: string
  /**
   * 是否检查正式环境
   * 若为true，则正式环境下禁用插件
   * @default true
   */
  checkProd?: boolean
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
   * @description false 则关闭 istanbul-widget 控件
   */
  istanbulWidgetConfig: IstanbulWidgetOptions | false
}
```
