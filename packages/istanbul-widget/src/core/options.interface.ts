import { type ButtonProps } from '@/components/ui/button'

export interface IstanbulWidgetOptions {
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

export type ReportParams = {
  [key in PluginName]?: any
}

export type ReportOptions = {
  /**
   * 按钮文案
   * @default '上报'
   */
  text?: string
  /**
   * 上报前触发
   */
  beforeReport?: (coverage: any, params: ReportParams, ...args: any[]) => Promise<void> | void
  /**
   * 上报时触发
   */
  onReport: (coverage: any, params: ReportParams, ...args: any[]) => Promise<void> | void
  /**
   * 上报后触发
   */
  afterReport?: (coverage: any, params: ReportParams, ...args: any[]) => Promise<void> | void
}

export type SettingOptions<T = Record<string, any>> = {
  /**
   * 按钮文案
   * @default '设置'
   */
  text?: string
  /**
   * 自动上报
   * @default false
   */
  autoReport?:
    | {
        /**
         * 自动上报间隔
         * @default 60
         */
        interval: number
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
} & T

export type ButtonGroupOptions = ({
  text: string
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, params: ReportParams) => void | Promise<void>
} & ButtonProps)[]

export type Position = {
  x: number
  y: number
}

export type PluginType = {
  id: string
  name: string
  content?: HTMLElement
}

export type PluginName = Exclude<IstanbulWidgetOptions['defaultPlugins'], undefined>[number]
