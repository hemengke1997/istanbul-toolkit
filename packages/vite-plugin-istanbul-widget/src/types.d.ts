/// <reference types="istanbul-widget/types" />

import { type IstanbulWidgetOptions } from 'istanbul-widget'
import { type IstanbulPluginOptions } from 'vite-plugin-istanbul'

export type VitePluginIstanbulWidgetOptions = {
  /**
   * 是否开启插件
   * @default false
   */
  enabled?: boolean
  /**
   * 入口文件
   * 对于 csr 项目，入口通常是 src/main 或 app/main
   * 对于 remix/rr7 项目，入口通常是 app/root
   *
   * 默认情况自动探测 ['src/main', 'src/root', 'app/main', 'app/root']
   */
  entry?: string | RegExp
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
}

declare global {
  var __GIT_COMMIT_ID__: string
}
