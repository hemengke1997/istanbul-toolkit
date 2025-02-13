export const id = (name: string) => `virtual:istanbul-widget-${name}`

export const runtimeId = id('runtime')

export const vmods = [runtimeId]

export const resolvedVirtualModuleId = (virtualModuleId: string) => `\0${virtualModuleId}`
