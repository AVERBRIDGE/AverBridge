import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowDown, Shield, Clock, CheckCircle } from 'lucide-react'
import { useWalletStore, type ChainId } from '@/store/walletStore'
import { useBridgeStore, type BridgeTransfer } from '@/store/bridgeStore'
import { useAppStore } from '@/store/appStore'
import { CHAINS, SPOKE_CHAINS, BRIDGE_ASSETS, assetToUsd } from '@/lib/chains'
import { formatUsd, formatEta, generateId, sleep } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AmountField } from '@/components/ui/AmountField'
import { Banner } from '@/components/ui/Banner'
import { Badge } from '@/components/ui/Badge'
import { ChainRouteVisualizer } from '@/components/ChainRouteVisualizer'
import { WalletChip } from '@/components/WalletChip'
import { ReceiptCard } from '@/components/ReceiptCard'

type Step = 'form' | 'review' | 'progress' | 'done'

const CHAIN_ASSETS: Record<ChainId, string[]> = {
  stellar: ['XLM', 'USDC', 'USDT'],
  ethereum: ['ETH', 'USDC', 'USDT'],
  solana: ['SOL', 'USDC'],
  bnb: ['BNB', 'USDC', 'USDT'],
}

function ChainSelector({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string
  value: ChainId
  onChange: (c: ChainId) => void
  exclude?: ChainId
}) {
  const spokeChains = SPOKE_CHAINS.filter((c) => c !== exclude)
  const chains = [
    ...spokeChains.map((c) => CHAINS[c]),
    CHAINS.stellar,
  ].filter((c) => c.id !== exclude)

  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-400">{label}</label>
      <div className="flex flex-wrap gap-2">
        {chains.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id as ChainId)}
            aria-pressed={value === c.id}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm transition-all ${
              value === c.id
                ? 'border-violet bg-violet/15 text-white'
                : 'border-bg-border bg-bg-elevated text-gray-400 hover:border-violet/40'
            }`}
          >
            <span style={{ color: CHAINS[c.id as ChainId].color }}>{c.logoEmoji}</span>
            {c.shortName}
          </button>
        ))}
      </div>
    </div>
  )
}

function StateProgress({ bridge }: { bridge: BridgeTransfer }) {
  const { t } = useTranslation()
  const { claimBridge, refundBridge } = useBridgeStore()
  const [claiming, setClaiming] = useState(false)

  const steps = [
    { key: 'locking', label: 'Locking on source chain' },
    { key: 'locked', label: 'Locked ✓' },
    { key: 'claimable', label: 'Ready to claim on Stellar' },
    { key: 'settling', label: 'Finalizing on Stellar' },
    { key: 'completed', label: 'Complete!' },
  ]
  const stateOrder = ['locking', 'locked', 'claimable', 'settling', 'completed']
  const currentIdx = stateOrder.indexOf(bridge.state)
  const isRefunding = bridge.state === 'refunding' || bridge.state === 'refunded'

  async function handleClaim() {
    setClaiming(true)
    await claimBridge(bridge.id)
    setClaiming(false)
  }

  if (isRefunding) {
    return (
      <div className="space-y-4">
        <Banner
          variant={bridge.state === 'refunded' ? 'success' : 'warning'}
          title={
            bridge.state === 'refunded'
              ? t('bridge.states.refunded')
              : t('bridge.states.refunding')
          }
          description={t('common.yourFundsAreSafe')}
        />
        {bridge.state === 'refunding' && (
          <Button variant="secondary" size="sm" onClick={() => refundBridge(bridge.id)} fullWidth>
            {t('bridge.manualRefund')}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3" role="list" aria-label="Transfer progress">
        {steps.map((step, i) => {
          const done = i < currentIdx
          const active = i === currentIdx
          return (
            <div
              key={step.key}
              role="listitem"
              className="flex items-center gap-3"
              aria-current={active ? 'step' : undefined}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs shrink-0 ${
                  done
                    ? 'bg-success/20 border-success text-success'
                    : active
                    ? 'bg-violet/20 border-violet text-violet animate-pulse-slow'
                    : 'bg-bg-elevated border-bg-border text-gray-600'
                }`}
              >
                {done ? <CheckCircle className="w-4 h-4" aria-hidden /> : i + 1}
              </div>
              <span
                className={`text-sm ${
                  done ? 'text-success' : active ? 'text-white font-medium' : 'text-gray-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {bridge.state === 'claimable' && (
        <div className="space-y-2">
          {bridge.claimDeadline && (
            <div className="flex items-center gap-1.5 text-xs text-warning">
              <Clock className="w-3.5 h-3.5" />
              {t('bridge.claimDeadline')}:{' '}
              {new Date(bridge.claimDeadline).toLocaleTimeString()}
            </div>
          )}
          <Button
            fullWidth
            variant="gold"
            loading={claiming}
            loadingText="Claiming…"
            onClick={handleClaim}
          >
            {t('bridge.claim', { asset: bridge.toAsset })}
          </Button>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Shield className="w-3.5 h-3.5 text-info" aria-hidden />
        {t('bridge.trustNote')}
      </div>
    </div>
  )
}

export function Bridge() {
  const { t } = useTranslation()
  const { wallets, connectWallet } = useWalletStore()
  const { mode } = useAppStore()
  const { addBridge, updateBridgeState, activeBridges } = useBridgeStore()

  const [step, setStep] = useState<Step>('form')
  const [fromChain, setFromChain] = useState<ChainId>('ethereum')
  const [fromAsset, setFromAsset] = useState('ETH')
  const [amount, setAmount] = useState('')
  const [currentBridgeId, setCurrentBridgeId] = useState<string | null>(null)

  const currentBridge = currentBridgeId
    ? activeBridges.find((b) => b.id === currentBridgeId)
    : null

  const toChain: ChainId = 'stellar'
  const bridgeKey = `${fromChain}:${fromAsset}` as keyof typeof BRIDGE_ASSETS
  const bridgeAsset = BRIDGE_ASSETS[bridgeKey]
  const toAsset = bridgeAsset?.toStellar ?? fromAsset

  const fromWallet = wallets[fromChain]
  const stellarWallet = wallets.stellar
  const fromBalance = fromWallet?.balances[fromAsset] ?? '0'

  // Debounce quote so fee/receive don't recalculate on every keystroke
  const debouncedAmount = useDebounce(amount, 250)

  const amountNum = parseFloat(debouncedAmount) || 0
  const fee = (amountNum * 0.003).toFixed(4)
  const receiveAmount = (amountNum - parseFloat(fee)).toFixed(4)

  const usdValue = formatUsd(assetToUsd(amount, fromAsset))

  const needsFromWallet = !fromWallet
  const needsStellarWallet = !stellarWallet

  async function startBridge() {
    const id = generateId()
    const transfer: BridgeTransfer = {
      id,
      fromChain,
      toChain,
      fromAsset,
      toAsset,
      fromAmount: amount,
      toAmount: receiveAmount,
      fee,
      feeUsd: formatUsd(assetToUsd(fee, fromAsset)),
      etaMinutes: 2,
      state: 'locking',
      claimDeadline: Date.now() + 30 * 60 * 1000,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      usdValue,
      txHashSource: '0xABCDEF123456',
    }
    addBridge(transfer)
    setCurrentBridgeId(id)
    setStep('progress')

    // Simulate lifecycle
    await sleep(2000)
    updateBridgeState(id, 'locked')
    await sleep(3000)
    updateBridgeState(id, 'claimable')
  }

  const completedBridge = useBridgeStore(
    (s) => s.historyBridges.find((b) => b.id === currentBridgeId)
  )

  if (step === 'done' || completedBridge?.state === 'completed') {
    const b = completedBridge
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ReceiptCard
            title="Transfer complete"
            status="completed"
            rows={[
              { label: 'You sent', value: `${amount} ${fromAsset}`, highlight: true },
              { label: 'You received', value: `${receiveAmount} ${toAsset}`, highlight: true },
              { label: t('bridge.fee'), value: `${fee} ${fromAsset}` },
              { label: 'From', value: CHAINS[fromChain].name },
              { label: 'To', value: 'Stellar' },
            ]}
            txHashSource={b?.txHashSource}
            txHashDest={b?.txHashDest}
            timestamp={b?.createdAt}
            onExport={() => {}}
          />
        </motion.div>
        <Button fullWidth variant="secondary" onClick={() => { setStep('form'); setAmount('') }}>
          Start another transfer
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{t('bridge.title')}</h1>
        {mode === 'pro' && (
          <Badge variant="info" dot>Hub-and-spoke via Stellar</Badge>
        )}
      </div>

      {step === 'form' && (
        <Card padding="lg" className="space-y-4">
          <ChainSelector
            label={t('bridge.from')}
            value={fromChain}
            onChange={(c) => { setFromChain(c); setFromAsset(CHAIN_ASSETS[c][0]) }}
          />

          {/* Asset selector */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400">{t('common.asset')}</label>
            <div className="flex flex-wrap gap-2">
              {CHAIN_ASSETS[fromChain].map((a) => (
                <button
                  key={a}
                  onClick={() => setFromAsset(a)}
                  aria-pressed={fromAsset === a}
                  className={`px-3 py-1 rounded-lg border text-sm transition-all ${
                    fromAsset === a
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-bg-border bg-bg-elevated text-gray-400 hover:border-gold/40'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <AmountField
            id="bridge-amount"
            label={t('bridge.amount')}
            value={amount}
            onChange={setAmount}
            asset={fromAsset}
            balance={fromBalance}
            onMax={() => setAmount(fromBalance)}
          />

          <div className="flex items-center gap-2 py-1">
            <div className="flex-1 h-px bg-bg-border" />
            <ArrowDown className="w-4 h-4 text-gray-600" aria-hidden />
            <div className="flex-1 h-px bg-bg-border" />
          </div>

          <div className="glass-card-elevated p-4 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">To</span>
              <div className="flex items-center gap-1.5">
                <span style={{ color: CHAINS.stellar.color }}>{CHAINS.stellar.logoEmoji}</span>
                <span className="text-white">Stellar</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{t('bridge.youReceive')}</span>
              <span className="font-mono text-white font-medium">
                {amount ? `${receiveAmount} ${toAsset}` : '—'}
              </span>
            </div>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>{t('bridge.fee')}</span>
                <span className="font-mono">{fee} {fromAsset} ({formatUsd(assetToUsd(fee, fromAsset))})</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>{t('bridge.eta')}</span>
                <span>~2 min</span>
              </div>
            </div>
          )}

          <ChainRouteVisualizer
            fromChain={fromChain}
            toChain={toChain}
            fromAsset={fromAsset}
            toAsset={toAsset}
          />

          {(needsFromWallet || needsStellarWallet) && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400">{t('wallet.walletChecklist')}</p>
              <div className="flex flex-wrap gap-2">
                {needsFromWallet && <WalletChip chainId={fromChain} />}
                {needsStellarWallet && <WalletChip chainId="stellar" />}
              </div>
              {(needsFromWallet || needsStellarWallet) && (
                <p className="text-xs text-gray-500">{t('wallet.whyMultiple')}</p>
              )}
            </div>
          )}

          <Button
            fullWidth
            size="lg"
            variant="primary"
            disabled={!amount || parseFloat(amount) <= 0 || needsFromWallet || needsStellarWallet}
            onClick={() => setStep('review')}
          >
            Review transfer
          </Button>
        </Card>
      )}

      {step === 'review' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card padding="lg" className="space-y-4">
            <h2 className="font-semibold text-white">{t('bridge.states.quote')}</h2>

            <div className="space-y-3">
              {[
                { label: 'You send', value: `${amount} ${fromAsset}`, highlight: true },
                { label: 'You receive', value: `${receiveAmount} ${toAsset}`, highlight: true },
                { label: t('bridge.fee'), value: `${fee} ${fromAsset}` },
                { label: t('bridge.eta'), value: formatEta(2) },
                { label: 'Route', value: `${CHAINS[fromChain].name} → Stellar` },
                { label: 'USD value', value: usdValue },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{r.label}</span>
                  <span className={`text-sm font-mono ${r.highlight ? 'text-white font-semibold' : 'text-gray-300'}`}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>

            <Banner
              variant="info"
              title="Protected by smart-contract lock"
              description="Your funds can't be taken. If this transfer doesn't complete, you'll receive an automatic refund."
            />

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep('form')} className="flex-1">
                {t('common.back')}
              </Button>
              <Button variant="gold" onClick={startBridge} className="flex-1">
                {t('common.confirmInWallet')}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {step === 'progress' && currentBridge && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-white">Transfer in progress</h2>
              <span className="font-mono text-xs text-gray-400">{amount} {fromAsset}</span>
            </div>
            <StateProgress bridge={currentBridge} />
            {currentBridge.state === 'completed' && (
              <Button fullWidth variant="gold" onClick={() => setStep('done')}>
                {t('common.done')}
              </Button>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  )
}
