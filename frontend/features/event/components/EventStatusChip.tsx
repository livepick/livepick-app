'use client'

import { Chip } from '@/components/ui/Chip'
import type { EventStatus } from '../types'

interface EventStatusChipProps {
  status: EventStatus
  endDate?: string
  className?: string
}

function getDaysUntil(dateStr: string): number {
  const now = new Date()
  const target = new Date(dateStr)
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function EventStatusChip({
  status,
  endDate,
  className,
}: EventStatusChipProps) {
  if (status === 'pending') {
    const daysLeft = endDate ? getDaysUntil(endDate) : 0
    return (
      <Chip
        label={`D-${Math.max(daysLeft, 0)}`}
        variant="tertiary"
        size="sm"
        className={className}
      />
    )
  }

  if (status === 'active') {
    return (
      <Chip
        label="LIVE"
        variant="secondary"
        size="sm"
        className={className}
      />
    )
  }

  return (
    <Chip
      label="마감"
      variant="muted"
      size="sm"
      className={className}
    />
  )
}
