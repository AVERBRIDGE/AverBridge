import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlaskConical, CheckCircle, Droplets } from 'lucide-react'
import { useWalletStore } from '@/store/walletStore'
import { CHAINS, CHAIN_ORDER } from '@/lib/chains'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Banner } from '@/components/ui/Banner'
import { WalletChip } from '@/components/WalletChip'
import { useToast } from '@/components/ui/ToastContext'
import { sleep } from '@/lib/utils'

const FAUCET_ASSETS: Record<string, { assets: string[]; amounts: string[] }> = {
  stellar: { assets: ['XLM', 'USDC', 'USDT'], amounts: ['10000', '500', '500'] },
  ethereum: { assets: ['ETH', 'USDC'], amounts: ['1', '1000'] },
  solana: { assets: ['SOL', 'USDC'], amounts: ['20', '500'] },
  bnb: { assets: ['BNB', 'USDC'], amounts: ['5', '500'] },
}

export function Practice() {
  const { t } = useTranslation()
  const { wallets, connectWallet, setBalance } = useWalletStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)
  const [received, setReceived] = useState<Set<string>>(new Set())

  async function requestFunds(chainId: string, asset: string, amount: string) {
    const key = `${chainId}-${asset}`
    setLoading(key)
    await sleep(1200)

    // Connect if not connected
    if (!wallets[chainId as keyof typeof wallets]) {
      await connectWallet(chainId as 'stellar' | 'ethereum' | 'solana' | 'bnb')
    }

    setBalance(chainId as 'stellar' | 'ethereum' | 'solana' | 'bnb', asset, amount)
    setReceived((s) => new Set([...s, key]))
    setLoading(null)
    toast({
      type: 'success',
      title: t('practice.requested', { asset }),
      description: t('practice.faucetNote'),
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <FlaskConical className="w-10 h-10 text-cyan mx-auto" aria-hidden />
        <h1 className="text-2xl font-semibold text-white">{t('practice.title')}</h1>
        <p className="text-gray-400">{t('practice.desc')}</p>
      </div>

      <Banner
        variant="info"
        title="Practice mode — no real money"
        description="All assets here are on test networks and have zero real-world value. Safe to try anything."
      />

      <div className="space-y-3">
        {CHAIN_ORDER.map((chainId) => {
          const chain = CHAINS[chainId]
          const faucet = FAUCET_ASSETS[chainId]
          const wallet = wallets[chainId]

          return (
            <Card key={chainId} padding="lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span style={{ color: chain.color }} className="text-lg" aria-hidden>
                    {chain.logoEmoji}
                  </span>
                  <CardTitle>{chain.name}</CardTitle>
                  {wallet && <Badge variant="success" dot>Connected</Badge>}
                </div>
                {!wallet && <WalletChip chainId={chainId} />}
              </CardHeader>

              <div className="space-y-2">
                {faucet.assets.map((asset, i) => {
                  const key = `${chainId}-${asset}`
                  const done = received.has(key)
                  return (
                    <div key={asset} className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-bg-border">
                      <div>
                        <p className="text-sm font-medium text-white">{faucet.amounts[i]} {asset}</p>
                        <p className="text-xs text-gray-500">Practice funds, no real value</p>
                      </div>
                      {done ? (
                        <Badge variant="success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Received!
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          leftIcon={<Droplets className="w-3.5 h-3.5" />}
                          loading={loading === key}
                          loadingText="Sending…"
                          onClick={() => requestFunds(chainId, asset, faucet.amounts[i])}
                        >
                          {t('practice.requestFunds', { asset })}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
