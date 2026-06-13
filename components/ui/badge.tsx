import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-[rgba(255,103,31,0.15)] text-[#FF671F] border border-[rgba(255,103,31,0.3)]',
        secondary:
          'bg-[rgba(172,191,55,0.15)] text-[#ACBF37] border border-[rgba(172,191,55,0.3)]',
        destructive:
          'bg-[rgba(239,68,68,0.15)] text-red-400 border border-[rgba(239,68,68,0.3)]',
        warning:
          'bg-[rgba(234,179,8,0.15)] text-yellow-400 border border-[rgba(234,179,8,0.3)]',
        outline:
          'bg-transparent text-[#9a9491] border border-[rgba(255,255,255,0.15)]',
        ghost:
          'bg-[rgba(255,255,255,0.06)] text-[#9a9491] border border-[rgba(255,255,255,0.08)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
