import { deepMerge, isArray, isFunction, isObject, set } from '@minko-fe/lodash-pro'
import { ButtonGroupPlugin } from '@/plugins/button-group/ButtonGroupPlugin'
import { ReportPlugin } from '@/plugins/report/ReportPlugin'
import { SettingPlugin } from '@/plugins/setting/SettingPlugin'
import { $ } from '@/utils/query'
import { ISTANBUL_WIDGET_ID } from '@/utils/tool'
import Context from './Context'
import { type IstanbulWidgetOptions, type PluginName } from './options.interface'
import { IstanbulWidgetPlugin } from './plugin/IstanbulWidgetPlugin'
import { IstanbulWidgetReactPlugin } from './plugin/IstanbulWidgetReactPlugin'
import { type CompInstance, render } from './render'
import '@/styles/global.css'

export class IstanbulWidget {
  public version: string = __VERSION__
  public isInited: boolean = false
  public option = {
    theme: 'dark',
    target: document.body,
    float: {
      offsetX: 8,
    },
    defaultPosition: {
      x: 0,
      y: 0,
    },
    defaultPlugins: ['buttonGroup', 'setting'],
  } as IstanbulWidgetOptions

  protected compInstance: CompInstance = {
    pluginList: {},
  } as CompInstance
  protected pluginList: { [id: string]: IstanbulWidgetPlugin } = {} // plugin instance

  // Export static classes
  public static IstanbulWidgetPlugin: typeof IstanbulWidgetPlugin
  public static IstanbulWidgetReactPlugin: typeof IstanbulWidgetReactPlugin
  public static ReportPlugin: typeof ReportPlugin
  public static SettingPlugin: typeof SettingPlugin
  public static ButtonGroupPlugin: typeof ButtonGroupPlugin

  public static Context: typeof Context

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

    // add built-in plugins
    this._addBuiltInPlugins()

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
      let target: HTMLElement = document.body
      if (typeof this.option.target === 'string') {
        target = document.querySelector(this.option.target)!
      } else if (this.option.target instanceof HTMLElement) {
        target = this.option.target
      }
      if (!(target instanceof HTMLElement)) {
        target = document.body
      }

      this.compInstance = {
        ...this.compInstance,
        ...render({
          target,
          pluginList: {},
          theme: this.option.theme,
          defaultPosition: {
            x: this.option.defaultPosition!.x,
            y: this.option.defaultPosition!.y,
          },
          float: this.option.float,
          plugin: this.option.plugin,
        }),
      }
    }
  }

  /**
   * Add built-in plugins.
   */
  private _addBuiltInPlugins() {
    // add default report plugin
    this.addPlugin(new ReportPlugin(`${ISTANBUL_WIDGET_ID}_report__`, '上报插件'))

    // add other built-in plugins according to user's config
    const list = this.option.defaultPlugins

    const plugins: {
      [key in PluginName]?: any
    } = {
      setting: { proto: SettingPlugin, name: '设置插件' },
    }

    const { buttonGroup } = this.option.plugin || {}
    if (buttonGroup?.length) {
      plugins.buttonGroup = {
        proto: ButtonGroupPlugin,
        name: '按钮组插件',
        props: {
          propList: buttonGroup,
        },
      }
    }

    if (!!list && isArray(list)) {
      for (let i = 0; i < list.length; i++) {
        const pluginConf = plugins[list[i]]
        if (pluginConf) {
          this.addPlugin(new pluginConf.proto(`${ISTANBUL_WIDGET_ID}_${list[i]}__`, pluginConf.name, pluginConf.props))
        } else {
          console.debug('[istanbul-widget] Unrecognized default plugin ID:', list[i])
        }
      }
    }
  }

  /**
   * Add a new plugin.
   */
  public addPlugin(plugin: IstanbulWidgetPlugin) {
    // ignore this plugin if it has already been installed
    if (this.pluginList[plugin.id] !== undefined) {
      console.debug(`[istanbul-widget] Plugin \`${plugin.id}\` has already been added.`)
      return false
    }
    this.pluginList[plugin.id] = plugin

    if (this.isInited) {
      this._initPlugin(plugin)
    }
    return true
  }

  /**
   * Init a plugin.
   */
  private _initPlugin<T extends IstanbulWidgetPlugin>(plugin: T) {
    plugin.istanbulWidget = this

    set(this.compInstance.pluginList, plugin.id, {
      id: plugin.id,
      name: plugin.name,
    })

    this.compInstance.pluginList = this._reorderPluginList(this.compInstance.pluginList)

    // render component instance
    this.compInstance
      .update({
        pluginList: this.compInstance.pluginList,
      })
      .then(() => {
        // start init
        plugin.event.emit('init')
        // render
        plugin.event.emit('render', () => {})
        // end init
        plugin.isReady = true
        plugin.event.emit('ready')
      })
  }

  private _autoRun() {
    this.isInited = true

    // init plugins
    for (const id in this.pluginList) {
      this._initPlugin(this.pluginList[id])
    }

    this.triggerEvent('ready')

    if (process.env.NODE_ENV === 'development') {
      console.log(`[istanbul-widget]: v${this.version}`)
    }
  }

  /**
   * Trigger a `istanbulWidget.option` event.
   */
  public triggerEvent(eventName: string, param?: any) {
    eventName = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`
    if (isFunction(this.option[eventName])) {
      setTimeout(() => {
        this.option[eventName].apply(this, param)
      }, 0)
    }
  }

  /**
   * Sorting plugin list by option `pluginOrder`.
   * Plugin not listed in `pluginOrder` will be put last.
   */
  private _reorderPluginList(pluginList: { [pluginID: string]: any }) {
    if (!isArray(this.option.pluginOrder)) {
      return pluginList
    }
    const keys = Object.keys(pluginList).sort((a, b) => {
      const ia = this.option.pluginOrder?.indexOf(a)
      const ib = this.option.pluginOrder?.indexOf(b)
      if (ia === ib) {
        return 0
      }
      if (ia === -1) {
        return 1
      }
      if (ib === -1) {
        return -1
      }
      return ia! - ib!
    })
    const newList: typeof pluginList = {}
    for (let i = 0; i < keys.length; i++) {
      newList[keys[i]] = pluginList[keys[i]]
    }
    return newList
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

IstanbulWidget.IstanbulWidgetPlugin = IstanbulWidgetPlugin
IstanbulWidget.IstanbulWidgetReactPlugin = IstanbulWidgetReactPlugin
IstanbulWidget.ReportPlugin = ReportPlugin
IstanbulWidget.SettingPlugin = SettingPlugin
IstanbulWidget.ButtonGroupPlugin = ButtonGroupPlugin

IstanbulWidget.Context = Context
