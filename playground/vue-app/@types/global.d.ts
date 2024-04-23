declare global {
  interface Window {
    __report: (coverage: any) => Promise<void>
  }
}

export {}
