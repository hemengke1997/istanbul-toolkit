import ReactDOM from 'react-dom/client'
import { ISTANBUL_WIDGET_ID } from '@/utils/tool'
import IstanbulWidget, { type IstanbulWidgetProps } from './IstanbulWidget'

export type CompInstance = {
  destroy: () => void
  update: (newProps: IstanbulWidgetProps) => void
}

export function render({
  target,
  ...istanbulWidgetProps
}: { target: HTMLElement } & IstanbulWidgetProps): CompInstance {
  const container = document.createElement('div')
  container.id = ISTANBUL_WIDGET_ID
  target.appendChild(container)
  const reactRoot = ReactDOM.createRoot(container)
  reactRoot.render(<IstanbulWidget {...istanbulWidgetProps} />)

  return {
    destroy() {
      reactRoot.unmount()
    },
    update(newProps: IstanbulWidgetProps) {
      reactRoot.render(<IstanbulWidget {...istanbulWidgetProps} {...newProps} />)
    },
  }
}
