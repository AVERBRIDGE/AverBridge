import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactElement
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  maxWidth?: string
}

export function Tooltip({
  content,
  children,
  side = 'top',
  className,
  maxWidth = 'max-w-xs',
}: TooltipProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className={cn(
              'absolute z-50 pointer-events-none',
              positionClasses[side]
            )}
          >
            <div
              className={cn(
                'glass-card px-3 py-2 text-xs text-gray-200 whitespace-normal',
                maxWidth,
                className
              )}
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
