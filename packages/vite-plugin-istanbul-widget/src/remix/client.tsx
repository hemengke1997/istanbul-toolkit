import { type ComponentType, useEffect, useState } from 'react'
// @ts-ignore
import { IstanbulWidget, type IstanbulWidgetOptions } from 'istanbul-widget/lib'

let hydrating = true

function useHydrated() {
  const [hydrated, setHydrated] = useState(() => !hydrating)

  useEffect(() => {
    hydrating = false
    setHydrated(true)
  }, [])

  return hydrated
}

export const withIstanbulWidget = (Component: ComponentType, istanbulWidgetConfig: IstanbulWidgetOptions) => () => {
  function AppWithIstanbulWidget(props: any) {
    const hydrated = useHydrated()
    useEffect(() => {
      if (hydrated) {
        new IstanbulWidget(istanbulWidgetConfig)
      }
    }, [hydrated])
    return <Component {...props} />
  }
  return AppWithIstanbulWidget
}
