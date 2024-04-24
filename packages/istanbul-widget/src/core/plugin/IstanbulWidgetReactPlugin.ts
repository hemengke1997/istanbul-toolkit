import { isFunction } from '@minko-fe/lodash-pro'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { $ } from '@/utils/query'
import { IstanbulWidgetPlugin } from './IstanbulWidgetPlugin'

export type IstanbulWidgetReactPluginProps = {
  id: string
  name: string
}

export class IstanbulWidgetReactPlugin<T extends {} = {}> extends IstanbulWidgetPlugin {
  private _root!: ReactDOM.Root

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

    this.registerEvents()
  }

  public registerEvents() {
    const properties = Object.getOwnPropertyNames(IstanbulWidgetReactPlugin.prototype)

    const onMethods = properties.filter((name) => name.startsWith('on') && isFunction(this[name]))

    onMethods.forEach((methodName) => {
      this[methodName].call(this)
    })
  }

  protected onReady() {
    this.event.on('ready', () => {
      this.isReady = true
    })
  }

  protected onRender() {
    this.event.on('render', (callback) => {
      const domNode = document.createElement('div')
      const root = ReactDOM.createRoot(domNode)
      root.render(
        React.createElement(this.Component, {
          ...((this.initialProps || {}) as T),
          id: this.id,
          name: this.name,
        }),
      )
      this._root = root
      const target = $.ensureEl(`#${this.id}`)
      target.appendChild(domNode)

      callback?.({
        root,
        domNode,
      })
    })
  }

  destory() {
    if (!this._root) {
      console.warn('[istanbul-widget]: init component first')
    } else {
      this._root.unmount()
    }
  }
}
