import { deepMerge, isBoolean, isFunction, isObject } from '@minko-fe/lodash-pro'
import { $ } from '@/utils/query'
import { ISTANBUL_WIDGET_ID, getStorage, setStorage } from '@/utils/tool'
import { type CompInstance, render } from './IstanbulWidget'
import { type Config, type IstanbulWidgetOptions } from './options.interface.js'
import '@/styles/global.css'

const default_interval = 60
const default_min_interval = 10

export class IstanbulWidget {
  public version: string = __VERSION__
  public isInited: boolean = false
  public option: Required<IstanbulWidgetOptions> = {
    theme: 'dark',
    target: document.body,
    onReady: () => {},
    report: {
      auto: {
        interval: default_interval,
        minInterval: default_min_interval,
      },
      onAction: () => {},
      afterAction: () => {},
      beforeAction: () => {},
      onLeavePage: true,
      requireReporter: false,
    },
  } as Required<IstanbulWidgetOptions>

  protected compInstance: CompInstance = {} as CompInstance

  constructor(opts: IstanbulWidgetOptions) {
    if (!!IstanbulWidget.instance && IstanbulWidget.instance instanceof IstanbulWidget) {
      console.debug('[istanbul-widget] IstanbulWidget is already exists.')
      return IstanbulWidget.instance
    }

    IstanbulWidget.instance = this

    this.isInited = false

    if (isObject(opts)) {
      this.option = deepMerge(this.option, opts, {
        arrayMerge: (_, source) => source,
      })
    }

    // try to init
    const _onload = () => {
      if (this.isInited) {
        return
      }
      this._initComponent()
      this._autoRun()
    }

    if (document !== undefined) {
      if (document.readyState === 'loading') {
        $.bind(window, 'DOMContentLoaded', _onload)
      } else {
        _onload()
      }
    } else {
      let _timer
      const _pollingDocument = () => {
        if (!!document && document.readyState === 'complete') {
          _timer && clearTimeout(_timer)
          _onload()
        } else {
          _timer = setTimeout(_pollingDocument, 1)
        }
      }
      _timer = setTimeout(_pollingDocument, 1)
    }
  }

  private _initComponent() {
    if (!$.one(`#${ISTANBUL_WIDGET_ID}`)) {
      const btnX = getStorage('btn_x') * 1
      const btnY = getStorage('btn_y') * 1

      let target: HTMLElement = document.body
      if (typeof this.option.target === 'string') {
        target = document.querySelector(this.option.target)!
      } else if (this.option.target instanceof HTMLElement) {
        target = this.option.target
      }
      if (!(target instanceof HTMLElement)) {
        target = document.body
      }

      if (!this.option.report) {
        console.error('[istanbul-widget] Missing `report` object in options.')
        return
      }

      const { onAction, afterAction, beforeAction, auto, onLeavePage, requireReporter } = this.option.report

      if (!onAction) {
        console.error('[istanbul-widget] Missing `onAction` function in options.')
        return
      }

      const autoObj: IstanbulWidgetOptions['report']['auto'] = {
        interval: isBoolean(auto) ? default_interval : auto?.interval || default_interval,
        minInterval: isBoolean(auto) ? default_min_interval : auto?.minInterval || default_min_interval,
      }

      const originData: Config = {
        enable_auto_report: !!auto,
        report_interval: autoObj.interval!,
        report_on_pageleave: onLeavePage!,
        reporter: '',
      }

      const enable_auto_report = getStorage('enable_auto_report', originData.enable_auto_report)
      const report_interval = getStorage('report_interval', originData.report_interval)
      const report_on_pageleave = getStorage('report_on_pageleave', originData.report_on_pageleave)
      const reporter = getStorage('reporter', originData.reporter)

      const setConfigToLocal = (data: Config) => {
        Object.keys(data).forEach((key) => {
          setStorage(key, JSON.stringify(data[key]))
        })
      }

      this.compInstance = render({
        target,
        theme: this.option.theme,
        position: {
          x: btnX,
          y: btnY,
        },
        show: true,
        min_internal: autoObj.minInterval!,
        onConfigChanged: setConfigToLocal,
        config: {
          enable_auto_report,
          report_interval,
          report_on_pageleave,
          reporter,
        },
        onReset: () => {
          setConfigToLocal(originData)
        },
        originConfig: originData,
        onAction,
        afterAction,
        beforeAction,
        requireReporter: requireReporter!,
      })
    }
  }

  private _autoRun() {
    this.isInited = true
    this.triggerEvent('ready')
  }

  public triggerEvent(eventName: string, param?: any) {
    eventName = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`
    if (isFunction(this.option[eventName])) {
      setTimeout(() => {
        this.option[eventName].apply(this, param)
      }, 0)
    }
  }

  public destroy() {
    if (!this.isInited) {
      return
    }
    this.isInited = false
    IstanbulWidget.instance = undefined

    this.compInstance.destroy()
  }

  public static get instance() {
    return window.__ISTANBUL_WIDGET_INSTANCE
  }

  public static set instance(value: IstanbulWidget | undefined) {
    if (value !== undefined && !(value instanceof IstanbulWidget)) {
      console.debug(
        '[istanbul-widget] Cannot set `IstanbulWidget.instance` because the value is not the instance of IstanbulWidget.',
      )
      return
    }
    window.__ISTANBUL_WIDGET_INSTANCE = value
  }
}
