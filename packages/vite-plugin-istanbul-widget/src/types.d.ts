import { type IstanbulWidgetOptions } from 'istanbul-widget'
import { type IstanbulPluginOptions } from 'vite-plugin-istanbul'

export type VitePluginIstanbulWidgetOptions = {
  /**
   * 是否开启插件
   * @default false
   */
  enabled?: boolean
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
  istanbulWidgetConfig?: IstanbulWidgetOptions | false
  /**
   * 延迟istanbul-widget初始化(ms)
   * @default 0
   */
  delayIstanbulWidgetInit?: number
}
