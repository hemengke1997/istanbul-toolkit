# vite-plugin-istanbul-widget

> 集成了 istanbul-widget 和 vite-plugin-istanbul 的vite插件

## 安装

```bash
npm install vite-plugin-istanbul-widget --save-dev
```

## 使用

```ts
import { defineConfig } from 'vite'
import { istanbulWidget } from 'vite-plugin-istanbul-widget'

// example
export default defineConfig((env) => ({
  plugins: [
    istanbulWidget({
      enabled: env.mode === 'test',
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

## 配置项

```ts
type VitePluginIstanbulWidgetOptions = {
    /**
     * 入口文件，默认读取 src/main.{ts,tsx}
     * @default 'src/main.{ts,tsx}'
     */
    entry?: string;
    /**
     * 是否开启插件
     */
    enabled?: boolean;
    /**
     * vite-plugin-istanbul 配置
     */
    istanbulPluginConfig?: IstanbulPluginOptions;
    /**
     * istanbul-widget 配置
     * @description false 时则关闭 istanbulWidget 控件
     */
    istanbulWidgetConfig: IstanbulWidgetOptions | false;
}
```
