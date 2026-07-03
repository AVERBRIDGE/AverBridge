import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToastContext } from './ToastContext'

type ToastType = 'success' | 'warning' | 'error' | 'info'

interface ToastItem {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-success" aria-hidden />,
  warning: <AlertTriangle className="w-5 h-5 text-warning" aria-hidden />,
  error: <XCircle className="w-5 h-5 text-danger" aria-hidden />,
  info: <Info className="w-5 h-5 text-info" aria-hidden />,
}

const borderColors: Record<ToastType, string> = {
  success: 'border-success/30',
  warning: 'border-warning/30',
  error: 'border-danger/30',
  info: 'border-info/30',
}

function ToastItem({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="alert"
      aria-live="polite"
      className={cn(
        'glass-card p-4 flex gap-3 items-start max-w-sm w-full pointer-events-auto border',
        borderColors[item.type]
      )}
    >
      <div className="shrink-0 mt-0.5">{icons[item.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{item.title}</p>
        {item.description && (
          <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-gray-500 hover:text-white transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback(
    (item: Omit<ToastItem, 'id'>) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((t) => [...t, { ...item, id }])
      const duration = item.duration ?? 5000
      if (duration > 0) setTimeout(() => dismiss(id), duration)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
