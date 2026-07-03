import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/appStore'
import { cn } from '@/lib/utils'
import { Tooltip } from './ui/Tooltip'

export function ModeToggle({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation()
  const { mode, toggleMode } = useAppStore()
  const isSimple = mode === 'simple'

  return (
    <Tooltip
      content={
        isSimple
          ? t('mode.proDesc')
          : t('mode.simpleDesc')
      }
      side="bottom"
    >
      <button
        onClick={toggleMode}
        aria-label={`Switch to ${isSimple ? 'Pro' : 'Simple'} mode`}
        aria-pressed={!isSimple}
        className={cn(
          'relative flex items-center rounded-full border transition-all duration-200',
          'border-bg-border bg-bg-elevated',
          compact ? 'p-0.5 gap-0' : 'p-1 gap-0'
        )}
      >
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
            isSimple
              ? 'bg-violet text-white shadow-glow'
              : 'text-gray-500'
          )}
        >
          {t('mode.simple')}
        </span>
        <span
          className={cn(
            'px-3 py-1 rounded-full text-xs font-medium transition-all duration-200',
            !isSimple
              ? 'bg-violet text-white shadow-glow'
              : 'text-gray-500'
          )}
        >
          {t('mode.pro')}
        </span>
      </button>
    </Tooltip>
  )
}
