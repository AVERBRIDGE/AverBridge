import React from 'react'
import { Activity, Layers, ArrowLeftRight, Users, TrendingUp } from 'lucide-react'
import { usePlatformStats } from '@/hooks/useLivePrice'
import { formatUsd } from '@/lib/utils'

function StatItem({ label, value, icon, accent = false }: {
  label: string
  value: string
  icon: React.ReactNode
  accent?: boolean
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-gray-600" aria-hidden>{icon}</span>
      <div>
        <p className={`text-xs font-mono font-semibold ${accent ? 'text-gold' : 'text-gray-300'}`}>
          {value}
        </p>
        <p className="text-2xs text-gray-600 leading-none">{label}</p>
      </div>
    </div>
  )
}

export function StatsBar() {
  const s = usePlatformStats()

  return (
    <div
      className="border-b border-bg-border bg-bg-surface/60 backdrop-blur-sm overflow-hidden"
      role="region"
      aria-label="Platform statistics"
    >
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto scrollbar-none">
        <StatItem
          label="Total Value Locked"
          value={formatUsd(s.tvlUsd, true)}
          icon={<Layers className="w-3 h-3" />}
          accent
        />
        <div className="w-px h-4 bg-bg-border shrink-0" aria-hidden />
        <StatItem
          label="24h Volume"
          value={formatUsd(s.volume24hUsd, true)}
          icon={<Activity className="w-3 h-3" />}
        />
        <div className="w-px h-4 bg-bg-border shrink-0" aria-hidden />
        <StatItem
          label="Total Bridges"
          value={s.totalBridges.toLocaleString()}
          icon={<ArrowLeftRight className="w-3 h-3" />}
        />
        <div className="w-px h-4 bg-bg-border shrink-0" aria-hidden />
        <StatItem
          label="Liquidity Providers"
          value={s.totalLps.toLocaleString()}
          icon={<Users className="w-3 h-3" />}
        />
        <div className="w-px h-4 bg-bg-border shrink-0" aria-hidden />
        <StatItem
          label="Active Pools"
          value={String(s.activePools)}
          icon={<TrendingUp className="w-3 h-3" />}
        />
        <div className="w-px h-4 bg-bg-border shrink-0" aria-hidden />
        <StatItem
          label="Uptime"
          value={`${s.uptime.toFixed(2)}%`}
          icon={<Activity className="w-3 h-3" />}
        />
      </div>
    </div>
  )
}
