import { isFunction, uniqueId } from '@minko-fe/lodash-pro'
import EventEmitter from 'eventemitter3'
import { ISTANBUL_WIDGET_ID } from '@/utils/const'
import { type IstanbulWidget } from '../core'

type Events = {
  init: []
  ready: []
  render: [callback: (res: { htmlElement: HTMLElement | undefined }) => void | Promise<void>]
}

export class IstanbulWidgetPlugin {
  public isReady: boolean = false
  protected _id!: string
  protected _name!: string
  protected _istanbulWidget!: IstanbulWidget

  public domID: string

  private _event: EventEmitter<Events> = new EventEmitter()

  constructor(
    id: string,
    name: string,
    protected htmlElement?: HTMLElement,
  ) {
    this.id = id
    this.domID = `${ISTANBUL_WIDGET_ID}__plugin--${id}`
    this.name = name
    this.isReady = false

    this.registerEvents()
  }

  get id() {
    return this._id
  }

  set id(value: string) {
    if (typeof value !== 'string') {
      throw '[istanbul-widget] Plugin ID must be a string.'
    } else if (!value) {
      throw '[istanbul-widget] Plugin ID cannot be empty.'
    }
    this._id = value
  }

  get name() {
    return this._name
  }
  set name(value: string) {
    if (typeof value !== 'string') {
      throw '[istanbul-widget] Plugin name must be a string.'
    } else if (!value) {
      throw '[istanbul-widget] Plugin name cannot be empty.'
    }
    this._name = value
  }

  get istanbulWidget() {
    return this._istanbulWidget || undefined
  }
  set istanbulWidget(value: IstanbulWidget) {
    if (!value) {
      throw '[istanbul-widget] istanbulWidget cannot be empty'
    }
    this._istanbulWidget = value
  }

  /**
   * Add a listener for a given event
   */
  public on = this._event.on.bind(this._event)
  /**
   * Remove an event listener
   */
  public off = this._event.off.bind(this._event)
  /**
   * Calls each of the listeners registered for a given event
   */
  public emit = this._event.emit.bind(this._event)

  protected registerEvents() {
    const properties = Object.getOwnPropertyNames(IstanbulWidgetPlugin.prototype)

    const onMethods = properties.filter((name) => name.match(/^on[A-Z].*/) && isFunction(this[name]))
    onMethods.forEach((methodName) => {
      this[methodName].call(this)
    })
  }

  public onReady() {
    this.on('ready', () => {
      this.isReady = true
    })
  }

  public onRender() {
    this.on('render', async (callback) => {
      await callback({ htmlElement: this.htmlElement })
    })
  }

  protected getUniqueID(prefix: string = '') {
    return uniqueId(prefix)
  }
}
