declare global {
  interface Window {
    __report: (coverage: any, ...args: any[]) => Promise<void>
    __customClick: (...args: any[]) => void
  }
}

export {}
