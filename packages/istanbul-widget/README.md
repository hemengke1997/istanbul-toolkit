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
   * 插件就绪时回调
   */
  onReady?: () => void
  /**
   * 上报相关配置
   */
  report: {
    /**
     * 上报前触发
     */
    beforeAction?: (coverage: any, config: Config) => Promise<void> | void
    /**
     * 上报方法
     */
    onAction: (coverage: any, config: Config) => Promise<void> | void
    /**
     * 上报后触发
     */
    afterAction?: (coverage: any, config: Config) => Promise<void> | void
    /**
     * 自动上报
     * @default false
     */
    auto?:
      | {
          /**
           * 自动上报间隔
           * @default 60
           */
          interval?: number
          /**
           * 最小间隔时间
           * @default 60
           */
          minInterval?: number
        }
      | boolean
    /**
     * 离开页面时是否提交一次上报
     * @default false
     */
    onLeavePage?: boolean
    /**
     * 是否需要填写上报人
     * @default false
     */
    requireReporter?: boolean
  }
}

```
