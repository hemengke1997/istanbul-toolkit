import { useMemoizedFn, useUpdateEffect } from '@minko-fe/react-hook'
import { type DragOptions, useDraggable } from '@neodrag/react'
import { type PropsWithChildren, memo, useEffect, useRef, useState } from 'react'
import { cn } from '@/components/utils'
import { setStorage } from '@/utils/tool'
import { type IstanbulWidgetOptions, type Position } from '../options.interface'

type DraggableProps = PropsWithChildren<{
  position: Position
  defaultPosition: Position
  dragOptions: DragOptions
  float: IstanbulWidgetOptions['float']
}>

const IOS_SAFE_AREA = 20

const bounds = {
  top: 0,
  left: 0,
  right: 0,
  bottom: IOS_SAFE_AREA,
}

function Draggable(props: DraggableProps) {
  const { children, position: positionProp, defaultPosition, dragOptions, float } = props

  const handleRef = useRef<HTMLDivElement>(null)
  const draggableRef = useRef<HTMLDivElement>(null)

  const [dragging, setDragging] = useState(false)

  const [position, setPosition] = useState({
    x: positionProp.x || 0,
    y: positionProp.y || 0,
  })

  useDraggable(draggableRef, {
    ...dragOptions,
    position,
    handle: handleRef,
    onDragStart(data) {
      setDragging(true)
      dragOptions.onDragStart?.(data)
    },
    onDrag: (data) => {
      const { offsetX, offsetY } = data
      setPosition({ x: offsetX, y: offsetY })
      dragOptions.onDrag?.(data)
    },
    onDragEnd(data) {
      setDragging(false)

      const { offsetX, offsetY } = data
      setPosition(fixFloatPosition({ x: offsetX, y: offsetY }))

      dragOptions.onDragEnd?.(data)
    },
    axis: 'both',
    bounds,
    recomputeBounds: {
      dragStart: true,
      drag: false,
      dragEnd: true,
    },
  })

  const fixFloatPosition = useMemoizedFn((position: Position) => {
    if (float) {
      float.offsetX ??= 0
      const { x, y } = position
      const windowWidth = window.innerWidth
      const w = handleRef.current!.getBoundingClientRect().width
      const newX = x + w / 2 > windowWidth / 2 ? windowWidth - w - float.offsetX : float.offsetX
      const newY = y <= bounds.top ? bounds.top : y
      return { x: newX, y: newY }
    }
    return position
  })

  const getButtonSafeAreaXY = useMemoizedFn((x: number, y: number) => {
    const docWidth = Math.max(document.documentElement.offsetWidth, window.innerWidth)
    const docHeight = Math.max(document.documentElement.offsetHeight, window.innerHeight)

    const btn = draggableRef.current!
    if (x + btn.offsetWidth > docWidth) {
      x = docWidth - btn.offsetWidth
    }

    if (y + btn.offsetHeight > docHeight) {
      y = docHeight - btn.offsetHeight
    }

    if (x < 0) {
      x = defaultPosition.x
    }

    if (y >= docHeight - btn.offsetHeight) {
      y = docHeight - btn.offsetHeight - IOS_SAFE_AREA
    }

    if (y < 0) {
      y = defaultPosition.y
    }

    return [x, y]
  })

  useEffect(() => {
    if (draggableRef.current) {
      const [x, y] = getButtonSafeAreaXY(position.x, position.y)
      setPosition(fixFloatPosition({ x, y }))
    }
  }, [draggableRef.current])

  useUpdateEffect(() => {
    const { x, y } = position
    setStorage('btn_x', `${x}`)
    setStorage('btn_y', `${y}`)
  }, [position])

  return (
    <div
      ref={draggableRef}
      className={cn('iw-w-fit iw-pointer-events-auto', !dragging ? 'iw-transition-transform' : '')}
    >
      <div ref={handleRef}>{children}</div>
    </div>
  )
}

export default memo(Draggable)
