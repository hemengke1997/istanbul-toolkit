import { Button } from './src/components/ui'
import { IstanbulWidget } from './src/istanbul-widget'

function MyPlugin() {
  return <Button size={'sm'}>this is my Plugin</Button>
}

// 自定义插件

const myPlugin = new IstanbulWidget.IstanbulWidgetReactPlugin('my_plugin', 'My Plugin', MyPlugin)

myPlugin.event.on('init', () => {
  console.log('my plugin inited')
})

const istanbulWidget = new IstanbulWidget({
  defaultPosition: {
    x: -100,
    y: 100,
  },
  plugin: {
    report: {
      onReport(coverage) {
        console.log('上报', coverage)
        throw new Error('上报失败')
      },
    },
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
})

istanbulWidget.addPlugin(myPlugin)
