import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowUpDown, Settings } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { useWalletStore } from '@/store/walletStore'
import { MOCK_POOLS } from '@/store/poolStore'
import { assetToUsd, ASSET_PRICES_USD } from '@/lib/chains'
import { formatUsd, formatPercent, priceImpactSeverity, sleep } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { AmountField } from '@/components/ui/AmountField'
import { Banner } from '@/components/ui/Banner'
import { Tooltip } from '@/components/ui/Tooltip'
import { WalletChip } from '@/components/WalletChip'
import { ReceiptCard } from '@/components/ReceiptCard'
import { useToast } from '@/components/ui/Toast'

const STELLAR_ASSETS = ['XLM', 'USDC', 'USDT', 'wETH', 'wSOL']

function getPriceImpact(inputAmount: string, inputAsset: string, outputAsset: string): number {
  const pool = MOCK_POOLS.find(
    (p) =>
      (p.tokenA === inputAsset && p.tokenB === outputAsset) ||
      (p.tokenA === outputAsset && p.tokenB === inputAsset)
  )
  if (!pool) return 0
  const inputUsd = assetToUsd(inputAmount, inputAsset)
  return Math.min((inputUsd / pool.tvl) * 100 * 100, 25)
}

function getOutputAmount(inputAmount: string, inputAsset: string, outputAsset: string): string {
  const inputNum = parseFloat(inputAmount)
  if (!inputNum) return ''
  const inputPrice = ASSET_PRICES_USD[inputAsset] ?? 1
  const outputPrice = ASSET_PRICES_USD[outputAsset] ?? 1
  const gross = (inputNum * inputPrice) / outputPrice
  const impact = getPriceImpact(inputAmount, inputAsset, outputAsset)
  return (gross * (1 - impact / 100) * 0.997).toFixed(6)
}

type SwapStep = 'form' | 'review' | 'confirming' | 'done'

export function Swap() {
  const { t } = useTranslation()
  const { mode } = useAppStore()
  const { wallets, connectWallet } = useWalletStore()
  const { toast } = useToast()

  const [step, setStep] = useState<SwapStep>('form')
  const [inputAsset, setInputAsset] = useState('XLM')
  const [outputAsset, setOutputAsset] = useState('USDC')
  const [inputAmount, setInputAmount] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [showSettings, setShowSettings] = useState(false)

  const stellarWallet = wallets.stellar
  const inputBalance = stellarWallet?.balances[inputAsset] ?? '0'

  // Debounce quote calculations so they don't fire on every keystroke
  const debouncedAmount = useDebounce(inputAmount, 250)

  const outputAmount = getOutputAmount(debouncedAmount, inputAsset, outputAsset)
  const priceImpact = getPriceImpact(debouncedAmount, inputAsset, outputAsset)
  const severity = priceImpactSeverity(priceImpact)
  const feeAmount = debouncedAmount ? (parseFloat(debouncedAmount) * 0.003).toFixed(4) : '0'
  const feeUsd = formatUsd(assetToUsd(feeAmount, inputAsset))

  const inputUsd = formatUsd(assetToUsd(inputAmount, inputAsset))
  const outputUsd = formatUsd(assetToUsd(outputAmount, outputAsset))

  function flip() {
    setInputAsset(outputAsset)
    setOutputAsset(inputAsset)
    setInputAmount(outputAmount)
  }

  const pool = MOCK_POOLS.find(
    (p) =>
      (p.tokenA === inputAsset && p.tokenB === outputAsset) ||
      (p.tokenA === outputAsset && p.tokenB === inputAsset)
  )

  async function confirmSwap() {
    setStep('confirming')
    await sleep(1800)
    setStep('done')
    toast({
      type: 'success',
      title: 'Swap complete!',
      description: `${inputAmount} ${inputAsset} → ${outputAmount} ${outputAsset}`,
    })
  }

  const minReceived = outputAmount
    ? (parseFloat(outputAmount) * (1 - parseFloat(slippage) / 100)).toFixed(6)
    : ''

  if (step === 'done') {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ReceiptCard
            title="Swap complete"
            status="completed"
            rows={[
              { label: t('swap.youPay'), value: `${inputAmount} ${inputAsset}` + ` (${inputUsd})`, highlight: true },
              { label: t('swap.youReceive'), value: `${outputAmount} ${outputAsset}` + ` (${outputUsd})`, highlight: true },
              { label: 'Pool fee', value: `${feeAmount} ${inputAsset} (${feeUsd})` },
              { label: t('swap.priceImpact'), value: formatPercent(priceImpact) },
              { label: 'Route', value: pool ? `${pool.tokenA}/${pool.tokenB} pool` : 'Direct' },
            ]}
            txHashDest="STELLAR_TX_HASH_DEMO"
            timestamp={Date.now()}
            onExport={() => {}}
          />
        </motion.div>
        <Button fullWidth variant="secondary" onClick={() => { setStep('form'); setInputAmount('') }}>
          Swap again
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">{t('swap.title')}</h1>
        {mode === 'pro' && (
          <button
            onClick={() => setShowSettings((s) => !s)}
            aria-label="Swap settings"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-bg-elevated transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Pro settings panel */}
      {mode === 'pro' && showSettings && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Card padding="md" className="space-y-3">
            <p className="text-xs font-medium text-gray-300">{t('swap.slippage')}</p>
            <div className="flex gap-2">
              {['0.1', '0.5', '1.0'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  aria-pressed={slippage === s}
                  className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                    slippage === s
                      ? 'border-violet bg-violet/15 text-white'
                      : 'border-bg-border text-gray-400 hover:border-violet/40'
                  }`}
                >
                  {s}%
                </button>
              ))}
              <input
                type="text"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="w-16 px-2 py-1 rounded-lg border border-bg-border bg-bg-elevated text-xs text-white text-center font-mono"
                aria-label="Custom slippage"
              />
            </div>
          </Card>
        </motion.div>
      )}

      {step === 'form' && (
        <Card padding="lg" className="space-y-2">
          {/* From */}
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {STELLAR_ASSETS.map((a) => (
                <button
                  key={a}
                  onClick={() => { if (a !== outputAsset) setInputAsset(a) }}
                  disabled={a === outputAsset}
                  aria-pressed={inputAsset === a}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-all disabled:opacity-40 ${
                    inputAsset === a
                      ? 'border-violet bg-violet/15 text-white'
                      : 'border-bg-border bg-bg-elevated text-gray-400 hover:border-violet/40'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <AmountField
              id="swap-input"
              label={t('swap.youPay')}
              value={inputAmount}
              onChange={setInputAmount}
              asset={inputAsset}
              balance={inputBalance}
              onMax={() => setInputAmount(inputBalance)}
            />
          </div>

          {/* Flip */}
          <div className="flex justify-center">
            <button
              onClick={flip}
              aria-label="Flip swap direction"
              className="p-2 rounded-full border border-bg-border bg-bg-elevated hover:border-violet/40 text-gray-400 hover:text-white transition-all"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* To */}
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {STELLAR_ASSETS.map((a) => (
                <button
                  key={a}
                  onClick={() => { if (a !== inputAsset) setOutputAsset(a) }}
                  disabled={a === inputAsset}
                  aria-pressed={outputAsset === a}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-all disabled:opacity-40 ${
                    outputAsset === a
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-bg-border bg-bg-elevated text-gray-400 hover:border-gold/40'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
            <AmountField
              id="swap-output"
              label={t('swap.youReceive')}
              value={outputAmount}
              onChange={() => {}}
              asset={outputAsset}
              readOnly
            />
          </div>

          {/* Quote summary */}
          {inputAmount && parseFloat(inputAmount) > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 pt-1">
              <div className="flex justify-between text-xs text-gray-400">
                <Tooltip content={mode === 'simple' ? 'How much the price moves because of your trade' : 'Price impact on constant-product AMM'}>
                  <span className="underline decoration-dotted cursor-help">{t('swap.priceImpact')}</span>
                </Tooltip>
                <span
                  className={`font-mono ${
                    severity === 'high' ? 'text-danger' : severity === 'medium' ? 'text-warning' : 'text-success'
                  }`}
                >
                  {formatPercent(priceImpact)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{t('swap.fee')}</span>
                <span className="font-mono">{feeAmount} {inputAsset} ({feeUsd})</span>
              </div>
              {mode === 'pro' && pool && (
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{t('swap.route')}</span>
                  <span className="font-mono">{pool.tokenA}/{pool.tokenB} — direct pool</span>
                </div>
              )}

              {severity === 'high' && (
                <Banner
                  variant="warning"
                  title={t('swap.highImpactWarning', { threshold: '3' })}
                />
              )}

              {!stellarWallet && (
                <div className="pt-1">
                  <WalletChip chainId="stellar" />
                </div>
              )}
            </motion.div>
          )}

          <Button
            fullWidth
            size="lg"
            variant="primary"
            disabled={!inputAmount || parseFloat(inputAmount) <= 0 || !stellarWallet}
            onClick={() => setStep('review')}
          >
            {t('swap.review')}
          </Button>
        </Card>
      )}

      {step === 'review' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card padding="lg" className="space-y-4">
            <h2 className="font-semibold text-white">{t('swap.review')}</h2>
            <div className="space-y-3">
              {[
                { label: t('swap.youPay'), value: `${inputAmount} ${inputAsset} (${inputUsd})`, highlight: true },
                { label: t('swap.youReceive'), value: `${outputAmount} ${outputAsset} (${outputUsd})`, highlight: true },
                { label: t('swap.priceImpact'), value: formatPercent(priceImpact) },
                { label: t('swap.minReceived'), value: `${minReceived} ${outputAsset}` },
                { label: 'Pool fee (0.3%)', value: `${feeAmount} ${inputAsset} (${feeUsd})` },
              ].map((r) => (
                <div key={r.label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{r.label}</span>
                  <span className={`text-sm font-mono ${r.highlight ? 'text-white font-semibold' : 'text-gray-300'}`}>
                    {r.value}
                  </span>
                </div>
              ))}
            </div>

            {severity === 'high' && (
              <Banner
                variant="warning"
                title={t('swap.highImpactWarning', { threshold: '3' })}
              />
            )}

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep('form')} className="flex-1">
                {t('common.back')}
              </Button>
              <Button
                variant="gold"
                loading={false}
                loadingText="Confirming…"
                onClick={confirmSwap}
                className="flex-1"
              >
                {t('swap.confirm')}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {step === 'confirming' && (
        <Card padding="lg" className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-violet/20 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-violet border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-gray-300">{t('common.confirmInWallet')}</p>
          <p className="text-xs text-gray-500">Submitting to Stellar…</p>
        </Card>
      )}
    </div>
  )
}
