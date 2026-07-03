import React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'violet' | 'info' | 'practice'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  dot?: boolean
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-bg-elevated text-gray-400 border-bg-border',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
  gold: 'bg-gold/10 text-gold border-gold/20',
  violet: 'bg-violet/10 text-violet-300 border-violet/20',
  info: 'bg-info/10 text-info border-info/20',
  practice: 'bg-cyan/10 text-cyan border-cyan/20',
}

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  gold: 'bg-gold',
  violet: 'bg-violet',
  info: 'bg-info',
  practice: 'bg-cyan',
}

export function Badge({
  variant = 'default',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full animate-pulse-slow shrink-0', dotColors[variant])}
          aria-hidden
        />
      )}
      {children}
    </span>
  )
}
