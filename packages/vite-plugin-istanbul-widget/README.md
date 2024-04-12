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

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  plugins: [
    istanbulWidget({
      enabled: !(env.mode === 'production'),
      istanbulWidgetConfig: {
        report: {
          async onAction(coverage) {
            window.__report(coverage)
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
     */
    istanbulWidgetConfig: IstanbulWidgetOptions;
}
```
