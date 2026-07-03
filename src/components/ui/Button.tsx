import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  loadingText?: string
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-violet hover:bg-violet-600 text-white shadow-glow hover:shadow-glow focus-visible:ring-violet',
  secondary:
    'bg-bg-elevated border border-bg-border hover:border-violet/40 text-gray-200 hover:text-white',
  ghost: 'text-gray-400 hover:text-white hover:bg-bg-elevated',
  danger:
    'bg-danger/10 hover:bg-danger/20 text-danger border border-danger/30',
  gold: 'bg-gold hover:bg-gold-500 text-bg-base font-semibold shadow-glow-gold',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-6 py-3.5 text-base rounded-xl gap-2',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden />
        ) : leftIcon ? (
          <span className="shrink-0" aria-hidden>{leftIcon}</span>
        ) : null}
        <span>{loading && loadingText ? loadingText : children}</span>
        {!loading && rightIcon ? (
          <span className="shrink-0" aria-hidden>{rightIcon}</span>
        ) : null}
      </button>
    )
  }
)
Button.displayName = 'Button'
