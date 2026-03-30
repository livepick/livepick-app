/**
 * PageContent
 *
 * Container + 하단 패딩. 페이지 콘텐츠 표준 래퍼.
 * SectionHeader 하위에서 사용.
 */

import { cn } from '@/lib/cn'
import { Container } from './Container'

interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Container maxWidth override */
  maxWidth?: string
}

export function PageContent({ className, maxWidth, children, ...props }: PageContentProps) {
  return (
    <Container
      maxWidth={maxWidth}
      className={cn('pb-4 md:pb-8', className)}
      {...props}
    >
      {children}
    </Container>
  )
}
