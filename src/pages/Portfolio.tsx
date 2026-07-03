import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, Gift, Layers } from 'lucide-react'
import { useBridgeStore, type BridgeTransfer } from '@/store/bridgeStore'
import { usePoolStore, MOCK_POOLS } from '@/store/poolStore'
import { useWalletStore } from '@/store/walletStore'
import { formatUsd, formatPercent } from '@/lib/utils'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Banner } from '@/components/ui/Banner'

function BridgeStatusItem({ bridge }: { bridge: BridgeTransfer }) {
  const { claimBridge } = useBridgeStore()
  const { t } = useTranslation()

  const stateVariantMap: Partial<Record<string, 'warning' | 'info' | 'success'>> = {
    locking: 'warning',
    locked: 'info',
    claimable: 'success',
    settling: 'info',
    refunding: 'warning',
  }
  const stateVariant = stateVariantMap[bridge.state] ?? 'info'

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-bg-border bg-bg-elevated/50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-white">
            {bridge.fromAmount} {bridge.fromAsset} → {bridge.toAsset}
          </span>
          <Badge variant={stateVariant} dot>{bridge.state}</Badge>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {bridge.fromChain} → Stellar · {bridge.usdValue}
        </p>
      </div>
      {bridge.state === 'claimable' && (
        <Button size="sm" variant="gold" onClick={() => claimBridge(bridge.id)}>
          Claim
        </Button>
      )}
    </div>
  )
}

export function Portfolio() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { activeBridges } = useBridgeStore()
  const { positions, getPool } = usePoolStore()
  const { wallets } = useWalletStore()
  const stellarWallet = wallets.stellar

  const totalLpValue = positions.reduce((s, p) => s + p.currentUsd, 0)
  const totalFeesEarned = positions.reduce((s, p) => s + p.feesEarned, 0)
  const totalClaimable = positions.reduce((s, p) => s + p.claimableRewards, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-white">{t('portfolio.title')}</h1>

      {!stellarWallet && (
        <Banner
          variant="info"
          title={t('wallet.stellarRequired')}
          description={t('wallet.connectStellar')}
        />
      )}

      {/* Summary cards */}
      {stellarWallet && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: t('portfolio.totalValue'), value: formatUsd(totalLpValue), icon: <Layers className="w-4 h-4 text-violet" /> },
            { label: 'Total fees earned', value: formatUsd(totalFeesEarned), icon: <TrendingUp className="w-4 h-4 text-success" /> },
            { label: t('portfolio.claimableRewards'), value: formatUsd(totalClaimable), icon: <Gift className="w-4 h-4 text-gold" /> },
          ].map((s) => (
            <Card key={s.label} padding="md" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-bg-elevated">{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="font-mono font-semibold text-white">{s.value}</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Active bridges */}
      <div className="space-y-2">
        <CardHeader>
          <CardTitle>{t('portfolio.activeBridges')}</CardTitle>
          {activeBridges.length > 0 && (
            <Badge variant="info" dot>{activeBridges.length} active</Badge>
          )}
        </CardHeader>
        {activeBridges.length === 0 ? (
          <EmptyState
            icon="🌉"
            title={t('portfolio.emptyBridges')}
            action={
              <Button size="sm" variant="secondary" onClick={() => navigate('/bridge')}>
                Start a transfer
              </Button>
            }
          />
        ) : (
          <div className="space-y-2">
            {activeBridges.map((b) => (
              <BridgeStatusItem key={b.id} bridge={b} />
            ))}
          </div>
        )}
      </div>

      {/* LP positions */}
      <div className="space-y-2">
        <CardHeader>
          <CardTitle>{t('portfolio.lpPositions')}</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/pools')}>
            {t('pools.allPools')}
          </Button>
        </CardHeader>
        {positions.length === 0 ? (
          <EmptyState
            icon="💧"
            title={t('portfolio.emptyPositions')}
            action={
              <Button size="sm" variant="secondary" onClick={() => navigate('/pools')}>
                View pools
              </Button>
            }
          />
        ) : (
          <div className="space-y-2">
            {positions.map((pos) => {
              const pool = getPool(pos.poolId)
              if (!pool) return null
              const pnl = pos.currentUsd - pos.depositedUsd
              return (
                <motion.button
                  key={pos.poolId}
                  layout
                  onClick={() => navigate(`/pools/${pos.poolId}`)}
                  className="w-full glass-card p-4 text-left hover:border-violet/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[pool.tokenA, pool.tokenB].map((tk) => (
                        <div key={tk} className="w-8 h-8 rounded-full bg-bg-elevated border-2 border-bg-card flex items-center justify-center text-xs font-bold text-gray-300">
                          {tk[0]}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm">{pool.tokenA}/{pool.tokenB}</p>
                      <p className="text-xs text-gray-500">
                        Deposited: {formatUsd(pos.depositedUsd)} · {formatPercent(pool.totalApr)} APR
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-white font-medium">{formatUsd(pos.currentUsd)}</p>
                      <p className={`text-xs font-mono ${pnl >= 0 ? 'text-success' : 'text-danger'}`}>
                        {pnl >= 0 ? '+' : ''}{formatUsd(pnl)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600" aria-hidden />
                  </div>
                  {pos.claimableRewards > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gold">
                      <Gift className="w-3.5 h-3.5" />
                      {formatUsd(pos.claimableRewards)} rewards claimable
                    </div>
                  )}
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
