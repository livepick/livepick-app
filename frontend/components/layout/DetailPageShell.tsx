/**
 * DetailPageShell
 *
 * 전체 화면 독립 페이지 공용 셸.
 * 크리에이터 페이지, 이벤트 페이지 등 NavigationLayout 밖에서
 * 사용하는 독립 페이지에 일관된 max-width와 패딩을 적용한다.
 */

import { cn } from '@/lib/cn'

const DETAIL_PAGE_MAX_WIDTH = '720px'

interface DetailPageShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function DetailPageShell({
  className,
  children,
  ...props
}: DetailPageShellProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full min-h-screen bg-background text-on-background px-4 md:px-6',
        className,
      )}
      style={{ maxWidth: DETAIL_PAGE_MAX_WIDTH }}
      {...props}
    >
      {children}
    </div>
  )
}
