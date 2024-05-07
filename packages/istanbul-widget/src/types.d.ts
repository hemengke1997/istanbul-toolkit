declare global {
  declare var __VERSION__: string

  interface Window {
    __ISTANBUL_WIDGET_INSTANCE: any
    __istanbulWidgetAutoReportInterval: number
    __coverage__: any
  }
}

export {}
