import React, { useLayoutEffect, useState } from 'react'
import { Popover, PopoverArrow, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Toaster } from '@/components/ui/toaster'
import { ISTANBUL_WIDGET_ID } from '@/utils/const'
import { $ } from '@/utils/query'
import Draggable from './components/draggable'
import { Store } from './store'

function IstanbulWidgetComponent() {
  const { theme, pluginList } = Store.useStore(['theme', 'pluginList'])

  const [popoverOpen, setPopoverOpen] = useState(false)

  useLayoutEffect(() => {
    const darkClass = 'istanbul-widget-dark'
    const lightClass = 'istanbul-widget-light'

    const dom = document.querySelector(`#${ISTANBUL_WIDGET_ID}`) as HTMLDivElement

    // prefer dark
    if (theme === 'light') {
      $.removeClass(dom, darkClass)
      $.addClass(dom, lightClass)
    } else {
      $.removeClass(dom, lightClass)
      $.addClass(dom, darkClass)
    }
  }, [])

  return (
    <>
      <div className='iw-block iw-fixed iw-z-[99999] iw-right-0 iw-top-0 iw-left-0 iw-bottom-0 iw-pointer-events-none'>
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <Draggable className='iw-rounded-full iw-overflow-hidden'>
            <PopoverTrigger asChild>
              <div
                className='iw-w-10 iw-h-10 iw-flex iw-justify-center iw-items-center iw-p-2 iw-cursor-pointer'
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                }}
                id={`${ISTANBUL_WIDGET_ID}__icon`}
              >
                <div className='iw-icon-[vscode-icons--file-type-testjs] iw-w-full iw-h-full'></div>
              </div>
            </PopoverTrigger>
          </Draggable>

          <PopoverContent sideOffset={2}>
            <div
              className='iw-flex iw-items-center iw-rounded-md iw-p-2 iw-text-xs iw-shadow iw-max-w-[100vw] iw-flex-wrap iw-space-x-2'
              id={`${ISTANBUL_WIDGET_ID}__popover`}
            >
              {Object.entries(pluginList).map(([_, plugin]) => {
                return (
                  <PopoverClose asChild key={plugin.id}>
                    <div
                      id={plugin.domID}
                      ref={(el) => {
                        if (el && plugin.El instanceof HTMLElement) {
                          el.appendChild(plugin.El)
                        }
                      }}
                    >
                      {React.isValidElement(plugin.El) && plugin.El}
                    </div>
                  </PopoverClose>
                )
              })}
            </div>
            <PopoverArrow />
          </PopoverContent>
        </Popover>
      </div>
      <Toaster />
    </>
  )
}

export default IstanbulWidgetComponent
