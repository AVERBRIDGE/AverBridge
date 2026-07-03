import React from 'react'
import { ExternalLink, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from './ui/Card'
import { CopyableId } from './ui/CopyableId'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { formatTimestamp } from '@/lib/utils'

interface ReceiptRow {
  label: string
  value: string
  mono?: boolean
  highlight?: boolean
}

interface ReceiptCardProps {
  title: string
  status: 'completed' | 'refunded' | 'pending' | 'failed'
  rows: ReceiptRow[]
  txHashSource?: string
  txHashDest?: string
  explorerUrlSource?: string
  explorerUrlDest?: string
  timestamp?: number
  onExport?: () => void
}

const statusVariants = {
  completed: 'success' as const,
  refunded: 'warning' as const,
  pending: 'info' as const,
  failed: 'danger' as const,
}

export function ReceiptCard({
  title,
  status,
  rows,
  txHashSource,
  txHashDest,
  explorerUrlSource,
  explorerUrlDest,
  timestamp,
  onExport,
}: ReceiptCardProps) {
  const { t } = useTranslation()

  return (
    <Card padding="lg" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">{title}</h3>
        <Badge variant={statusVariants[status]}>
          {t(`common.${status}`)}
        </Badge>
      </div>

      {timestamp && (
        <p className="text-xs text-gray-500">{formatTimestamp(timestamp)}</p>
      )}

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="text-xs text-gray-400">{row.label}</span>
            <span
              className={
                row.mono
                  ? 'font-mono text-xs text-gray-300'
                  : row.highlight
                  ? 'font-semibold text-white'
                  : 'text-sm text-gray-200'
              }
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {(txHashSource || txHashDest) && (
        <div className="border-t border-bg-border pt-3 space-y-2">
          {txHashSource && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Source tx</span>
              <div className="flex items-center gap-2">
                <CopyableId value={txHashSource} />
                {explorerUrlSource && (
                  <a
                    href={explorerUrlSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-violet transition-colors"
                    aria-label="View source transaction on explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
          {txHashDest && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Stellar tx</span>
              <div className="flex items-center gap-2">
                <CopyableId value={txHashDest} />
                {explorerUrlDest && (
                  <a
                    href={explorerUrlDest}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-violet transition-colors"
                    aria-label="View Stellar transaction on explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {onExport && (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={onExport}
          className="w-full"
        >
          {t('bridge.exportReceipt')}
        </Button>
      )}
    </Card>
  )
}
