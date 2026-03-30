'use client'

import { cn } from '@/lib/cn'
import { Dialog } from '../Dialog'
import { Button } from '../Button'

interface ConfirmAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel?: () => void
  variant?: 'default' | 'destructive'
  isLoading?: boolean
  className?: string
}

export function ConfirmAlert({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  variant = 'default',
  isLoading = false,
  className,
}: ConfirmAlertProps) {
  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} variant="alert">
      <Dialog.Content className={className}>
        <Dialog.Header
          title={title}
          description={description}
          showClose={false}
        />
        <Dialog.Footer className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              variant === 'destructive' &&
                'bg-error shadow-[0_0_20px_rgba(255,110,132,0.3)]',
            )}
          >
            {isLoading ? '처리 중...' : confirmLabel}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
