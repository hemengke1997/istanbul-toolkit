import { IstanbulWidgetReactPlugin } from '@/core/plugin/istanbul-widget-react-plugin'
import Setting from './setting'

export class SettingPlugin extends IstanbulWidgetReactPlugin {
  constructor(id: string, name: string, renderProps = {}) {
    super(id, name, Setting, renderProps)
  }
}
