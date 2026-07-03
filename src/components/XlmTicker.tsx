import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react'
import { useLivePrice } from '@/hooks/useLivePrice'
import { formatUsd } from '@/lib/utils'

function AnimatedPrice({ value, symbol }: { value: number; symbol: string }) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const prev = useRef(value)

  useEffect(() => {
    if (value !== prev.current) {
      setFlash(value > prev.current ? 'up' : 'down')
      prev.current = value
      const t = setTimeout(() => setFlash(null), 700)
      return () => clearTimeout(t)
    }
  }, [value])

  const flashColor = flash === 'up' ? 'text-success' : flash === 'down' ? 'text-danger' : ''

  return (
    <span className={`font-mono font-semibold transition-colors duration-700 ${flashColor || 'text-white'}`}>
      {formatUsd(value)}
    </span>
  )
}

export function XlmTicker() {
  const data = useLivePrice('XLM')
  const isUp = data.changeDir === 'up'
  const isDown = data.changeDir === 'down'

  return (
    <div
      className="fixed bottom-4 left-4 z-50 glass-card px-3 py-2.5 flex items-center gap-2.5 shadow-glow"
      role="status"
      aria-label={`XLM price: ${formatUsd(data.price)}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Pulsing live dot */}
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-violet" />
      </span>

      {/* Token badge */}
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-violet/20 border border-violet/30 flex items-center justify-center text-2xs font-bold text-violet">
          ✦
        </div>
        <span className="text-xs font-medium text-gray-300">XLM</span>
      </div>

      <div className="w-px h-4 bg-bg-border" aria-hidden />

      {/* Price */}
      <AnimatedPrice value={data.price} symbol="XLM" />

      {/* 24h change */}
      <div className={`flex items-center gap-0.5 text-xs font-mono ${
        isUp ? 'text-success' : isDown ? 'text-danger' : 'text-gray-500'
      }`}>
        {isUp ? (
          <TrendingUp className="w-3 h-3" aria-hidden />
        ) : isDown ? (
          <TrendingDown className="w-3 h-3" aria-hidden />
        ) : (
          <Minus className="w-3 h-3" aria-hidden />
        )}
        <span>{data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%</span>
      </div>

      {/* 24h range — visible on wider screens */}
      <div className="hidden sm:flex items-center gap-1 text-2xs text-gray-600 border-l border-bg-border pl-2">
        <span>{formatUsd(data.low24h)}</span>
        <span>–</span>
        <span>{formatUsd(data.high24h)}</span>
        <span className="text-gray-700">24h</span>
      </div>
    </div>
  )
}
