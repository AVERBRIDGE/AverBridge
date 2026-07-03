import { useState, useEffect, useRef } from 'react'

export interface PriceData {
  price: number
  change24h: number      // percentage
  changeDir: 'up' | 'down' | 'flat'
  high24h: number
  low24h: number
  volume24h: number
  lastUpdated: number
}

const BASE_PRICES: Record<string, number> = {
  XLM:  0.112,
  ETH:  3420,
  SOL:  152,
  BNB:  590,
  USDC: 1.0,
  USDT: 1.0,
}

function jitter(base: number, pct: number) {
  return base * (1 + (Math.random() - 0.5) * 2 * pct)
}

function buildTick(symbol: string, prev?: PriceData): PriceData {
  const base = BASE_PRICES[symbol] ?? 1
  const price = prev ? jitter(prev.price, 0.002) : jitter(base, 0.01)
  const change24h = prev ? prev.change24h + (Math.random() - 0.5) * 0.1 : (Math.random() - 0.5) * 6
  const dir = change24h > 0.05 ? 'up' : change24h < -0.05 ? 'down' : 'flat'
  return {
    price,
    change24h,
    changeDir: dir,
    high24h: prev ? Math.max(prev.high24h, price) : price * 1.03,
    low24h:  prev ? Math.min(prev.low24h,  price) : price * 0.97,
    volume24h: jitter(base * 4_000_000, 0.05),
    lastUpdated: Date.now(),
  }
}

/**
 * Simulates a live price feed with 8-second ticks.
 * In production replace the tick interval with a real WebSocket/REST call.
 */
export function useLivePrice(symbol: string): PriceData {
  const [data, setData] = useState<PriceData>(() => buildTick(symbol))
  const ref = useRef(data)
  ref.current = data

  useEffect(() => {
    setData(buildTick(symbol))
    const id = setInterval(() => {
      setData((prev) => buildTick(symbol, prev))
    }, 8000)
    return () => clearInterval(id)
  }, [symbol])

  return data
}

/**
 * Platform-wide stats — TVL, volume, bridges, liquidity providers.
 * Simulated; wire to a real backend indexer in production.
 */
export interface PlatformStats {
  tvlUsd: number
  volume24hUsd: number
  totalBridges: number
  totalLps: number
  activePools: number
  uptime: number            // percentage
}

export function usePlatformStats(): PlatformStats {
  const [stats, setStats] = useState<PlatformStats>({
    tvlUsd:        7_550_000,
    volume24hUsd:    800_000,
    totalBridges:      4_821,
    totalLps:            312,
    activePools:           4,
    uptime:            99.97,
  })

  useEffect(() => {
    const id = setInterval(() => {
      setStats((s) => ({
        ...s,
        tvlUsd:      s.tvlUsd + (Math.random() - 0.48) * 10_000,
        volume24hUsd: s.volume24hUsd + (Math.random() - 0.45) * 2_000,
        totalBridges: s.totalBridges + (Math.random() > 0.7 ? 1 : 0),
      }))
    }, 12_000)
    return () => clearInterval(id)
  }, [])

  return stats
}
