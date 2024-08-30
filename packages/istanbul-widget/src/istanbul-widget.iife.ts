import { IstanbulWidget } from './core/core'

declare global {
  interface Window {
    IstanbulWidget: typeof IstanbulWidget
  }
}

// ssr support
if (typeof window !== 'undefined') {
  window.IstanbulWidget = IstanbulWidget
}
