import { safeDestr } from 'destr'

export const ISTANBUL_WIDGET_ID = '__istanbul_widget'

export function setStorage(key: string, value: string) {
  if (!window.localStorage) {
    return
  }
  key = `${ISTANBUL_WIDGET_ID}_${key}`
  localStorage.setItem(key, value)
}
export function getStorage<T = any>(key: string, defaultValue?: T): T {
  if (!window.localStorage) {
    return defaultValue as T
  }
  key = `${ISTANBUL_WIDGET_ID}_${key}`
  return (safeDestr(localStorage.getItem(key)) ?? defaultValue) as T
}
