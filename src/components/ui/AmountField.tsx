import React from 'react'
import { cn } from '@/lib/utils'
import { formatUsd } from '@/lib/utils'
import { assetToUsd } from '@/lib/chains'
import { useTranslation } from 'react-i18next'

interface AmountFieldProps {
  value: string
  onChange: (v: string) => void
  asset: string
  balance?: string
  label?: string
  readOnly?: boolean
  placeholder?: string
  onMax?: () => void
  error?: string
  className?: string
  id?: string
}

export function AmountField({
  value,
  onChange,
  asset,
  balance,
  label,
  readOnly = false,
  placeholder = '0.00',
  onMax,
  error,
  className,
  id,
}: AmountFieldProps) {
  const { t } = useTranslation()
  const usdValue = value ? assetToUsd(value, asset) : 0

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    if (/^\d*\.?\d*$/.test(v)) onChange(v)
  }

  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <label htmlFor={id} className="text-xs text-gray-400 font-medium">
          {label}
        </label>
      )}
      <div
        className={cn(
          'glass-card-elevated p-4 flex items-center gap-3',
          error && 'border-danger/50',
          readOnly && 'opacity-80'
        )}
      >
        <div className="flex-1 min-w-0">
          <input
            id={id}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={handleChange}
            readOnly={readOnly}
            placeholder={placeholder}
            aria-label={label ?? `${asset} amount`}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-invalid={!!error}
            className="amount-field"
          />
          {usdValue > 0 && (
            <p className="text-xs text-gray-500 mt-0.5 font-mono">
              {t('common.usdValue', { value: formatUsd(usdValue) })}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm">{asset}</span>
          </div>
          {balance !== undefined && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500">
                {t('common.balance')}: {balance}
              </span>
              {onMax && !readOnly && (
                <button
                  type="button"
                  onClick={onMax}
                  className="text-xs text-violet hover:text-violet-300 transition-colors font-medium"
                >
                  {t('common.max')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  )
}
