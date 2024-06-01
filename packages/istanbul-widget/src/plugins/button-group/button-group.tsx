import { memo } from 'react'
import { Button } from '@/components/ui/button'
import Context from '@/core/context'
import { type ButtonGroupOptions } from '@/core/options.interface'

export type ButtonGroupProps = {
  propList: ButtonGroupOptions | undefined
}

function ButtonGroup(props: ButtonGroupProps) {
  const { propList } = props

  const { reportFnparams } = Context.usePicker(['reportFnparams'])

  if (!propList?.length) return null

  return (
    <div className={'iw-space-x-2 flex'}>
      {propList?.map((item, index) => (
        <Button
          {...item}
          key={index}
          onClick={(e) => {
            item.onClick(e, reportFnparams)
          }}
          size='sm'
          variant={'outline'}
        >
          {item.text}
        </Button>
      ))}
    </div>
  )
}

export default memo(ButtonGroup)
