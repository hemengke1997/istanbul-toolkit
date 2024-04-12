declare global {
  interface Window {
    __report: (coverage: any) => void
  }
}

export {}
