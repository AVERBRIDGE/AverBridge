import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLink, Download } from 'lucide-react'
import { useBridgeStore } from '@/store/bridgeStore'
import { getChain } from '@/lib/chains'
import { formatTimestamp } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

type HistoryTab = 'all' | 'bridges' | 'swaps'

const MOCK_SWAPS = [
  { id: 's1', type: 'swap', inputAsset: 'XLM', outputAsset: 'USDC', inputAmount: '100', outputAmount: '11.19', usdValue: '$11.19', timestamp: Date.now() - 3_600_000, status: 'completed' as const, txHash: 'STELLAR_TX_1' },
  { id: 's2', type: 'swap', inputAsset: 'USDC', outputAsset: 'USDT', inputAmount: '50', outputAmount: '49.98', usdValue: '$49.98', timestamp: Date.now() - 7_200_000, status: 'completed' as const, txHash: 'STELLAR_TX_2' },
]

export function History() {
  const { t } = useTranslation()
  const { historyBridges } = useBridgeStore()
  const [tab, setTab] = useState<HistoryTab>('all')

  const bridgeItems = historyBridges.map((b) => ({
    id: b.id,
    type: 'bridge',
    title: `${b.fromAmount} ${b.fromAsset} → ${b.toAmount} ${b.toAsset}`,
    subtitle: `${getChain(b.fromChain).name} → Stellar`,
    usdValue: b.usdValue,
    timestamp: b.updatedAt,
    status: b.state === 'completed' ? 'completed' as const : 'refunded' as const,
    txHash: b.txHashDest ?? b.txHashSource,
  }))

  const swapItems = MOCK_SWAPS.map((s) => ({
    id: s.id,
    type: 'swap',
    title: `${s.inputAmount} ${s.inputAsset} → ${s.outputAmount} ${s.outputAsset}`,
    subtitle: 'Stellar AMM swap',
    usdValue: s.usdValue,
    timestamp: s.timestamp,
    status: s.status,
    txHash: s.txHash,
  }))

  const all = [...bridgeItems, ...swapItems].sort((a, b) => b.timestamp - a.timestamp)

  const items = tab === 'all' ? all : tab === 'bridges' ? bridgeItems : swapItems

  function exportHistory() {
    const csv = [
      'Date,Type,Description,USD Value,Status,Tx Hash',
      ...items.map((i) =>
        [formatTimestamp(i.timestamp), i.type, i.title, i.usdValue, i.status, i.txHash ?? ''].join(',')
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'averbridge-history.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{t('history.title')}</h1>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={exportHistory}
          >
            {t('history.exportAll')}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg-elevated rounded-xl w-fit">
        {([['all', t('history.all')], ['bridges', t('history.bridges')], ['swaps', t('history.swaps')]] as [HistoryTab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
            className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
              tab === key ? 'bg-violet text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState icon="📋" title={t('history.empty')} />
      ) : (
        <Card padding="none">
          <div className="divide-y divide-bg-border">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    item.type === 'bridge' ? 'bg-violet/20 text-violet' : 'bg-cyan/20 text-cyan'
                  }`}
                  aria-hidden
                >
                  {item.type === 'bridge' ? '⇆' : '⇅'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                    <span className="text-gray-700">·</span>
                    <p className="text-xs text-gray-500">{formatTimestamp(item.timestamp)}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <p className="font-mono text-sm text-white">{item.usdValue}</p>
                  <Badge variant={item.status === 'completed' ? 'success' : 'warning'}>
                    {t(`common.${item.status}`)}
                  </Badge>
                </div>
                {item.txHash && (
                  <a
                    href="#"
                    className="text-gray-500 hover:text-violet transition-colors"
                    aria-label={`View transaction on explorer`}
                    onClick={(e) => e.preventDefault()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
