'use client'

import { cn } from '@/lib/cn'

const VARIANT_STYLES = {
  primary: 'bg-primary/20 text-primary',
  secondary: 'bg-secondary text-on-secondary',
  tertiary: 'bg-tertiary text-on-tertiary',
  muted: 'bg-outline-variant text-on-surface',
} as const

const SIZE_STYLES = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-3 py-1 text-xs',
} as const

interface ChipProps {
  label: string
  variant?: keyof typeof VARIANT_STYLES
  size?: keyof typeof SIZE_STYLES
  className?: string
}

export function Chip({
  label,
  variant = 'primary',
  size = 'sm',
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        'rounded-full font-black uppercase tracking-widest',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      )}
    >
      {label}
    </span>
  )
}
