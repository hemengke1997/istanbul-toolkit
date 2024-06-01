import { IstanbulWidgetReactPlugin } from '@/core/plugin/istanbul-widget-react-plugin'
import Report from './report'

export class ReportPlugin extends IstanbulWidgetReactPlugin {
  constructor(id: string, name: string, renderProps = {}) {
    super(id, name, Report, renderProps)
  }
}
