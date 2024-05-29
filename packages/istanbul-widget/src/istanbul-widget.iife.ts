import { isBrowser } from '@minko-fe/lodash-pro'
import { IstanbulWidget } from './core/core'

declare global {
  interface Window {
    IstanbulWidget: typeof IstanbulWidget
  }
}

// ssr support
if (isBrowser()) {
  window.IstanbulWidget = IstanbulWidget
}
