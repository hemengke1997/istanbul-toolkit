import React from 'react'
import { $ } from '@/utils/query'
import { IstanbulWidget } from '../core'
import { reactdomRender, reactdomUnmount } from '../dom/react-render'
import { type PluginType } from '../options.interface'
import { IstanbulWidgetPlugin } from './istanbul-widget-plugin'

export type IstanbulWidgetReactPluginProps = {} & PluginType

export class IstanbulWidgetReactPlugin<T extends {} = {}> extends IstanbulWidgetPlugin {
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
    this.on('render', () => {
      const el = document.createElement('div')

      this._root = el

      reactdomRender(
        React.createElement(this.Component, {
          ...((this.initialProps || {}) as T),
          id: this.id,
          name: this.name,
          domID: this.domID,
        }),
        {
          container: el,
        },
      )

      const target = $.queryEl(`#${this.domID}`)
      target.appendChild(el)

      // react式插入dom，不需要回调
    })
  }

  destory() {
    if (!this._root) {
      IstanbulWidget.logger.warn('[istanbul-widget]: init component first')
    } else {
      reactdomUnmount(this._root)
    }
  }
}
