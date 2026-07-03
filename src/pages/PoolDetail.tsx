import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Gift } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { usePoolStore, generateMockHistory } from '@/store/poolStore'
import { useWalletStore } from '@/store/walletStore'
import { assetToUsd, ASSET_PRICES_USD } from '@/lib/chains'
import { formatUsd, formatPercent, sleep } from '@/lib/utils'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AmountField } from '@/components/ui/AmountField'
import { Banner } from '@/components/ui/Banner'
import { Badge } from '@/components/ui/Badge'
import { Tooltip } from '@/components/ui/Tooltip'
import { AreaChart } from '@/components/charts/AreaChart'
import { ImpermanentLossExplainer } from '@/components/ImpermanentLossExplainer'
import { useToast } from '@/components/ui/Toast'
import { WalletChip } from '@/components/WalletChip'

type DetailTab = 'add' | 'remove'

export function PoolDetail() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mode } = useAppStore()
  const { getPool, getPosition, addPosition, removePosition, hasSeenILExplainer, markILExplainerSeen } = usePoolStore()
  const { wallets } = useWalletStore()
  const { toast } = useToast()

  const pool = getPool(id!)!  // non-null: guarded by early return below
  const position = getPosition(id!)
  const stellarWallet = wallets.stellar

  const [tab, setTab] = useState<DetailTab>('add')
  const [amountA, setAmountA] = useState('')
  const [amountB, setAmountB] = useState('')
  const [removePercent, setRemovePercent] = useState(100)
  const [showILExplainer, setShowILExplainer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ilDismissed, setIlDismissed] = useState(false)

  if (!pool) {
    return (
      <div className="max-w-2xl mx-auto">
        <Banner variant="error" title="Pool not found" />
        <Button variant="ghost" onClick={() => navigate('/pools')} className="mt-4">
          Back to pools
        </Button>
      </div>
    )
  }

  const tvlHistory = generateMockHistory(pool.tvl, 30)
  const aprHistory = generateMockHistory(pool.totalApr, 30)

  const depositUsd = amountA
    ? assetToUsd(amountA, pool.tokenA) + assetToUsd(amountB, pool.tokenB)
    : 0

  // Auto-fill tokenB when tokenA is entered
  function handleAmountAChange(v: string) {
    setAmountA(v)
    if (v && !isNaN(parseFloat(v))) {
      const priceRatio = (ASSET_PRICES_USD[pool.tokenA] ?? 1) / (ASSET_PRICES_USD[pool.tokenB] ?? 1)
      setAmountB((parseFloat(v) * priceRatio).toFixed(4))
    } else {
      setAmountB('')
    }
  }

  async function handleAddLiquidity() {
    if (!hasSeenILExplainer[pool.id] && !ilDismissed) {
      setShowILExplainer(true)
      return
    }
    setLoading(true)
    await sleep(1500)
    addPosition({
      poolId: pool.id,
      depositedUsd: depositUsd,
      currentUsd: depositUsd,
      feesEarned: 0,
      poolShare: depositUsd / (pool.tvl + depositUsd),
      depositedAt: Date.now(),
      tokenAAmount: amountA,
      tokenBAmount: amountB,
      claimableRewards: 0,
    })
    markILExplainerSeen(pool.id)
    setLoading(false)
    setAmountA('')
    setAmountB('')
    toast({ type: 'success', title: 'Liquidity added!', description: `Added to ${pool.tokenA}/${pool.tokenB} pool. You're earning fees now.` })
  }

  async function handleRemoveLiquidity() {
    if (!position) return
    setLoading(true)
    await sleep(1200)
    if (removePercent >= 100) {
      removePosition(pool.id)
    } else {
      usePoolStore.getState().updatePosition(pool.id, {
        currentUsd: position.currentUsd * (1 - removePercent / 100),
        tokenAAmount: (parseFloat(position.tokenAAmount) * (1 - removePercent / 100)).toFixed(4),
        tokenBAmount: (parseFloat(position.tokenBAmount) * (1 - removePercent / 100)).toFixed(4),
      })
    }
    setLoading(false)
    toast({ type: 'success', title: 'Liquidity removed!', description: 'Your funds are back in your wallet.' })
  }

  async function handleClaimRewards() {
    if (!position?.claimableRewards) return
    setLoading(true)
    await sleep(1000)
    usePoolStore.getState().updatePosition(pool.id, { claimableRewards: 0 })
    setLoading(false)
    toast({ type: 'success', title: 'Rewards claimed!', description: formatUsd(position.claimableRewards) + ' added to your wallet.' })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <button
        onClick={() => navigate('/pools')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        aria-label="Back to pools"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('common.back')}
      </button>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {[pool.tokenA, pool.tokenB].map((token) => (
            <div key={token} className="w-10 h-10 rounded-full bg-bg-elevated border-2 border-bg-card flex items-center justify-center text-sm font-bold text-gray-300">
              {token[0]}
            </div>
          ))}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-white">{pool.tokenA}/{pool.tokenB}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="default">{(pool.feeTier * 100).toFixed(2)}% fee</Badge>
            {pool.featured && <Badge variant="gold">Featured</Badge>}
          </div>
        </div>
        <div className="ml-auto text-right">
          <Tooltip content={<div><p>From fees: {formatPercent(pool.feeApr)}</p>{pool.rewardApr > 0 && <p>From rewards: {formatPercent(pool.rewardApr)}</p>}</div>}>
            <div className="cursor-help">
              <p className="font-mono font-bold text-gold text-xl">{formatPercent(pool.totalApr)}</p>
              <p className="text-xs text-gray-500">{t('pools.apr')}</p>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t('pools.tvl'), value: pool.tvlUsd },
          { label: t('pools.volume24h'), value: pool.volume24hUsd },
          { label: `1 ${pool.tokenA}`, value: formatUsd(ASSET_PRICES_USD[pool.tokenA] ?? pool.priceAtoB) },
        ].map((s) => (
          <Card key={s.label} padding="md" className="text-center">
            <p className="font-mono font-semibold text-white">{s.value}</p>
            <p className="text-2xs text-gray-500 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts (Pro mode) */}
      {mode === 'pro' && (
        <Card padding="lg" className="space-y-6">
          <AreaChart data={tvlHistory} label={t('poolDetail.tvlChart')} color="#7C5CFF" formatValue={(v) => formatUsd(v, true)} />
          <AreaChart data={aprHistory} label={t('poolDetail.aprChart')} color="#38D9C9" formatValue={(v) => `${v.toFixed(1)}%`} />
        </Card>
      )}

      {/* Your position */}
      {position && (
        <Card padding="lg" elevated>
          <CardHeader>
            <CardTitle>{t('poolDetail.yourPosition')}</CardTitle>
            {position.claimableRewards > 0 && (
              <Button
                variant="gold"
                size="sm"
                leftIcon={<Gift className="w-3.5 h-3.5" />}
                loading={loading}
                onClick={handleClaimRewards}
              >
                {t('poolDetail.claimRewards')} ({formatUsd(position.claimableRewards)})
              </Button>
            )}
          </CardHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{t('poolDetail.currentValue')}</span>
              <span className="font-mono text-white font-semibold">{formatUsd(position.currentUsd)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('poolDetail.deposited')}</span>
              <span className="font-mono text-gray-300">{formatUsd(position.depositedUsd)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('poolDetail.feesEarned')}</span>
              <span className="font-mono text-success">{formatUsd(position.feesEarned)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('poolDetail.poolShare')}</span>
              <span className="font-mono text-gray-300">{formatPercent(position.poolShare * 100, 4)}</span>
            </div>
          </div>
          {position.currentUsd !== position.depositedUsd && (
            <Banner
              variant="info"
              description={t('poolDetail.priceChangeNote', {
                value: formatUsd(position.currentUsd),
                change: formatUsd(Math.abs(position.currentUsd - position.depositedUsd)),
              })}
              className="mt-3"
            />
          )}
        </Card>
      )}

      {/* Add / Remove tabs */}
      <Card padding="lg" className="space-y-4">
        <div className="flex gap-1 p-1 bg-bg-elevated rounded-xl">
          {(['add', 'remove'] as DetailTab[]).map((t_) => (
            <button
              key={t_}
              onClick={() => setTab(t_)}
              aria-pressed={tab === t_}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t_
                  ? 'bg-violet text-white shadow-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t_ === 'add' ? (
                <span className="flex items-center justify-center gap-1.5">
                  <Plus className="w-4 h-4" />{t('poolDetail.addLiquidity')}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <Minus className="w-4 h-4" />{t('poolDetail.removeLiquidity')}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 'add' && (
          <div className="space-y-3">
            {showILExplainer && !ilDismissed && (
              <ImpermanentLossExplainer
                poolId={pool.id}
                depositUsd={depositUsd}
                onDismiss={() => { setShowILExplainer(false); setIlDismissed(true) }}
                onContinue={() => {
                  setShowILExplainer(false)
                  setIlDismissed(true)
                  handleAddLiquidity()
                }}
              />
            )}

            {!showILExplainer && (
              <>
                <AmountField
                  id="liq-a"
                  label={`${pool.tokenA} amount`}
                  value={amountA}
                  onChange={handleAmountAChange}
                  asset={pool.tokenA}
                  balance={stellarWallet?.balances[pool.tokenA] ?? '0'}
                />
                <AmountField
                  id="liq-b"
                  label={`${pool.tokenB} amount`}
                  value={amountB}
                  onChange={setAmountB}
                  asset={pool.tokenB}
                  balance={stellarWallet?.balances[pool.tokenB] ?? '0'}
                />

                {depositUsd > 0 && (
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex justify-between">
                      <span>Deposit total</span>
                      <span className="font-mono text-white">{formatUsd(depositUsd)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('poolDetail.poolShare')}</span>
                      <span className="font-mono">{formatPercent((depositUsd / (pool.tvl + depositUsd)) * 100, 4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('poolDetail.estimatedDailyEarnings')}</span>
                      <span className="font-mono text-success">
                        ~{formatUsd((depositUsd * pool.totalApr) / 100 / 365)}
                      </span>
                    </div>
                  </div>
                )}

                {!stellarWallet && <WalletChip chainId="stellar" />}

                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  disabled={!amountA || !stellarWallet || loading}
                  loading={loading}
                  loadingText="Depositing…"
                  onClick={handleAddLiquidity}
                >
                  {t('liquidity.confirmAdd')}
                </Button>
              </>
            )}
          </div>
        )}

        {tab === 'remove' && (
          <div className="space-y-4">
            {!position ? (
              <Banner variant="info" title="No position" description="Add liquidity first to be able to withdraw." />
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">Withdraw amount</label>
                  <div className="flex gap-2 flex-wrap">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => setRemovePercent(pct)}
                        aria-pressed={removePercent === pct}
                        className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                          removePercent === pct
                            ? 'border-violet bg-violet/15 text-white'
                            : 'border-bg-border bg-bg-elevated text-gray-400'
                        }`}
                      >
                        {pct === 100 ? 'Max' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>You withdraw</span>
                    <span className="font-mono text-white">{formatUsd(position.currentUsd * removePercent / 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Including fees earned</span>
                    <span className="font-mono text-success">{formatUsd(position.feesEarned * removePercent / 100)}</span>
                  </div>
                </div>

                <Button
                  fullWidth
                  size="lg"
                  variant="danger"
                  loading={loading}
                  loadingText="Withdrawing…"
                  onClick={handleRemoveLiquidity}
                >
                  {t('liquidity.confirmRemove')}
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
