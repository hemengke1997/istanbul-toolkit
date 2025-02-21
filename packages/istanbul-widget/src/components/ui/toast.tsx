import * as React from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/components/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "iw-fixed iw-top-3 iw-z-[9999] iw-flex iw-max-h-screen iw-w-full iw-flex-col-reverse iw-px-4 sm:iw-bottom-3 sm:iw-right-0 sm:iw-top-auto sm:iw-flex-col md:iw-max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "iw-group iw-pointer-events-auto iw-relative iw-flex iw-w-full iw-items-center iw-justify-between iw-space-x-2 iw-overflow-hidden iw-rounded-md iw-border iw-p-4 iw-pr-6 iw-shadow-lg iw-transition-all data-[swipe=cancel]:iw-translate-x-0 data-[swipe=end]:iw-translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:iw-translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:iw-transition-none data-[state=open]:iw-animate-in data-[state=closed]:iw-animate-out data-[swipe=end]:iw-animate-out data-[state=closed]:iw-fade-out-80 data-[state=closed]:iw-slide-out-to-right-full data-[state=open]:iw-slide-in-from-top-full data-[state=open]:sm:iw-slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "iw-border iw-bg-background iw-text-foreground",
        destructive:
          "iw-destructive iw-group iw-border-destructive iw-bg-destructive iw-text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "iw-inline-flex iw-h-8 iw-shrink-0 iw-items-center iw-justify-center iw-rounded-md iw-border iw-bg-transparent iw-px-3 iw-text-sm iw-font-medium iw-transition-colors hover:iw-bg-secondary focus:iw-outline-none focus:iw-ring-1 focus:iw-ring-ring disabled:iw-pointer-events-none disabled:iw-opacity-50 group-[.destructive]:iw-border-muted/40 group-[.destructive]:hover:iw-border-destructive/30 group-[.destructive]:hover:iw-bg-destructive group-[.destructive]:hover:iw-text-destructive-foreground group-[.destructive]:focus:iw-ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "iw-absolute iw-right-1 iw-top-1 iw-rounded-md iw-p-1 iw-text-foreground/50 iw-transition-opacity hover:iw-text-foreground focus:iw-opacity-100 focus:iw-outline-none focus:iw-ring-1 group-hover:iw-opacity-100 group-[.destructive]:iw-text-red-300 group-[.destructive]:hover:iw-text-red-50 group-[.destructive]:focus:iw-ring-red-400 group-[.destructive]:focus:iw-ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <Cross2Icon className="iw-h-4 iw-w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("iw-text-sm iw-font-semibold [&+div]:iw-text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("iw-text-sm iw-opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
