import { Button } from '@/components/ui/button'
import { Store } from '@/core/store'

function Report() {
  const { plugin, reportFn } = Store.useStore(['plugin', 'reportFn'])
  const { report } = plugin || {}

  return (
    <Button
      size='sm'
      onClick={() => {
        reportFn.run()
      }}
    >
      {report?.text || '上报'}
    </Button>
  )
}

export default Report
