import React from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, ChevronRight } from 'lucide-react'
import type { Pool } from '@/store/poolStore'
import { formatPercent } from '@/lib/utils'
import { Badge } from './ui/Badge'
import { Tooltip } from './ui/Tooltip'
import { cn } from '@/lib/utils'

interface PoolCardProps {
  pool: Pool
  onClick?: () => void
  hasPosition?: boolean
  compact?: boolean
}

export function PoolCard({ pool, onClick, hasPosition, compact }: PoolCardProps) {
  const { t } = useTranslation()

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full glass-card p-4 text-left transition-all duration-200',
        'hover:border-violet/30 hover:shadow-glow focus-visible:ring-violet',
        compact ? 'rounded-xl' : 'rounded-card'
      )}
      aria-label={`${pool.tokenA}/${pool.tokenB} pool — ${formatPercent(pool.totalApr)} APR`}
    >
      <div className="flex items-center gap-3">
        {/* Token icons */}
        <div className="flex -space-x-2 shrink-0" aria-hidden>
          {[pool.tokenA, pool.tokenB].map((token) => (
            <div
              key={token}
              className="w-9 h-9 rounded-full bg-bg-elevated border-2 border-bg-card flex items-center justify-center text-xs font-bold text-gray-300"
            >
              {token[0]}
            </div>
          ))}
        </div>

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">
              {pool.tokenA}/{pool.tokenB}
            </span>
            <Badge variant="default" className="text-2xs">
              {(pool.feeTier * 100).toFixed(2)}%
            </Badge>
            {pool.featured && <Badge variant="gold" className="text-2xs">Featured</Badge>}
            {hasPosition && <Badge variant="violet" dot className="text-2xs">Your position</Badge>}
          </div>
          {!compact && (
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span>TVL {pool.tvlUsd}</span>
              <span>Vol {pool.volume24hUsd}</span>
            </div>
          )}
        </div>

        {/* APR */}
        <div className="text-right shrink-0">
          <Tooltip
            content={
              <div className="space-y-1">
                <p>Fee APR: <span className="text-cyan">{formatPercent(pool.feeApr)}</span></p>
                {pool.rewardApr > 0 && (
                  <p>Reward APR: <span className="text-gold">{formatPercent(pool.rewardApr)}</span></p>
                )}
                <p className="text-gray-500 text-2xs">Based on last 7 days of trading</p>
              </div>
            }
          >
            <div className="cursor-help">
              <p className="font-mono font-semibold text-gold">{formatPercent(pool.totalApr)}</p>
              <p className="text-2xs text-gray-500">{t('pools.apr')}</p>
            </div>
          </Tooltip>
        </div>

        <ChevronRight className="w-4 h-4 text-gray-600 shrink-0" aria-hidden />
      </div>
    </button>
  )
}
