import { type ReactElement } from 'react'
import { flushSync } from 'react-dom'
import ReactDOM, { type Root } from 'react-dom/client'

const MARK = '__istanbul_widget_root__'

type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root
}

export function reactdomRender(node: ReactElement, container: ContainerType) {
  flushSync(() => {
    const root = container[MARK] || ReactDOM.createRoot(container)
    root.render(node)
    container[MARK] = root
  })
}

export async function reactdomUnmount(container: ContainerType) {
  await Promise.resolve()
  container[MARK]?.unmount()
  delete container[MARK]
}
