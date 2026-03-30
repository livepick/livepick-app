'use client'

import { cn } from '@/lib/cn'

const VARIANT_STYLES = {
  primary:
    'bg-primary text-on-primary rounded-full font-headline font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(243,130,255,0.3)] hover:scale-[1.02] transition-transform',
  secondary:
    'rounded-full border border-outline-variant/20 text-on-surface font-bold uppercase tracking-widest hover:bg-surface-container-high transition-colors',
  ghost: 'text-on-surface hover:text-primary transition-colors',
} as const

const SIZE_STYLES = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
} as const

interface ButtonProps {
  variant?: keyof typeof VARIANT_STYLES
  size?: keyof typeof SIZE_STYLES
  fullWidth?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  )
}
