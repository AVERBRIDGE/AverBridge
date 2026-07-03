import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, LogOut, AlertTriangle } from 'lucide-react'
import { useWalletStore, type ChainId } from '@/store/walletStore'
import { getChain } from '@/lib/chains'
import { formatAddress } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Badge } from './ui/Badge'

interface WalletChipProps {
  chainId: ChainId
  compact?: boolean
}

export function WalletChip({ chainId, compact = false }: WalletChipProps) {
  const { t } = useTranslation()
  const { wallets, connecting, connectWallet, disconnectWallet } = useWalletStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const wallet = wallets[chainId]
  const chain = getChain(chainId)
  const isConnecting = connecting === chainId

  if (!wallet) {
    return (
      <button
        onClick={() => connectWallet(chainId)}
        disabled={isConnecting}
        aria-label={t('wallet.connectChain', { chain: chain.name })}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border',
          'border-bg-border bg-bg-elevated hover:border-violet/40 hover:bg-bg-elevated',
          'text-sm text-gray-400 hover:text-white transition-all duration-150',
          isConnecting && 'opacity-70 cursor-wait'
        )}
      >
        <span style={{ color: chain.color }} aria-hidden>{chain.logoEmoji}</span>
        <span>{isConnecting ? 'Connecting…' : compact ? chain.shortName : t('wallet.connect')}</span>
      </button>
    )
  }

  if (wallet.wrongNetwork) {
    return (
      <button
        onClick={() => connectWallet(chainId)}
        aria-label={t('wallet.wrongNetwork')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-warning/30 bg-warning/10 text-warning text-sm"
      >
        <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
        <span>{t('wallet.wrongNetwork')}</span>
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label={`${chain.name} wallet: ${wallet.address}`}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border',
          'border-bg-border bg-bg-elevated hover:border-violet/40',
          'text-sm text-gray-300 hover:text-white transition-all duration-150'
        )}
      >
        <span style={{ color: chain.color }} aria-hidden>{chain.logoEmoji}</span>
        <Badge variant="success" dot className="text-2xs">
          {formatAddress(wallet.address, 4)}
        </Badge>
        <ChevronDown className={cn('w-3 h-3 transition-transform', menuOpen && 'rotate-180')} aria-hidden />
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 glass-card p-2 min-w-[160px] z-30"
        >
          <button
            role="menuitem"
            onClick={() => {
              disconnectWallet(chainId)
              setMenuOpen(false)
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-danger hover:bg-danger/5 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" aria-hidden />
            {t('wallet.disconnect')}
          </button>
        </div>
      )}
    </div>
  )
}
