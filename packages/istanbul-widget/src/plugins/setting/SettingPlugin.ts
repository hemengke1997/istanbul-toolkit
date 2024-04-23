import { IstanbulWidgetReactPlugin } from '@/core/plugin/IstanbulWidgetReactPlugin'
import Setting from './Setting'

export class SettingPlugin extends IstanbulWidgetReactPlugin {
  constructor(id: string, name: string, renderProps = {}) {
    super(id, name, Setting, renderProps)
  }
}
