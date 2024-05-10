import { ISTANBUL_WIDGET_ID } from '@/utils/const'
import Context, { type InitialWidgetProps } from './Context'
import IstanbulWidget from './IstanbulWidget'
import { reactdomRender, reactdomUnmount } from './dom/react-render'
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

  reactdomRender(
    <Context.Provider value={coreOptions}>
      <IstanbulWidget />
    </Context.Provider>,
    container,
  )

  return {
    destroy() {
      reactdomUnmount(container)
    },
    async update(newProps) {
      reactdomRender(
        <Context.Provider
          value={{
            ...coreOptions,
            ...newProps,
          }}
        >
          <IstanbulWidget />
        </Context.Provider>,
        container,
      )
      return true
    },
  }
}
