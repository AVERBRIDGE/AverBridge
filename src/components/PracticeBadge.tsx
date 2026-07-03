import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlaskConical } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { Badge } from './ui/Badge'

export function PracticeBadge() {
  const { t } = useTranslation()
  const { network } = useAppStore()

  if (network !== 'testnet') return null

  return (
    <Badge variant="practice" className="gap-1">
      <FlaskConical className="w-3 h-3" aria-hidden />
      {t('practice.badge')}
    </Badge>
  )
}
