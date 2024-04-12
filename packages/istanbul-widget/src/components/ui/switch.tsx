import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/components/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "iw-peer iw-inline-flex iw-h-5 iw-w-9 iw-shrink-0 iw-cursor-pointer iw-items-center iw-rounded-full iw-border-2 iw-border-transparent iw-shadow-sm iw-transition-colors focus-visible:iw-outline-none focus-visible:iw-ring-2 focus-visible:iw-ring-ring focus-visible:iw-ring-offset-2 focus-visible:iw-ring-offset-background disabled:iw-cursor-not-allowed disabled:iw-opacity-50 data-[state=checked]:iw-bg-primary data-[state=unchecked]:iw-bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "iw-pointer-events-none iw-block iw-h-4 iw-w-4 iw-rounded-full iw-bg-background iw-shadow-lg iw-ring-0 iw-transition-transform data-[state=checked]:iw-translate-x-4 data-[state=unchecked]:iw-translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
