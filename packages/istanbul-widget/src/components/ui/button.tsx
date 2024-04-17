import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/components/utils"

const buttonVariants = cva(
  "iw-inline-flex iw-items-center iw-justify-center iw-whitespace-nowrap iw-rounded-md iw-text-sm iw-font-medium iw-transition-colors focus-visible:iw-outline-none focus-visible:iw-ring-1 focus-visible:iw-ring-ring disabled:iw-pointer-events-none disabled:iw-opacity-50",
  {
    variants: {
      variant: {
        default:
          "iw-bg-primary iw-text-primary-foreground iw-shadow",
        destructive:
          "iw-bg-destructive iw-text-destructive-foreground iw-shadow-sm",
        outline:
          "iw-border iw-border-input iw-bg-background iw-shadow-sm hover:iw-bg-accent hover:iw-text-accent-foreground",
        secondary:
          "iw-bg-secondary iw-text-secondary-foreground iw-shadow-sm",
        ghost: "hover:iw-bg-accent hover:iw-text-accent-foreground",
        link: "iw-text-primary iw-underline-offset-4 hover:iw-underline",
      },
      size: {
        default: "iw-h-9 iw-px-4 iw-py-2",
        sm: "iw-h-8 iw-rounded-md iw-px-3 iw-text-xs",
        lg: "iw-h-10 iw-rounded-md iw-px-8",
        icon: "iw-h-9 iw-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
