import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, Shield, ExternalLink, FileCheck } from 'lucide-react'
import { CHAINS } from '@/lib/chains'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Banner } from '@/components/ui/Banner'
import { CopyableId } from '@/components/ui/CopyableId'
import { cn } from '@/lib/utils'

interface AccordionItem {
  id: string
  title: string
  content: string
  badge?: { label: string; variant: 'success' | 'warning' | 'info' | 'gold' }
}

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    id: 'bridging',
    title: 'How bridging works',
    content: 'When you bridge, your assets are locked on the source chain by a smart contract. The same value is made available on Stellar. The lock can only be released by you claiming your Stellar assets — or by an automatic refund if the transfer doesn\'t complete in time. No validator, no admin key can ever move your funds. It\'s either you claim, or you get a refund.',
  },
  {
    id: 'pools',
    title: 'How pools and earnings work',
    content: 'Liquidity pools hold two assets. Traders swap against the pool and pay a small fee (e.g. 0.3%). That fee goes to people who deposited — you earn a share of every trade in proportion to your deposit. The APR shown is an estimate based on the last 7 days of actual trading fees. It changes as trading volume changes.',
  },
  {
    id: 'il',
    title: 'What is price-change risk?',
    content: 'When prices shift between the two assets in a pool, your share may be worth a bit less than if you\'d held them separately. This is called "impermanent loss" — we call it price-change risk because it\'s not permanent, and the fees you earn often offset it over time. Example: if XLM moves up 50% vs USDC, your pool position would be worth about 5.7% less than if you\'d just held both separately. This can change as prices move, and withdrawing resets the clock.',
  },
  {
    id: 'security',
    title: 'Security model',
    content: 'Bridge contracts use a hash-time-lock (HTLC) design: funds are locked with a cryptographic secret and a deadline. The only outcomes are: (1) you claim your funds on Stellar by revealing the secret, or (2) the deadline passes and your source-chain funds are automatically returned. No admin, no multisig, no validator set can intercept your funds. AMM contracts are standard constant-product pools — the same math used by Uniswap v2.',
  },
  {
    id: 'bridgedAssets',
    title: 'About bridged assets',
    content: 'Assets bridged from other chains arrive on Stellar as tokens issued by a trusted anchor or wrapped-asset issuer. For example, bridged ETH becomes "wETH" on Stellar — a token backed 1:1 by locked ETH. These tokens represent a claim on the underlying asset. The trust model is the issuer\'s custodial honesty. We disclose each issuer openly in the contract addresses below. Note: bridged assets are not identical in risk to holding native assets.',
  },
  {
    id: 'audit',
    title: 'Audit status',
    content: 'We are currently in practice mode (testnet). All bridge and AMM contracts are pending independent security audit. Mainnet will only launch after a clean audit from a recognized firm, with all critical findings resolved. Audit reports will be published here when complete. Practice mode is safe to use — testnet funds have no real value.',
    badge: { label: 'Audit pending', variant: 'warning' },
  },
]

const CONTRACT_ADDRESSES = [
  { chain: 'stellar', name: 'AMM Pool (XLM/USDC)', address: 'CDEMO_XLM_USDC_POOL_ADDRESS' },
  { chain: 'stellar', name: 'AMM Pool (XLM/USDT)', address: 'CDEMO_XLM_USDT_POOL_ADDRESS' },
  { chain: 'stellar', name: 'Bridge Claim Contract', address: 'CDEMO_STELLAR_BRIDGE' },
  { chain: 'ethereum', name: 'Bridge Lock Contract', address: '0xDEMO_ETH_BRIDGE_CONTRACT' },
  { chain: 'solana', name: 'Bridge Lock Program', address: 'DEMO_SOLANA_BRIDGE_PROGRAM_ID' },
  { chain: 'bnb', name: 'Bridge Lock Contract', address: '0xDEMO_BNB_BRIDGE_CONTRACT' },
]

function AccordionRow({ item }: { item: AccordionItem }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-bg-border last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-bg-elevated/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-white text-sm">{item.title}</span>
          {item.badge && (
            <Badge variant={item.badge.variant}>{item.badge.label}</Badge>
          )}
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-gray-500 shrink-0 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm text-gray-300 leading-relaxed">{item.content}</p>
        </div>
      )}
    </div>
  )
}

export function Help() {
  const { t } = useTranslation()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-violet" aria-hidden />
        <h1 className="text-xl font-semibold text-white">{t('help.title')}</h1>
      </div>

      <Banner
        variant="info"
        title="Practice mode is safe"
        description="You're on testnet — all transactions use practice funds with no real value."
      />

      {/* Accordion */}
      <Card padding="none">
        {ACCORDION_ITEMS.map((item) => (
          <AccordionRow key={item.id} item={item} />
        ))}
      </Card>

      {/* Contract addresses */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-gray-300 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-violet" />
          Contract addresses (testnet)
        </h2>
        <Card padding="none">
          <div className="divide-y divide-bg-border">
            {CONTRACT_ADDRESSES.map((c, i) => {
              const chain = CHAINS[c.chain as keyof typeof CHAINS]
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <span style={{ color: chain.color }} className="shrink-0" aria-hidden>
                    {chain.logoEmoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400">{c.name}</p>
                    <CopyableId value={c.address} short={false} className="mt-0.5 truncate max-w-full" />
                  </div>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-violet transition-colors"
                    aria-label={`View ${c.name} on explorer`}
                    onClick={(e) => e.preventDefault()}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-600 text-center leading-relaxed">
        {t('help.notFinancialAdvice')}
      </p>
    </div>
  )
}
