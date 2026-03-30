'use client'

import { cn } from '@/lib/cn'
import { Dialog } from '../Dialog'

interface FormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  nested?: boolean
  bodyClassName?: string
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function FormSheet({
  open,
  onOpenChange,
  title,
  description,
  size,
  nested = false,
  bodyClassName,
  footer,
  children,
  className,
}: FormSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} variant="formSheet">
      <Dialog.Content
        size={size}
        zIndex={nested ? 'z-modal' : 'z-overlay'}
        className={className}
      >
        <Dialog.Header title={title} description={description} showHandle />
        <Dialog.Body className={cn('space-y-4', bodyClassName)}>
          {children}
        </Dialog.Body>
        {footer && <Dialog.Footer>{footer}</Dialog.Footer>}
      </Dialog.Content>
    </Dialog>
  )
}
