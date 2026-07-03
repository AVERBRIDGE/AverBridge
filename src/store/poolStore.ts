import { create } from 'zustand'

export interface Pool {
  id: string
  tokenA: string
  tokenB: string
  tvl: number
  tvlUsd: string
  volume24h: number
  volume24hUsd: string
  feeTier: number // e.g. 0.003 = 0.3%
  feeApr: number
  rewardApr: number
  totalApr: number
  priceAtoB: number
  priceBtoA: number
  featured: boolean
  liquidity: number
}

export interface LpPosition {
  poolId: string
  depositedUsd: number
  currentUsd: number
  feesEarned: number
  poolShare: number // 0–1
  depositedAt: number
  tokenAAmount: string
  tokenBAmount: string
  claimableRewards: number
}

export interface HistoricalPoint {
  timestamp: number
  value: number
}

interface PoolStoreState {
  pools: Pool[]
  positions: LpPosition[]
  hasSeenILExplainer: Record<string, boolean>
  addPosition: (pos: LpPosition) => void
  updatePosition: (poolId: string, updates: Partial<LpPosition>) => void
  removePosition: (poolId: string) => void
  markILExplainerSeen: (poolId: string) => void
  getPool: (id: string) => Pool | undefined
  getPosition: (poolId: string) => LpPosition | undefined
}

export const MOCK_POOLS: Pool[] = [
  {
    id: 'xlm-usdc',
    tokenA: 'XLM',
    tokenB: 'USDC',
    tvl: 4_200_000,
    tvlUsd: '$4.2M',
    volume24h: 380_000,
    volume24hUsd: '$380K',
    feeTier: 0.003,
    feeApr: 9.8,
    rewardApr: 4.4,
    totalApr: 14.2,
    priceAtoB: 0.112,
    priceBtoA: 8.928,
    featured: true,
    liquidity: 4_200_000,
  },
  {
    id: 'xlm-usdt',
    tokenA: 'XLM',
    tokenB: 'USDT',
    tvl: 1_800_000,
    tvlUsd: '$1.8M',
    volume24h: 145_000,
    volume24hUsd: '$145K',
    feeTier: 0.003,
    feeApr: 7.1,
    rewardApr: 3.2,
    totalApr: 10.3,
    priceAtoB: 0.111,
    priceBtoA: 9.0,
    featured: true,
    liquidity: 1_800_000,
  },
  {
    id: 'usdc-usdt',
    tokenA: 'USDC',
    tokenB: 'USDT',
    tvl: 900_000,
    tvlUsd: '$900K',
    volume24h: 220_000,
    volume24hUsd: '$220K',
    feeTier: 0.0005,
    feeApr: 11.2,
    rewardApr: 0,
    totalApr: 11.2,
    priceAtoB: 1.0002,
    priceBtoA: 0.9998,
    featured: false,
    liquidity: 900_000,
  },
  {
    id: 'xlm-eth-bridge',
    tokenA: 'XLM',
    tokenB: 'wETH',
    tvl: 650_000,
    tvlUsd: '$650K',
    volume24h: 55_000,
    volume24hUsd: '$55K',
    feeTier: 0.005,
    feeApr: 5.3,
    rewardApr: 6.1,
    totalApr: 11.4,
    priceAtoB: 0.0000327,
    priceBtoA: 30_578,
    featured: false,
    liquidity: 650_000,
  },
]

export function generateMockHistory(baseValue: number, points = 30): HistoricalPoint[] {
  const now = Date.now()
  const day = 86_400_000
  return Array.from({ length: points }, (_, i) => ({
    timestamp: now - (points - i) * day,
    value: baseValue * (0.8 + Math.random() * 0.4),
  }))
}

export const usePoolStore = create<PoolStoreState>((set, get) => ({
  pools: MOCK_POOLS,
  positions: [],
  hasSeenILExplainer: {},

  addPosition: (pos) =>
    set((s) => ({
      positions: [
        ...s.positions.filter((p) => p.poolId !== pos.poolId),
        pos,
      ],
    })),

  updatePosition: (poolId, updates) =>
    set((s) => ({
      positions: s.positions.map((p) =>
        p.poolId === poolId ? { ...p, ...updates } : p
      ),
    })),

  removePosition: (poolId) =>
    set((s) => ({
      positions: s.positions.filter((p) => p.poolId !== poolId),
    })),

  markILExplainerSeen: (poolId) =>
    set((s) => ({
      hasSeenILExplainer: { ...s.hasSeenILExplainer, [poolId]: true },
    })),

  getPool: (id) => get().pools.find((p) => p.id === id),
  getPosition: (poolId) => get().positions.find((p) => p.poolId === poolId),
}))
