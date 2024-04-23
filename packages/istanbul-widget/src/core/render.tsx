import ReactDOM from 'react-dom/client'
import { ISTANBUL_WIDGET_ID } from '@/utils/tool'
import Context, { type InitialWidgetProps } from './Context'
import IstanbulWidget from './IstanbulWidget'
import { type PluginType } from './options.interface'

export type CompInstance = {
  destroy: () => void
  update: (newProps: Partial<InitialWidgetProps>) => Promise<boolean>
  pluginList: { [id: string]: PluginType }
}

export function render({
  target,
  ...coreOptions
}: {
  target: HTMLElement
} & InitialWidgetProps): Pick<CompInstance, 'destroy' | 'update'> {
  const container = document.createElement('div')
  container.id = ISTANBUL_WIDGET_ID
  target.appendChild(container)
  const reactRoot = ReactDOM.createRoot(container)
  reactRoot.render(
    <Context.Provider value={coreOptions}>
      <IstanbulWidget />
    </Context.Provider>,
  )

  return {
    destroy() {
      reactRoot.unmount()
    },
    update(newProps) {
      reactRoot.render(
        <Context.Provider
          value={{
            ...coreOptions,
            ...newProps,
          }}
        >
          <IstanbulWidget />
        </Context.Provider>,
      )
      return new Promise((resolve) => {
        requestIdleCallback(() => {
          resolve(true)
        })
      })
    },
  }
}
