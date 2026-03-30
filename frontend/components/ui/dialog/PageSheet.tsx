'use client'

import { cn } from '@/lib/cn'
import { Dialog } from '../Dialog'

interface PageSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  headerChildren?: React.ReactNode
  headerRight?: React.ReactNode
  footer?: React.ReactNode
  nested?: boolean
  bodyClassName?: string
  children: React.ReactNode
  className?: string
}

export function PageSheet({
  open,
  onOpenChange,
  title,
  description,
  headerChildren,
  headerRight,
  footer,
  nested = false,
  bodyClassName,
  children,
  className,
}: PageSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} variant="pageSheet">
      <Dialog.Content
        zIndex={nested ? 'z-modal' : 'z-overlay'}
        className={className}
      >
        <Dialog.Header
          title={title}
          description={description}
          showHandle
          headerRight={headerRight}
        />
        {headerChildren && (
          <div className="px-6 pb-2">{headerChildren}</div>
        )}
        <Dialog.Body className={cn('space-y-4', bodyClassName)}>
          {children}
        </Dialog.Body>
        {footer && <Dialog.Footer>{footer}</Dialog.Footer>}
      </Dialog.Content>
    </Dialog>
  )
}
