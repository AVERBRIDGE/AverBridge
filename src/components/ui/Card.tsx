import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean
  glow?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export function Card({
  elevated = false,
  glow = false,
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'glass-card',
        elevated && 'glass-card-elevated',
        glow && 'shadow-glow',
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn('text-base font-semibold text-white', className)} {...props}>
      {children}
    </h2>
  )
}

export function CardSection({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border-t border-bg-border pt-4 mt-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}
