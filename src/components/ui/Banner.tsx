import React from 'react'
import { AlertTriangle, XCircle, Info, CheckCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type BannerVariant = 'warning' | 'error' | 'info' | 'success'

interface BannerProps {
  variant?: BannerVariant
  title?: string
  description?: string
  action?: React.ReactNode
  onDismiss?: () => void
  className?: string
  children?: React.ReactNode
}

const config: Record<BannerVariant, { bg: string; border: string; icon: React.ReactNode }> = {
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    icon: <AlertTriangle className="w-4 h-4 text-warning shrink-0" aria-hidden />,
  },
  error: {
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    icon: <XCircle className="w-4 h-4 text-danger shrink-0" aria-hidden />,
  },
  info: {
    bg: 'bg-info/10',
    border: 'border-info/30',
    icon: <Info className="w-4 h-4 text-info shrink-0" aria-hidden />,
  },
  success: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    icon: <CheckCircle className="w-4 h-4 text-success shrink-0" aria-hidden />,
  },
}

export function Banner({
  variant = 'info',
  title,
  description,
  action,
  onDismiss,
  className,
  children,
}: BannerProps) {
  const c = config[variant]

  return (
    <div
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl border',
        c.bg,
        c.border,
        className
      )}
    >
      <div className="mt-0.5">{c.icon}</div>
      <div className="flex-1 min-w-0">
        {title && <p className="text-sm font-medium text-white">{title}</p>}
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
        {children}
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-gray-500 hover:text-white transition-colors shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
