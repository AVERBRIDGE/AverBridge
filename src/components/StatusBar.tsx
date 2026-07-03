import React from 'react'
import { useTranslation } from 'react-i18next'
import { useBridgeStore } from '@/store/bridgeStore'
import { Shield, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const stateLabels: Record<string, { text: string; color: string }> = {
  locking: { text: 'Locking funds safely…', color: 'text-warning' },
  locked: { text: 'Locked ✓ — waiting for Stellar side', color: 'text-info' },
  claimable: { text: 'Ready to claim on Stellar!', color: 'text-success' },
  settling: { text: 'Finalizing…', color: 'text-info' },
  refunding: { text: 'Returning your funds…', color: 'text-warning' },
}

export function StatusBar() {
  const { activeBridges } = useBridgeStore()
  const { t } = useTranslation()
  const active = activeBridges.filter(
    (b) => b.state !== 'quote' && b.state !== 'completed' && b.state !== 'refunded'
  )

  if (active.length === 0) return null

  const top = active[0]
  const meta = stateLabels[top.state]

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Active transfer status"
      className={cn(
        'relative z-20 border-b border-info/20 bg-info/5 px-4 py-2',
        'flex items-center gap-2 text-xs'
      )}
    >
      <Shield className="w-3.5 h-3.5 text-info shrink-0" aria-hidden />
      <span className="text-gray-400">{t('common.whereAreMyFunds')}</span>
      <ArrowRight className="w-3 h-3 text-gray-600" aria-hidden />
      <span className={cn('font-medium', meta?.color ?? 'text-gray-300')}>
        {meta?.text ?? top.state}
      </span>
      {active.length > 1 && (
        <span className="text-gray-500 ml-1">+{active.length - 1} more</span>
      )}
    </div>
  )
}
