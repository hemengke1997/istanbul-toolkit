import IstanbulWidget from './src/istanbul-widget'

new IstanbulWidget({
  defaultPosition: {
    x: 0,
    y: 100,
  },
  report: {
    auto: false,
    onAction: async (coverage, config) => {
      console.log('上报', coverage, config)
      throw new Error('上报失败')
    },
    requireReporter: false,
  },
})
