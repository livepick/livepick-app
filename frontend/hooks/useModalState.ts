'use client'

import { useState, useCallback } from 'react'

interface UseModalStateReturn<T> {
  open: boolean
  data: T | undefined
  openModal: (data?: T) => void
  closeModal: () => void
  dialogProps: {
    open: boolean
    onOpenChange: (open: boolean) => void
  }
}

export function useModalState<T = undefined>(): UseModalStateReturn<T> {
  const [open, setOpen] = useState(false)
  const [data, setData] = useState<T | undefined>(undefined)

  const openModal = useCallback((modalData?: T) => {
    setData(modalData)
    setOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setOpen(false)
    setData(undefined)
  }, [])

  const onOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        closeModal()
      } else {
        setOpen(true)
      }
    },
    [closeModal],
  )

  return {
    open,
    data,
    openModal,
    closeModal,
    dialogProps: { open, onOpenChange },
  }
}
