'use client'

import { cn } from '@/lib/cn'

const SIZE_STYLES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
} as const

interface AvatarProps {
  src?: string
  alt: string
  size?: keyof typeof SIZE_STYLES
  fallback?: string
  className?: string
}

export function Avatar({
  src,
  alt,
  size = 'md',
  fallback,
  className,
}: AvatarProps) {
  const initials = fallback ?? alt.charAt(0).toUpperCase()

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0',
        SIZE_STYLES[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-surface-container-highest flex items-center justify-center font-headline font-bold text-on-surface-variant">
          {initials}
        </div>
      )}
    </div>
  )
}
