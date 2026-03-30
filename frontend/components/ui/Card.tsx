'use client'

import { cn } from '@/lib/cn'

const VARIANT_STYLES = {
  default: 'bg-surface-container-high rounded-xl p-6',
  glass: 'glass-card rounded-xl p-6',
} as const

interface CardProps {
  variant?: keyof typeof VARIANT_STYLES
  hover?: boolean
  className?: string
  children: React.ReactNode
}

export function Card({
  variant = 'default',
  hover = false,
  className,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        VARIANT_STYLES[variant],
        hover && 'hover:-translate-y-1 transition-all duration-300',
        className,
      )}
    >
      {children}
    </div>
  )
}
