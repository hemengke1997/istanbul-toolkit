import { type IstanbulWidgetOptions } from 'istanbul-widget'
import { type IstanbulPluginOptions } from 'vite-plugin-istanbul'

export type VitePluginIstanbulWidgetOptions = {
  /**
   * 是否开启插件
   * @default false
   */
  enabled?: boolean
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
