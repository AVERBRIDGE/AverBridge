import type { ChainId } from '../store/walletStore'

export type { ChainId, ChainWallet } from '../store/walletStore'
export type { BridgeState, BridgeTransfer } from '../store/bridgeStore'
export type { Pool, LpPosition, HistoricalPoint } from '../store/poolStore'
export type { AppMode } from '../store/appStore'

export interface Asset {
  symbol: string
  name: string
  decimals: number
  logoUrl?: string
  chainId: ChainId
  isNative?: boolean
  contractAddress?: string
}

export interface QuoteResult {
  fromAmount: string
  toAmount: string
  feeAmount: string
  feeUsd: string
  priceImpact: number
  etaMinutes: number
  usdValue: string
  route: RouteStep[]
  minimumReceived: string
}

export interface RouteStep {
  chainId: ChainId
  action: 'lock' | 'bridge' | 'swap' | 'claim'
  label: string
}

export interface SwapQuote {
  inputAmount: string
  outputAmount: string
  minimumOutput: string
  priceImpact: number
  fee: string
  feeUsd: string
  route: string
  spotPrice: string
  usdValue: string
}

export interface NotificationPrefs {
  bridgeClaimable: boolean
  swapComplete: boolean
  aprChange: boolean
  email?: string
  pushEnabled: boolean
}
