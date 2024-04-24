import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"

import { cn } from "@/components/utils"
import { ISTANBUL_WIDGET_ID } from '@/utils/const'

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "iw-fixed iw-inset-0 iw-z-50 iw-bg-black/80 iw- data-[state=open]:iw-animate-in data-[state=closed]:iw-animate-out data-[state=closed]:iw-fade-out-0 data-[state=open]:iw-fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal container={document.querySelector(`#${ISTANBUL_WIDGET_ID}`) as HTMLElement}>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "iw-fixed iw-left-[50%] iw-top-[50%] iw-z-50 iw-grid iw-w-[80%] iw-max-w-lg iw-translate-x-[-50%] iw-translate-y-[-50%] iw-space-4 iw-border iw-bg-background iw-p-6 iw-shadow-lg iw-duration-200 data-[state=open]:iw-animate-in data-[state=closed]:iw-animate-out data-[state=closed]:iw-fade-out-0 data-[state=open]:iw-fade-in-0 data-[state=closed]:iw-zoom-out-95 data-[state=open]:iw-zoom-in-95 data-[state=closed]:iw-slide-out-to-left-1/2 data-[state=closed]:iw-slide-out-to-top-[48%] data-[state=open]:iw-slide-in-from-left-1/2 data-[state=open]:iw-slide-in-from-top-[48%] iw-rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="iw-absolute iw-right-4 iw-top-4 iw-rounded-sm iw-opacity-70 iw-ring-offset-background iw-transition-opacity hover:iw-opacity-100 focus:iw-outline-none focus:iw-ring-2 focus:iw-ring-ring focus:iw-ring-offset-2 disabled:iw-pointer-events-none data-[state=open]:iw-bg-accent data-[state=open]:iw-text-muted-foreground">
        <Cross2Icon className="iw-h-4 iw-w-4" />
        <span className="iw-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "iw-flex iw-flex-col iw-space-y-1.5 iw-text-center sm:iw-text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "iw-flex iw-flex-col-reverse sm:iw-flex-row sm:iw-justify-end sm:iw-space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "iw-text-lg iw-font-semibold iw-leading-none iw-tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("iw-text-sm iw-text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
