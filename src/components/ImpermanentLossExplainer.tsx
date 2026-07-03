import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AlertTriangle, X, BookOpen } from 'lucide-react'
import { ilScenario, formatUsd } from '@/lib/utils'
import { Button } from './ui/Button'
import { useNavigate } from 'react-router-dom'

interface ImpermanentLossExplainerProps {
  poolId: string
  depositUsd: number
  onDismiss: () => void
  onContinue: () => void
}

export function ImpermanentLossExplainer({
  poolId,
  depositUsd,
  onDismiss,
  onContinue,
}: ImpermanentLossExplainerProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const scenario20 = ilScenario(20, depositUsd || 1000)
  const scenario50 = ilScenario(50, depositUsd || 1000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-card-lg border border-warning/30 bg-warning/5 p-5 space-y-4"
      role="dialog"
      aria-labelledby="il-explainer-title"
      aria-describedby="il-explainer-body"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" aria-hidden />
        <div className="flex-1">
          <h3 id="il-explainer-title" className="font-semibold text-white text-sm">
            {t('poolDetail.ilExplainerTitle')}
          </h3>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p id="il-explainer-body" className="text-sm text-gray-300 leading-relaxed">
        When prices shift between the two assets in a pool, your share may be worth a bit less than if you'd held them separately. This is normal and often smaller than the fees you earn — but it's real.
      </p>

      {depositUsd > 0 && (
        <div className="rounded-xl bg-bg-elevated border border-bg-border p-4 space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Example with your deposit ({formatUsd(depositUsd)})</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500">If price moves 20%</p>
              <p className="font-mono text-warning text-sm">
                −{formatUsd(scenario20)} potential
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-gray-500">If price moves 50%</p>
              <p className="font-mono text-danger text-sm">
                −{formatUsd(scenario50)} potential
              </p>
            </div>
          </div>
          <p className="text-2xs text-gray-600 mt-1">
            This can change as prices move. Your earned fees reduce this gap over time.
          </p>
        </div>
      )}

      <p className="text-xs text-gray-400">
        You can withdraw at any time. Your funds are never locked.
      </p>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<BookOpen className="w-3.5 h-3.5" />}
          onClick={() => navigate('/help')}
        >
          {t('poolDetail.ilExplainerLearnMore')}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onContinue}
          className="ml-auto"
        >
          {t('poolDetail.ilExplainerDismiss')} — continue
        </Button>
      </div>
    </motion.div>
  )
}
