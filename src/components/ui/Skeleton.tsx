import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number
  circle?: boolean
}

export function Skeleton({ lines, circle, className, ...props }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'skeleton h-4',
              i === lines - 1 && 'w-3/4',
              className
            )}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('skeleton', circle ? 'rounded-full' : '', className)}
      role="status"
      aria-label="Loading…"
      {...props}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton circle className="w-10 h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}
