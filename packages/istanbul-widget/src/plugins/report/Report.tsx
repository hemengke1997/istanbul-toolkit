import { memo } from 'react'
import { Button } from '@/components/ui/button'
import Context from '../../core/Context'

function Report() {
  const { plugin, reportFn } = Context.usePicker(['plugin', 'reportFn'])
  const { report } = plugin || {}

  return (
    <Button size='sm' onClick={() => reportFn.run()}>
      {report?.text || '上报'}
    </Button>
  )
}

export default memo(Report)
