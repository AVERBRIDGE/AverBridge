import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatAddress } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface CopyableIdProps {
  value: string
  label?: string
  short?: boolean
  className?: string
}

export function CopyableId({ value, label, short = true, className }: CopyableIdProps) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const display = short ? formatAddress(value) : value

  return (
    <button
      onClick={copy}
      title={copied ? t('common.copied') : t('common.copy')}
      aria-label={`${t('common.copy')} ${label ?? 'address'}: ${value}`}
      className={cn(
        'inline-flex items-center gap-1.5 font-mono text-xs text-gray-400 hover:text-white transition-colors',
        className
      )}
    >
      <span>{display}</span>
      {copied ? (
        <Check className="w-3 h-3 text-success" aria-hidden />
      ) : (
        <Copy className="w-3 h-3" aria-hidden />
      )}
    </button>
  )
}
