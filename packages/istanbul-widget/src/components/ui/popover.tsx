import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/components/utils"
import { ISTANBUL_WIDGET_ID } from '@/utils/const'

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverArrow = PopoverPrimitive.Arrow

const PopoverClose = PopoverPrimitive.Close

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal container={document.querySelector(`#${ISTANBUL_WIDGET_ID}`) as HTMLElement} forceMount>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "iw-z-[9999] iw-w-fit iw-rounded-md iw-border iw-bg-popover iw-text-popover-foreground iw-shadow-md iw-outline-none data-[state=open]:iw-animate-in data-[state=closed]:iw-animate-out data-[state=closed]:iw-fade-out-0 data-[state=open]:iw-fade-in-0 data-[state=closed]:iw-zoom-out-95 data-[state=open]:iw-zoom-in-95 data-[side=bottom]:iw-slide-in-from-top-2 data-[side=left]:iw-slide-in-from-right-2 data-[side=right]:iw-slide-in-from-left-2 data-[side=top]:iw-slide-in-from-bottom-2 data-[state=closed]:iw-hidden",
        className
      )}
       aria-describedby="popover-description"
      {...props}
      
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor, PopoverArrow, PopoverClose }
