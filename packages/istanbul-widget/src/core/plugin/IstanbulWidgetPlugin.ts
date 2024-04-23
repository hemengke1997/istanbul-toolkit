import type ReactDOM from 'react-dom/client'
import { uniqueId } from '@minko-fe/lodash-pro'
import { Emitter } from 'strict-event-emitter'
import { type IstanbulWidget } from '../core'

type Events = {
  init: []
  ready: []
  render: [callback?: (res: { root: ReactDOM.Root; domNode: HTMLDivElement }) => void]
}

export class IstanbulWidgetPlugin {
  public isReady: boolean = false
  protected _id!: string
  protected _name!: string
  protected _istanbulWidget!: IstanbulWidget

  event: Emitter<Events> = new Emitter()

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
    this.isReady = false
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
    this._id = value.toLowerCase()
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

  protected getUniqueID(prefix: string = '') {
    return uniqueId(prefix)
  }
}
