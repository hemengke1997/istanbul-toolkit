import { Button } from './src/components/ui'
import { IstanbulWidget } from './src/istanbul-widget'

function ReactPlugin() {
  return <Button size={'sm'}>this is react Plugin</Button>
}

// 自定义react插件
const reactPlugin = new IstanbulWidget.IstanbulWidgetReactPlugin('react_plugin', 'React Plugin', ReactPlugin)

reactPlugin.on('init', () => {
  console.log('react plugin inited')
})

// 自定义html插件
const htmlEl = document.createElement('div')
htmlEl.innerHTML = 'this is html plugin'
const htmlPlugin = new IstanbulWidget.IstanbulWidgetPlugin('html_plugin', 'HTML Plugin', htmlEl)

htmlPlugin.on('init', () => {
  console.log('html plugin inited')
})

const istanbulWidget = new IstanbulWidget({
  defaultPosition: {
    x: 0,
    y: 100,
  },
  plugin: {
    // 上报按钮
    report: {
      onReport(coverage) {
        console.log('上报', coverage)
        throw new Error('上报失败')
      },
    },
    // 设置插件
    setting: {
      requireReporter: true,
    },
    buttonGroup: [
      {
        text: '额外按钮 - 1',
        onClick() {
          console.log('1')
        },
      },
      {
        text: '额外按钮 - 2',
        onClick() {
          console.log('2')
        },
      },
    ],
  },
  pluginOrder: ['report', 'react_plugin', 'html_plugin', 'buttonGroup', 'setting'],
  debug: true,
})

istanbulWidget.addPlugin(reactPlugin)
istanbulWidget.addPlugin(htmlPlugin)
