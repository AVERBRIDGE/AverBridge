import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { usePoolStore, MOCK_POOLS } from '@/store/poolStore'
import { PoolCard } from '@/components/PoolCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { SkeletonCard } from '@/components/ui/Skeleton'

type SortKey = 'apr' | 'tvl' | 'volume'

export function Pools() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mode } = useAppStore()
  const { positions } = usePoolStore()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('apr')
  const loading = false

  const myPositionIds = new Set(positions.map((p) => p.poolId))

  const filtered = MOCK_POOLS
    .filter((p) =>
      search
        ? `${p.tokenA}/${p.tokenB}`.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sort === 'apr') return b.totalApr - a.totalApr
      if (sort === 'tvl') return b.tvl - a.tvl
      return b.volume24h - a.volume24h
    })

  const featured = MOCK_POOLS.filter((p) => p.featured)
  const myPools = MOCK_POOLS.filter((p) => myPositionIds.has(p.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{t('pools.title')}</h1>
      </div>

      {/* My positions strip */}
      {myPools.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-gray-400">{t('pools.myPools')}</h2>
          <div className="space-y-2">
            {myPools.map((p) => (
              <PoolCard
                key={p.id}
                pool={p}
                onClick={() => navigate(`/pools/${p.id}`)}
                hasPosition
              />
            ))}
          </div>
        </div>
      )}

      {/* Simple mode: featured pools */}
      {mode === 'simple' && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-gray-400">{t('pools.featured')}</h2>
          {loading ? (
            <div className="space-y-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="space-y-2">
              {featured.map((p) => (
                <PoolCard
                  key={p.id}
                  pool={p}
                  onClick={() => navigate(`/pools/${p.id}`)}
                  hasPosition={myPositionIds.has(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pro mode: all pools with sort */}
      {mode === 'pro' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" aria-hidden />
              <input
                type="search"
                placeholder={t('pools.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search pools"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-bg-border bg-bg-elevated text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet/50"
              />
            </div>
            <div className="flex items-center gap-1">
              <SlidersHorizontal className="w-4 h-4 text-gray-500 mr-1" aria-hidden />
              {([['apr', 'APR'], ['tvl', 'TVL'], ['volume', 'Volume']] as [SortKey, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  aria-pressed={sort === key}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    sort === key
                      ? 'border-violet bg-violet/15 text-white'
                      : 'border-bg-border text-gray-400 hover:border-violet/40'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Pro table header */}
          <div className="hidden sm:grid grid-cols-5 gap-4 px-4 text-xs text-gray-500">
            <span className="col-span-2">Pool</span>
            <span className="text-right">{t('pools.tvl')}</span>
            <span className="text-right">{t('pools.volume24h')}</span>
            <span className="text-right">{t('pools.apr')}</span>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="🌊"
              title={t('pools.emptyState')}
              description="Try adjusting your search"
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((p) => (
                <PoolCard
                  key={p.id}
                  pool={p}
                  onClick={() => navigate(`/pools/${p.id}`)}
                  hasPosition={myPositionIds.has(p.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
