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
    onAction: async (coverage) => {
      console.log('上报', coverage)
      // 在这里你可以调用上报接口
    },
  },
})
```

## 配置项

```ts
interface IstanbulWidgetOptions {
  /**
   * 主题色
   */
  theme?: 'light' | 'dark'
  /**
   * 挂载DOM，默认挂载到 body 上
   */
  target?: string | HTMLElement
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
    beforeAction?: () => Promise<void> | void
    /**
     * 上报方法
     */
    onAction: (coverage: any) => Promise<void> | void
    /**
     * 上报后触发
     */
    afterAction?: () => Promise<void> | void
    /**
     * 自动上报
     */
    auto?:
      | {
          /**
           * 自动上报间隔
           */
          interval?: number
          /**
           * 最小间隔时间
           */
          minInterval?: number
        }
      | boolean
    /**
     * 离开页面时是否提交一次上报
     */
    onLeavePage?: boolean
    /**
     * 是否需要填写上报人
     */
    requireReporter?: boolean
  }
}
```
