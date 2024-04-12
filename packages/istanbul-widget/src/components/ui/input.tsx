import * as React from 'react'
import { cn } from '@/components/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'iw-flex iw-h-9 iw-w-full iw-rounded-md iw-border iw-border-input iw-bg-transparent iw-px-3 iw-py-1 iw-text-sm iw-shadow-sm iw-transition-colors file:iw-border-0 file:iw-bg-transparent file:iw-text-sm file:iw-font-medium placeholder:iw-text-muted-foreground focus-visible:iw-outline-none focus-visible:iw-ring-1 focus-visible:iw-ring-ring disabled:iw-cursor-not-allowed disabled:iw-opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
