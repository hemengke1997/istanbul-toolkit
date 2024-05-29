import { IstanbulWidget, type IstanbulWidgetOptions } from 'istanbul-widget/lib'
import { type ComponentType, useEffect, useState } from 'react'

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
  function AppWithIstanbulWidget(props) {
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
