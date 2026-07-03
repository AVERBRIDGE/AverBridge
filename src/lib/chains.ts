import type { ChainId } from '../store/walletStore'

export interface ChainConfig {
  id: ChainId
  name: string
  shortName: string
  nativeCurrency: string
  explorerUrl: string
  rpcUrls: string[]
  color: string
  logoEmoji: string
  isStellar: boolean
  assets: string[]
}

export const CHAINS: Record<ChainId, ChainConfig> = {
  stellar: {
    id: 'stellar',
    name: 'Stellar',
    shortName: 'Stellar',
    nativeCurrency: 'XLM',
    explorerUrl: 'https://stellar.expert/explorer/testnet',
    rpcUrls: ['https://horizon-testnet.stellar.org'],
    color: '#7C5CFF',
    logoEmoji: '✦',
    isStellar: true,
    assets: ['XLM', 'USDC', 'USDT', 'wETH', 'wSOL', 'wBNB'],
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    shortName: 'ETH',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrls: [
      'https://sepolia.infura.io/v3/placeholder',
      'https://rpc.sepolia.org',
    ],
    color: '#627EEA',
    logoEmoji: '◆',
    isStellar: false,
    assets: ['ETH', 'USDC', 'USDT'],
  },
  solana: {
    id: 'solana',
    name: 'Solana',
    shortName: 'SOL',
    nativeCurrency: 'SOL',
    explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
    rpcUrls: ['https://api.devnet.solana.com'],
    color: '#9945FF',
    logoEmoji: '●',
    isStellar: false,
    assets: ['SOL', 'USDC'],
  },
  bnb: {
    id: 'bnb',
    name: 'BNB Chain',
    shortName: 'BNB',
    nativeCurrency: 'BNB',
    explorerUrl: 'https://testnet.bscscan.com',
    rpcUrls: [
      'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
      'https://data-seed-prebsc-2-s1.bnbchain.org:8545',
    ],
    color: '#F3BA2F',
    logoEmoji: '⬡',
    isStellar: false,
    assets: ['BNB', 'USDC', 'USDT'],
  },
}

export const SPOKE_CHAINS: ChainId[] = ['ethereum', 'solana', 'bnb']

export const CHAIN_ORDER: ChainId[] = ['stellar', 'ethereum', 'solana', 'bnb']

export function getChain(id: ChainId): ChainConfig {
  return CHAINS[id]
}

export const BRIDGE_ASSETS: Record<string, { from: string; toStellar: string }> = {
  'ethereum:ETH': { from: 'ETH', toStellar: 'wETH' },
  'ethereum:USDC': { from: 'USDC', toStellar: 'USDC' },
  'ethereum:USDT': { from: 'USDT', toStellar: 'USDT' },
  'solana:SOL': { from: 'SOL', toStellar: 'wSOL' },
  'solana:USDC': { from: 'USDC', toStellar: 'USDC' },
  'bnb:BNB': { from: 'BNB', toStellar: 'wBNB' },
  'bnb:USDC': { from: 'USDC', toStellar: 'USDC' },
  'bnb:USDT': { from: 'USDT', toStellar: 'USDT' },
}

export const ASSET_PRICES_USD: Record<string, number> = {
  XLM: 0.112,
  USDC: 1.0,
  USDT: 1.0,
  ETH: 3_420.0,
  wETH: 3_420.0,
  SOL: 152.0,
  wSOL: 152.0,
  BNB: 590.0,
  wBNB: 590.0,
}

export function assetToUsd(amount: string | number, asset: string): number {
  const price = ASSET_PRICES_USD[asset] ?? 0
  const n = typeof amount === 'string' ? parseFloat(amount) : amount
  return isNaN(n) ? 0 : n * price
}
