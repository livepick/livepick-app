/**
 * SectionHeader
 *
 * 페이지/섹션 제목 블록. level에 따라 h1(page) 또는 h2(section) 렌더.
 * 각 페이지마다 중복되던 header 마크업을 규격화.
 */

import { cn } from '@/lib/cn'

interface SectionHeaderProps {
  /** page = h1 (큰 제목), section = h2 (섹션 제목) */
  level: 'page' | 'section'
  /** 제목 텍스트 또는 JSX (accent 색상 span 등) */
  title: React.ReactNode
  /** 부제목 (선택) */
  subtitle?: string
  className?: string
}

export function SectionHeader({ level, title, subtitle, className }: SectionHeaderProps) {
  return (
    <header className={cn(className)}>
      {level === 'page' ? (
        <h1 className="font-headline text-4xl md:text-6xl font-black tracking-tighter text-on-background mb-2">
          {title}
        </h1>
      ) : (
        <h2 className="font-headline text-2xl font-bold">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="font-body text-on-surface-variant text-sm uppercase tracking-widest">
          {subtitle}
        </p>
      )}
    </header>
  )
}
