import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatUsd(amount: number, compact = false): string {
  if (compact && amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(1)}M`
  if (compact && amount >= 1_000)
    return `$${(amount / 1_000).toFixed(1)}K`
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatCrypto(
  amount: string | number,
  symbol: string,
  decimals = 4
): string {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(n)) return `— ${symbol}`
  return `${n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })} ${symbol}`
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatAddress(address: string, chars = 6): string {
  if (!address) return ''
  if (address.length <= chars * 2 + 2) return address
  return `${address.slice(0, chars)}…${address.slice(-chars)}`
}

export function formatEta(minutes: number): string {
  if (minutes < 1) return '< 1 min'
  if (minutes < 60) return `~${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`
}

export function priceImpactSeverity(impact: number): 'low' | 'medium' | 'high' {
  if (impact < 1) return 'low'
  if (impact < 3) return 'medium'
  return 'high'
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

export function formatTimestamp(ts: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(ts))
}

export function ilScenario(priceMove: number, depositUsd: number): number {
  // Approximate IL formula for constant product AMM
  const r = 1 + priceMove / 100
  const il = (2 * Math.sqrt(r)) / (1 + r) - 1
  return Math.abs(il * depositUsd)
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
