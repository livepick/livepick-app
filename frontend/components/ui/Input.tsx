'use client'

import { cn } from '@/lib/cn'

interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  className?: string
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  className,
}: InputProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          {label}
        </label>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3',
          'text-on-surface font-body placeholder:text-on-surface-variant/50',
          'focus:border-tertiary focus:shadow-[0_0_10px_rgba(129,236,255,0.2)] focus:outline-none',
          'transition-all',
          error && 'border-error focus:border-error focus:shadow-[0_0_10px_rgba(255,110,132,0.2)]',
        )}
      />
      {error && (
        <span className="text-xs text-error">{error}</span>
      )}
    </div>
  )
}
