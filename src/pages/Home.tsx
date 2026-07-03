import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Waves, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { MOCK_POOLS } from '@/store/poolStore'
import { usePlatformStats, useLivePrice } from '@/hooks/useLivePrice'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatUsd, formatPercent } from '@/lib/utils'

const actionCards = [
  {
    key: 'bridge',
    icon: <ArrowLeftRight className="w-6 h-6" />,
    path: '/bridge',
    gradient: 'from-violet/20 to-violet/5',
    border: 'border-violet/20',
  },
  {
    key: 'swap',
    icon: <Waves className="w-6 h-6" />,
    path: '/swap',
    gradient: 'from-cyan/20 to-cyan/5',
    border: 'border-cyan/20',
  },
  {
    key: 'earn',
    icon: <TrendingUp className="w-6 h-6" />,
    path: '/pools',
    gradient: 'from-gold/20 to-gold/5',
    border: 'border-gold/20',
  },
]

/** Live stats section — shown in both Simple and Pro mode */
function PlatformStatsSection() {
  const stats = usePlatformStats()
  const xlm = useLivePrice('XLM')
  const eth = useLivePrice('ETH')
  const sol = useLivePrice('SOL')

  const prices = [
    { symbol: 'XLM', data: xlm, color: '#7C5CFF' },
    { symbol: 'ETH', data: eth, color: '#627EEA' },
    { symbol: 'SOL', data: sol, color: '#9945FF' },
  ]

  return (
    <div className="space-y-4">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Value Locked', value: formatUsd(stats.tvlUsd, true), sub: 'across all pools', accent: true },
          { label: '24h Volume', value: formatUsd(stats.volume24hUsd, true), sub: 'traded today' },
          { label: 'Total Bridges', value: stats.totalBridges.toLocaleString(), sub: 'completed transfers' },
          { label: 'Liquidity Providers', value: stats.totalLps.toLocaleString(), sub: `${stats.activePools} active pools` },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card padding="md" className="space-y-0.5">
              <p className={`font-mono text-lg font-bold ${s.accent ? 'text-gold' : 'text-white'}`}>
                {s.value}
              </p>
              <p className="text-xs text-gray-300 font-medium">{s.label}</p>
              <p className="text-2xs text-gray-600">{s.sub}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Live price row */}
      <div className="grid grid-cols-3 gap-3">
        {prices.map(({ symbol, data, color }) => (
          <Card key={symbol} padding="md" className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: color + '22', border: `1px solid ${color}44`, color }}
            >
              {symbol[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-semibold text-white">
                  {formatUsd(data.price)}
                </span>
                <span
                  className={`text-2xs font-mono flex items-center gap-0.5 ${
                    data.changeDir === 'up' ? 'text-success' : data.changeDir === 'down' ? 'text-danger' : 'text-gray-500'
                  }`}
                >
                  {data.changeDir === 'up' ? (
                    <ArrowUpRight className="w-2.5 h-2.5" aria-hidden />
                  ) : data.changeDir === 'down' ? (
                    <ArrowDownRight className="w-2.5 h-2.5" aria-hidden />
                  ) : (
                    <Minus className="w-2.5 h-2.5" aria-hidden />
                  )}
                  {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
                </span>
              </div>
              <p className="text-2xs text-gray-500">{symbol} / USD</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ProDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const pools = MOCK_POOLS.slice(0, 3)
  const totalTvl = MOCK_POOLS.reduce((s, p) => s + p.tvl, 0)
  const totalVol = MOCK_POOLS.reduce((s, p) => s + p.volume24h, 0)

  return (
    <div className="space-y-6">
      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total value locked', value: formatUsd(totalTvl, true), icon: <Activity className="w-4 h-4 text-violet" /> },
          { label: '24h volume', value: formatUsd(totalVol, true), icon: <Activity className="w-4 h-4 text-cyan" /> },
          { label: 'Top pool APR', value: formatPercent(MOCK_POOLS[0].totalApr), icon: <TrendingUp className="w-4 h-4 text-gold" /> },
          { label: 'Active pools', value: String(MOCK_POOLS.length), icon: <Waves className="w-4 h-4 text-success" /> },
        ].map((stat, i) => (
          <Card key={i} padding="md" className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-bg-elevated">{stat.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="font-mono font-semibold text-white">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Top pools */}
      <Card padding="none">
        <div className="p-4 border-b border-bg-border flex items-center justify-between">
          <h2 className="font-semibold text-white">Top pools by APR</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/pools')}>
            {t('common.viewAll')}
          </Button>
        </div>
        <div className="divide-y divide-bg-border">
          {pools.map((pool) => (
            <button
              key={pool.id}
              onClick={() => navigate(`/pools/${pool.id}`)}
              className="w-full flex items-center justify-between p-4 hover:bg-bg-elevated/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[pool.tokenA, pool.tokenB].map((t) => (
                    <div key={t} className="w-8 h-8 rounded-full bg-bg-elevated border-2 border-bg-card flex items-center justify-center text-xs font-bold text-gray-300">
                      {t[0]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{pool.tokenA}/{pool.tokenB}</p>
                  <p className="text-xs text-gray-500">{(pool.feeTier * 100).toFixed(2)}% fee</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-semibold text-gold">{formatPercent(pool.totalApr)} APR</p>
                <p className="text-xs text-gray-500">TVL {pool.tvlUsd}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mode } = useAppStore()

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-center py-8 space-y-3"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {t('home.title')}
        </h1>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Non-custodial DeFi on Stellar — bridge from Ethereum, Solana &amp; BNB Chain, swap on a native AMM, and earn yield with full transparency and automatic refunds on every transfer.
              </p>
      </motion.div>

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {actionCards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
          >
            <button
              onClick={() => navigate(card.path)}
              className={`w-full rounded-card-lg border p-6 text-left transition-all duration-200 bg-gradient-to-br hover:scale-[1.02] active:scale-[0.99] ${card.gradient} ${card.border} hover:shadow-glow`}
            >
              <div className="text-gray-300 mb-3">{card.icon}</div>
              <h2 className="font-semibold text-white text-base mb-1">
                {t(`home.${card.key}Action`)}
              </h2>
              <p className="text-sm text-gray-400">
                {t(`home.${card.key}Desc`)}
              </p>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Platform stats — always shown */}
      <PlatformStatsSection />

      {/* Pro mode dashboard / simple featured section */}
      {mode === 'pro' ? (
        <ProDashboard />
      ) : (
        <div className="max-w-3xl mx-auto">
          <Card padding="lg" className="text-center space-y-3">
            <Badge variant="practice" dot>Practice mode active</Badge>
            <p className="text-gray-300 text-sm">
              You're using <strong>practice mode</strong> — everything works exactly like the real app, but with test funds that have no real value. It's a safe way to try bridging and earning before using real money.
            </p>
            <Button variant="secondary" size="sm" onClick={() => navigate('/practice')}>
              Get practice funds
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
