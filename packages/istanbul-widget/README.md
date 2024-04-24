# istanbul-widget

> 收集 istanbul 代码覆盖率的web小组件

如果你使用vite作为开发框架，推荐使用 `vite-plugin-istanbul-widget`

## 上手

### 方法一：使用 npm

```bash
npm install istanbul-widget
```

```ts
import { IstanbulWidget } from 'istanbul-widget'

const istanbulWidget = new IstanbulWidget({
  defaultPosition: {
    x: 0,
    y: 100,
  },
  plugin: {
    // 上报按钮
    report: {
      onReport(coverage) {
        console.log('上报', coverage)
        // throw new Error('上报失败') // 你可以控制失败的逻辑
      },
    },
    // 设置插件
    setting: {
      requireReporter: true,
    },
    buttonGroup: [
      {
        text: '自定义按钮',
        onClick(...args) {
          console.log(...args)
        },
      },
    ],
  },
})
```

### 方法二：使用CDN直接插入到HTML

```html
<script src="https://unpkg.com/istanbul-widget@latest/dist/istanbul-widget.min.js"></script>
<script>
  // 默认会挂载到 `window.IstanbulWidget` 上
  var istanbulWidget = new window.IstanbulWidget();
</script>
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
   * @description false 则关闭悬浮
   */
  float?: {
    offsetX?: number
  } | false
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


## 截图

### 入口按钮
![入口](./screenshots/entry.png)

### 深色主题
![深色主题](./screenshots/dark.png)

### 浅色主题
![浅色主题](./screenshots/light.png)
