import { useDraggable } from '@neodrag/react'
import { type PropsWithChildren, useEffect, useRef } from 'react'
import { useLocalStorageState, useMemoizedFn } from 'ahooks'
import { max } from 'es-toolkit/compat'
import { cn } from '@/components/utils'
import { ISTANBUL_WIDGET_ID } from '@/utils/const'
import { type Position } from '../options.interface'
import { Store } from '../store'

type DraggableProps = PropsWithChildren<{
  className?: string
}>

const IOS_SAFE_AREA = 20

const bounds = {
  top: 0,
  left: 0,
  right: 0,
  bottom: IOS_SAFE_AREA,
}

function Draggable(props: DraggableProps) {
  const { children, className } = props

  const { defaultPosition, float } = Store.useStore(['defaultPosition', 'float'])

  const handleRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement)
  const draggableRef = useRef<HTMLDivElement>(null as unknown as HTMLDivElement)

  const [position, setPosition] = useLocalStorageState(`${ISTANBUL_WIDGET_ID}_position`, {
    defaultValue: {
      x: defaultPosition?.x || 0,
      y: defaultPosition?.y || 0,
    },
  })

  const { isDragging } = useDraggable(draggableRef, {
    position,
    handle: handleRef,

    onDrag: (data) => {
      const { offsetX, offsetY } = data
      setPosition({ x: offsetX, y: offsetY })
    },
    onDragEnd(data) {
      const { offsetX, offsetY } = data
      setPosition(fixFloatPosition({ x: offsetX, y: offsetY }))
    },
    axis: 'both',
    bounds,
    recomputeBounds: {
      dragStart: true,
      drag: false,
      dragEnd: true,
    },
  })

  const getDocSize = useMemoizedFn(() => {
    const docWidth = max([document.documentElement.offsetWidth, window.innerWidth])!
    const docHeight = max([document.documentElement.offsetHeight, window.innerHeight])!
    return {
      docWidth,
      docHeight,
    }
  })

  const fixFloatPosition = useMemoizedFn((position: Position) => {
    if (float) {
      float.offsetX ??= 0
      const { x, y } = position
      const { docWidth } = getDocSize()
      const w = handleRef.current!.getBoundingClientRect().width
      let newX = docWidth && x + w / 2 > docWidth / 2 ? docWidth - w - float.offsetX : float.offsetX
      newX = max([newX, float.offsetX])!
      const newY = max([y, bounds.top])!
      return { x: newX, y: newY }
    }
    return position
  })

  const getButtonSafeAreaXY = useMemoizedFn((x: number, y: number) => {
    const { docWidth, docHeight } = getDocSize()

    const btn = draggableRef.current!
    if (x + btn.offsetWidth > docWidth) {
      x = docWidth - btn.offsetWidth
    }

    if (y + btn.offsetHeight > docHeight) {
      y = docHeight - btn.offsetHeight
    }

    if (x < 0) {
      x = max([defaultPosition?.x, bounds.left])!
    }

    if (y >= docHeight - btn.offsetHeight) {
      y = docHeight - btn.offsetHeight - bounds.bottom
    }

    if (y < 0) {
      y = max([defaultPosition?.y, bounds.top])!
    }

    return [x, y]
  })

  useEffect(() => {
    if (draggableRef.current) {
      const [x, y] = getButtonSafeAreaXY(position!.x, position!.y)
      setPosition(fixFloatPosition({ x, y }))
    }
  }, [draggableRef.current])

  return (
    <div
      ref={draggableRef}
      className={cn('iw-w-fit iw-pointer-events-auto', !isDragging ? 'iw-transition-transform' : '')}
    >
      <div ref={handleRef} className={className}>
        {children}
      </div>
    </div>
  )
}

export default Draggable
