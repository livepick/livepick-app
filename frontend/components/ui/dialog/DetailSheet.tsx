'use client'

import { cn } from '@/lib/cn'
import { Dialog } from '../Dialog'

interface DetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  titlePrefix?: React.ReactNode
  headerRight?: React.ReactNode
  size?: 'md' | 'lg' | 'xl'
  nested?: boolean
  bodyClassName?: string
  children: React.ReactNode
  className?: string
}

export function DetailSheet({
  open,
  onOpenChange,
  title,
  description,
  titlePrefix,
  headerRight,
  size,
  nested = false,
  bodyClassName,
  children,
  className,
}: DetailSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} variant="sheet">
      <Dialog.Content
        size={size}
        zIndex={nested ? 'z-modal' : 'z-overlay'}
        className={className}
      >
        <Dialog.Header
          title={title}
          description={description}
          showHandle
          headerRight={
            <div className="flex items-center gap-2">
              {titlePrefix}
              {headerRight}
            </div>
          }
        />
        <Dialog.Body className={cn('space-y-3', bodyClassName)}>
          {children}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  )
}
