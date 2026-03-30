'use client'

import { cn } from '@/lib/cn'

const VARIANT_STYLES = {
  default: 'bg-primary/20 text-primary',
  success: 'bg-secondary/20 text-secondary',
  warning: 'bg-error/20 text-error',
} as const

interface BadgeProps {
  children: React.ReactNode
  variant?: keyof typeof VARIANT_STYLES
  className?: string
}

export function Badge({
  children,
  variant = 'default',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
