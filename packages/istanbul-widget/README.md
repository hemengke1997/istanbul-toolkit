# istanbul-widget

> 收集 istanbul 代码覆盖率的web小组件

如果你使用vite作为开发框架，推荐使用 `vite-plugin-istanbul-widget`

## 安装

```bash
npm install istanbul-widget
```

## 使用

```ts
import { IstanbulWidget } from 'istanbul-widget'

const istanbulWidget = new IstanbulWidget({
  report: {
    onAction: async (coverage, config) => {
      console.log('上报', coverage, config)
      // 在这里你可以调用上报接口
      // 如果接口报错，请在此抛出错误: throw new Error("你的错误信息")
    },
  },
})
```

## 配置项

```ts
interface IstanbulWidgetOptions {
  /**
   * 主题色
   * @default 'dark'
   */
  theme?: 'light' | 'dark'
  /**
   * 挂载DOM
   * @default document.body
   */
  target?: string | HTMLElement
  /**
   * 按钮悬浮
   */
  float?: {
    offsetX?: number
  }
  /**
   * 按钮默认位置
   * @default
   * ```js
   * { x: 0, y: 0 }
   * ```
   */
  defaultPosition?: {
    x?: number
    y?: number
  }

  /**
   * 控件就绪时回调
   */
  onReady?: () => void

  /**
   * 默认开启的插件
   */
  defaultPlugins?: ('setting' | 'buttonGroup')[]

  /**
   * 插件设置
   */
  plugin?: {
    /**
     * 上报插件（核心）
     */
    report: ReportOptions
    /**
     * 设置插件
     */
    setting?: SettingOptions
    /**
     * button组插件
     * @description 内置暴露了一组按钮插件，方便扩展
     */
    buttonGroup?: ButtonGroupOptions
  }
  /**
   * 插件顺序
   */
  pluginOrder?: (PluginName | string)[]
}
```
