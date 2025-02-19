import { type IstanbulWidget } from './src/istanbul-widget'

declare global {
  interface Window {
    __istanbul_widget__: IstanbulWidget | undefined
  }
}

export {}
