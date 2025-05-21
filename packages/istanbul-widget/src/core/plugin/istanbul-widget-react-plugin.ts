import React from 'react'
import { type PluginType } from '../options.interface'
import { IstanbulWidgetPlugin } from './istanbul-widget-plugin'

export type IstanbulWidgetReactPluginProps = {} & PluginType

export class IstanbulWidgetReactPlugin<
  T extends Record<string, any> = Record<string, any>,
> extends IstanbulWidgetPlugin {
  private _root!: HTMLDivElement
  constructor(
    /**
     * 插件id
     */
    id: string,
    /**
     * 插件名称
     * @description 暂时还没有场景需要用到
     */
    name: string,
    /**
     * react 组件
     */
    public Component: React.FC<IstanbulWidgetReactPluginProps & T>,
    /**
     * 初始props
     */
    public initialProps?: T,
  ) {
    super(id, name)
  }

  onRender() {
    this.on('render', async (callback) => {
      const el = React.createElement(this.Component, {
        ...((this.initialProps || {}) as T),
        id: this.id,
        name: this.name,
        domID: this.domID,
      })

      await callback({ el })
    })
  }
}
