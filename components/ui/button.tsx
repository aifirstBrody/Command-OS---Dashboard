import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF671F]/50 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        default:
          'bg-[#FF671F] text-white hover:bg-[#D6562B] shadow-sm shadow-[#FF671F]/20',
        outline:
          'border border-[rgba(255,103,31,0.4)] text-[#FF671F] bg-transparent hover:bg-[rgba(255,103,31,0.1)]',
        ghost:
          'text-[#9a9491] hover:text-white hover:bg-[rgba(255,255,255,0.06)] bg-transparent',
        destructive:
          'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20',
        secondary:
          'bg-[rgba(172,191,55,0.12)] border border-[rgba(172,191,55,0.3)] text-[#ACBF37] hover:bg-[rgba(172,191,55,0.2)]',
        link:
          'text-[#FF671F] underline-offset-4 hover:underline bg-transparent p-0 h-auto',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-7 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
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
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
