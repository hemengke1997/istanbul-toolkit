import { IstanbulWidgetReactPlugin } from '@/core/plugin/IstanbulWidgetReactPlugin'
import ButtonGroup, { type ButtonGroupProps } from './ButtonGroup'

export class ButtonGroupPlugin extends IstanbulWidgetReactPlugin<ButtonGroupProps> {
  constructor(id: string, name: string, renderProps: ButtonGroupProps) {
    super(id, name, ButtonGroup, renderProps)
  }
}
