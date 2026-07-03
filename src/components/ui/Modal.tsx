import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  hideClose?: boolean
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  hideClose = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) dialogRef.current?.focus()
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'relative glass-card p-6 w-full',
              sizeClasses[size]
            )}
          >
            {(title || !hideClose) && (
              <div className="flex items-center justify-between mb-5">
                {title && (
                  <h2 id="modal-title" className="text-lg font-semibold text-white">
                    {title}
                  </h2>
                )}
                {!hideClose && (
                  <button
                    onClick={onClose}
                    className="ml-auto text-gray-500 hover:text-white transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
