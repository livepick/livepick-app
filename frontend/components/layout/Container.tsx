/**
 * Container
 *
 * 최대 폭 제한 콘텐츠 래퍼.
 * 수평 패딩만 담당 — 수직 spacing은 호출 측 className으로 주입.
 */

import { cn } from '@/lib/cn'

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** maxWidth override. 기본값: --max-content-width */
  maxWidth?: string
}

export function Container({ className, maxWidth, style, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 md:px-8', className)}
      style={{
        maxWidth: maxWidth ?? 'var(--max-content-width)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
