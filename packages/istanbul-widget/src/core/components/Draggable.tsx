import { useUpdateEffect } from '@minko-fe/react-hook'
import { useDraggable } from '@neodrag/react'
import { type PropsWithChildren, memo, useEffect, useRef, useState } from 'react'
import { setStorage } from '@/utils/tool'

type DraggableProps = PropsWithChildren<{
  position: {
    x: number
    y: number
  }
  defaultPosition: {
    x: number
    y: number
  }
}>

function Draggable(props: DraggableProps) {
  const { children, position: positionProp, defaultPosition } = props

  const draggableRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({
    x: positionProp.x || 0,
    y: positionProp.y || 0,
  })

  useDraggable(draggableRef, {
    position,
    handle: handleRef,
    onDrag: ({ offsetX, offsetY }) => {
      setPosition({ x: offsetX, y: offsetY })
    },
    axis: 'both',
    bounds: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 20,
    },
  })

  const getButtonSafeAreaXY = (x: number, y: number) => {
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
      y = docHeight - btn.offsetHeight - 20
    }

    if (y < 0) {
      y = defaultPosition.y
    }

    return [x, y]
  }

  useEffect(() => {
    if (draggableRef.current) {
      const [x, y] = getButtonSafeAreaXY(position.x, position.y)
      setPosition({ x, y })
    }
  }, [draggableRef.current])

  useUpdateEffect(() => {
    const { x, y } = position
    setStorage('btn_x', `${x}`)
    setStorage('btn_y', `${y}`)
  }, [position])

  return (
    <div ref={draggableRef} className={'iw-w-fit iw-pointer-events-auto'}>
      <div className='iw-flex iw-items-center iw-space-x-2 iw-rounded-md iw-bg-[#525252] iw-p-2 iw-text-xs iw-shadow'>
        {children}
        <div ref={handleRef} className='iw-icon-[iconamoon--move-fill] iw-cursor-move iw-text-lg iw-text-white'></div>
      </div>
    </div>
  )
}

export default memo(Draggable)
