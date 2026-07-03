import React, { useState } from 'react'
import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTranslation } from 'react-i18next'
import type { HistoricalPoint } from '@/store/poolStore'
import { formatUsd } from '@/lib/utils'
import { Button } from '../ui/Button'

interface AreaChartProps {
  data: HistoricalPoint[]
  label: string
  color?: string
  formatValue?: (v: number) => string
  accessibleTableLabel?: string
}

function formatDate(ts: number) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(ts))
}

export function AreaChart({
  data,
  label,
  color = '#7C5CFF',
  formatValue = (v) => formatUsd(v),
  accessibleTableLabel,
}: AreaChartProps) {
  const { t } = useTranslation()
  const [showTable, setShowTable] = useState(false)
  const gradientId = `gradient-${label.replace(/\s/g, '')}`

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{label}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowTable((s) => !s)}
          aria-pressed={showTable}
          className="text-xs"
        >
          {showTable ? t('common.hideTable') : t('common.viewAsTable')}
        </Button>
      </div>

      {showTable ? (
        <div className="overflow-auto max-h-48">
          <table className="w-full text-xs" aria-label={accessibleTableLabel ?? label}>
            <thead>
              <tr className="border-b border-bg-border">
                <th className="text-left py-1.5 text-gray-400 font-medium">Date</th>
                <th className="text-right py-1.5 text-gray-400 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-b border-bg-border/50">
                  <td className="py-1.5 text-gray-400">{formatDate(d.timestamp)}</td>
                  <td className="py-1.5 text-right font-mono text-gray-200">
                    {formatValue(d.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div aria-hidden>
          <ResponsiveContainer width="100%" height={140}>
            <ReAreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatDate}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={formatValue}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid #1E2D45',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(ts: unknown) => formatDate(ts as number)}
                formatter={(v: unknown) => [formatValue(v as number), label]}
                labelStyle={{ color: '#9CA3AF' }}
                itemStyle={{ color: color }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: color }}
              />
            </ReAreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
