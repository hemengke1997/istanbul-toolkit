import IstanbulWidget from './src/istanbul-widget'

new IstanbulWidget({
  report: {
    onAction: async (coverage) => {
      console.log('上报', coverage)
      throw new Error('上报失败')
    },
    requireReporter: false,
  },
})
