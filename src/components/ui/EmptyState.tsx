import React from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6 gap-3',
        className
      )}
    >
      {icon && (
        <div className="text-4xl text-gray-600 mb-2" aria-hidden>
          {icon}
        </div>
      )}
      <p className="text-gray-300 font-medium">{title}</p>
      {description && <p className="text-sm text-gray-500 max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
