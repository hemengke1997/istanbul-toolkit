export interface IstanbulWidgetOptions {
  /**
   * 主题色
   */
  theme?: 'light' | 'dark'
  /**
   * 挂载DOM
   */
  target?: string | HTMLElement
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

export type Config = {
  reporter: string
  enable_auto_report: boolean
  report_interval: number
  report_on_pageleave: boolean
}
