import React from 'react'
import { ArrowRight } from 'lucide-react'
import { getChain, CHAINS } from '@/lib/chains'
import type { ChainId } from '@/store/walletStore'
import { cn } from '@/lib/utils'

interface ChainRouteVisualizerProps {
  fromChain: ChainId
  toChain: ChainId
  fromAsset: string
  toAsset: string
  className?: string
}

export function ChainRouteVisualizer({
  fromChain,
  toChain,
  fromAsset,
  toAsset,
  className,
}: ChainRouteVisualizerProps) {
  const from = getChain(fromChain)
  const stellar = CHAINS.stellar
  const to = getChain(toChain)
  const showStellarHub = fromChain !== 'stellar' && toChain !== 'stellar'

  const steps: { chain: typeof from; asset: string }[] = [
    { chain: from, asset: fromAsset },
    ...(showStellarHub ? [{ chain: stellar, asset: toAsset }] : []),
    { chain: to, asset: toAsset },
  ]

  return (
    <div
      className={cn('flex items-center gap-2 overflow-x-auto', className)}
      aria-label={`Transfer route: ${from.name} to ${to.name} via Stellar`}
    >
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <ArrowRight
              className="w-4 h-4 text-gray-600 shrink-0"
              aria-hidden
            />
          )}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border"
              style={{
                borderColor: step.chain.color + '66',
                backgroundColor: step.chain.color + '22',
                color: step.chain.color,
              }}
              aria-hidden
            >
              {step.chain.logoEmoji}
            </div>
            <span className="text-2xs text-gray-500">{step.chain.shortName}</span>
            <span className="text-2xs text-gray-400 font-mono">{step.asset}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
