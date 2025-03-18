import { reactdomRender, reactdomUnmount } from './dom/react-render'
import { ISTANBUL_WIDGET_ID } from '@/utils/const'
import { type widgetReactContext } from './core'
import IstanbulWidgetComponent from './istanbul-widget'
import { type PluginType } from './options.interface'
import { type InitialWidgetProps, Store } from './store'

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
  context: widgetReactContext
} & InitialWidgetProps): Pick<CompInstance, 'destroy' | 'update'> {
  const container = document.createElement('div')
  container.id = ISTANBUL_WIDGET_ID
  target.appendChild(container)

  reactdomRender(
    <Store.Provider {...coreOptions}>
      <IstanbulWidgetComponent />
    </Store.Provider>,
    {
      container,
      sync: true,
    },
  )

  return {
    destroy() {
      reactdomUnmount(container)
    },
    async update(newProps) {
      reactdomRender(
        <Store.Provider {...coreOptions} {...newProps}>
          <IstanbulWidgetComponent />
        </Store.Provider>,
        {
          container,
          sync: true,
        },
      )
      return true
    },
  }
}
