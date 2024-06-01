import { IstanbulWidgetReactPlugin } from '@/core/plugin/istanbul-widget-react-plugin'
import ButtonGroup, { type ButtonGroupProps } from './button-group'

export class ButtonGroupPlugin extends IstanbulWidgetReactPlugin<ButtonGroupProps> {
  constructor(id: string, name: string, renderProps: ButtonGroupProps) {
    super(id, name, ButtonGroup, renderProps)
  }
}
