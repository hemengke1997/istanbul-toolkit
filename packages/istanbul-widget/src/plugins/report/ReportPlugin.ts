import { IstanbulWidgetReactPlugin } from '@/core/plugin/IstanbulWidgetReactPlugin'
import Report from './Report'

export class ReportPlugin extends IstanbulWidgetReactPlugin {
  constructor(id: string, name: string, renderProps = {}) {
    super(id, name, Report, renderProps)
  }
}
