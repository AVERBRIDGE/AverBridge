import { createContext, useContext } from 'react'

export interface ToastContextValue {
  toast: (item: { type: 'success' | 'warning' | 'error' | 'info'; title: string; description?: string; duration?: number }) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
