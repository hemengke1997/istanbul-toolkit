import IstanbulWidget from './src/istanbul-widget'

new IstanbulWidget({
  defaultPosition: {
    x: 20,
    y: 100,
  },
  report: {
    auto: false,
    onAction: async (coverage) => {
      console.log('上报', coverage)
      throw new Error('上报失败')
    },
    requireReporter: false,
  },
})
