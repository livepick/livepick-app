'use client'

import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  icon: LucideIcon
  iconColor?: string
  label: string
  value: string
  trend?: string
  trendPositive?: boolean
}

export function MetricCard({
  icon: Icon,
  iconColor = 'text-primary',
  label,
  value,
  trend,
  trendPositive = true,
}: MetricCardProps) {
  return (
    <div className="bg-surface-container-low p-6 rounded-2xl">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-surface-container-high rounded-lg">
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-bold',
              trendPositive ? 'text-secondary' : 'text-error',
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-on-surface-variant mb-1">{label}</p>
      <h3 className="font-headline text-2xl font-bold text-on-surface">
        {value}
      </h3>
    </div>
  )
}
