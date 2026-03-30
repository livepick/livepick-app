'use client'

/**
 * Dialog Primitive
 *
 * Compound: Dialog + Dialog.Overlay + Dialog.Content + Dialog.Title
 *         + Dialog.Close + Dialog.Header + Dialog.Description
 *         + Dialog.Body + Dialog.Footer
 *
 * iOS 표준 기반 4가지 variant:
 * - alert: 경고/확인 (중앙 팝업, 짧은 메시지)
 * - sheet: 정보 표시 (Mobile: Bottom Sheet, Desktop: 중앙)
 * - formSheet: 폼 입력 (Mobile: Bottom Sheet, Desktop: 중앙)
 * - pageSheet: 복잡한 멀티스텝 (거의 full height)
 *
 * @see setto-app Dialog pattern
 */

import { createContext, useContext, useCallback } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useOverlayPortal } from './OverlayProvider'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useScrollLock } from '@/hooks/useScrollLock'

/* ═══════════════════════════════════════════════════════════
 * Types
 * ═══════════════════════════════════════════════════════════ */

type DialogVariant = 'alert' | 'sheet' | 'formSheet' | 'pageSheet'
type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
type DialogBackdrop = 'standard' | 'strong'
type DialogZIndex = 'z-overlay' | 'z-modal' | 'z-modal-nested' | 'z-fullscreen'

/* ═══════════════════════════════════════════════════════════
 * Variant → Style Mapping
 * ═══════════════════════════════════════════════════════════ */

/** 항상 max-w 제한 (alert 등 centered modal) */
const SIZE_CLASSES: Record<DialogSize, string> = {
  sm: 'max-w-sm',        // 384px
  md: 'max-w-md',        // 448px
  lg: 'max-w-lg',        // 512px
  xl: 'max-w-2xl',       // 672px
  full: 'max-w-[520px]', // PageSheet
}

/** Bottom Sheet 변종: 모바일에서 max-w 해제, 데스크탑부터 size 제한 */
const SIZE_CLASSES_MD: Record<DialogSize, string> = {
  sm: 'md:max-w-sm',
  md: 'md:max-w-md',
  lg: 'md:max-w-lg',
  xl: 'md:max-w-2xl',
  full: 'md:max-w-[520px]',
}

const BACKDROP_CLASSES: Record<DialogBackdrop, string> = {
  standard: 'bg-black/60 backdrop-blur-sm',
  strong: 'bg-black/80 backdrop-blur-xl',
}

interface VariantDefaults {
  size: DialogSize
  backdrop: DialogBackdrop
  zIndex: DialogZIndex
  radiusDesktop: string
  radiusMobile: string
  animationDesktop: string
  animationMobile: string
  padding: string
  shadow: string
  mobileBottomSheet: boolean
  mobileMaxHeight: string
}

const VARIANT_DEFAULTS: Record<DialogVariant, VariantDefaults> = {
  alert: {
    size: 'sm',
    backdrop: 'standard',
    zIndex: 'z-overlay',
    radiusDesktop: 'rounded-2xl',
    radiusMobile: 'rounded-2xl',
    animationDesktop: 'animate-in fade-in-0 zoom-in-95 duration-300',
    animationMobile: 'animate-in fade-in-0 zoom-in-95 duration-300',
    padding: 'p-6',
    shadow: 'shadow-lv2',
    mobileBottomSheet: false,
    mobileMaxHeight: '',
  },
  sheet: {
    size: 'lg',
    backdrop: 'standard',
    zIndex: 'z-overlay',
    radiusDesktop: 'md:rounded-[24px]',
    radiusMobile: 'rounded-t-[32px]',
    animationDesktop: 'md:animate-in md:fade-in-0 md:zoom-in-95 md:duration-300',
    animationMobile: 'animate-in slide-in-from-bottom fade-in-0 duration-300',
    padding: 'p-2',
    shadow: 'shadow-lv3',
    mobileBottomSheet: true,
    mobileMaxHeight: 'max-h-[85vh]',
  },
  formSheet: {
    size: 'md',
    backdrop: 'standard',
    zIndex: 'z-overlay',
    radiusDesktop: 'md:rounded-[28px]',
    radiusMobile: 'rounded-t-[32px]',
    animationDesktop: 'md:animate-in md:fade-in-0 md:zoom-in-95 md:duration-300',
    animationMobile: 'animate-in slide-in-from-bottom fade-in-0 duration-300',
    padding: 'p-2',
    shadow: 'shadow-lv3',
    mobileBottomSheet: true,
    mobileMaxHeight: 'max-h-[90vh]',
  },
  pageSheet: {
    size: 'full',
    backdrop: 'strong',
    zIndex: 'z-fullscreen',
    radiusDesktop: 'md:rounded-[32px]',
    radiusMobile: 'rounded-t-[32px]',
    animationDesktop: 'animate-in slide-in-from-bottom-8 fade-in-0 duration-500',
    animationMobile: 'animate-in slide-in-from-bottom fade-in-0 duration-500',
    padding: 'p-2',
    shadow: 'shadow-lv3',
    mobileBottomSheet: true,
    mobileMaxHeight: 'max-h-[95vh] md:max-h-[85vh]',
  },
}

/* ═══════════════════════════════════════════════════════════
 * Context
 * ═══════════════════════════════════════════════════════════ */

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: DialogVariant
}

const DialogContext = createContext<DialogContextValue | null>(null)

function useDialogContext() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('Dialog compound components must be used within <Dialog>')
  return ctx
}

/* ═══════════════════════════════════════════════════════════
 * Dialog (Root)
 * ═══════════════════════════════════════════════════════════ */

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: DialogVariant
  children: React.ReactNode
}

function DialogRoot({
  open,
  onOpenChange,
  variant,
  children,
}: DialogProps) {
  useScrollLock(open)

  if (!open) return null

  return (
    <DialogContext.Provider value={{ open, onOpenChange, variant }}>
      {children}
    </DialogContext.Provider>
  )
}

/* ═══════════════════════════════════════════════════════════
 * Dialog.Overlay
 * ═══════════════════════════════════════════════════════════ */

interface OverlayProps {
  backdrop?: DialogBackdrop
  className?: string
}

function DialogOverlay({ backdrop = 'standard', className }: OverlayProps) {
  const { onOpenChange } = useDialogContext()

  return (
    <div
      className={cn(
        'absolute inset-0',
        BACKDROP_CLASSES[backdrop],
        'animate-in fade-in-0 duration-200',
        className,
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false)
        }
      }}
      aria-hidden="true"
    />
  )
}

/* ═══════════════════════════════════════════════════════════
 * Dialog.Content
 * ═══════════════════════════════════════════════════════════ */

interface ContentProps {
  variant?: DialogVariant
  size?: DialogSize
  backdrop?: DialogBackdrop
  zIndex?: DialogZIndex
  children: React.ReactNode
  className?: string
}

function DialogContent({
  variant: variantOverride,
  size: sizeOverride,
  backdrop: backdropOverride,
  zIndex: zIndexOverride,
  children,
  className,
}: ContentProps) {
  const ctx = useDialogContext()
  const portal = useOverlayPortal()
  const variant = variantOverride ?? ctx.variant

  const handleEscape = useCallback(() => ctx.onOpenChange(false), [ctx])
  useEscapeKey(ctx.open, handleEscape)

  // variant 미지정 → 기존 동작 호환
  if (!variant) {
    const resolvedZIndex = zIndexOverride ?? 'z-overlay'
    const content = (
      <div
        className={cn('fixed inset-0 overflow-y-auto', resolvedZIndex)}
      >
        <DialogOverlay />
        <div className="relative flex min-h-full items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            className={cn(
              'relative w-full max-w-lg rounded-2xl border bg-surface-bright p-6 shadow-lv2',
              'animate-in fade-in-0 zoom-in-95',
              className,
            )}
          >
            {children}
          </div>
        </div>
      </div>
    )
    return portal(content)
  }

  // variant 지정 → 새 표준 적용
  const defaults = VARIANT_DEFAULTS[variant]
  const resolvedSize = sizeOverride ?? defaults.size
  const resolvedBackdrop = backdropOverride ?? defaults.backdrop
  const resolvedZIndex = zIndexOverride ?? defaults.zIndex

  const containerClasses = cn(
    'relative flex w-full flex-col overflow-hidden',
    'bg-surface-bright border border-outline-variant/10',
    // Bottom Sheet: 모바일에서 max-w 제한 없이 전체 너비, 데스크탑에서만 size 제한
    defaults.mobileBottomSheet
      ? SIZE_CLASSES_MD[resolvedSize]
      : SIZE_CLASSES[resolvedSize],
    defaults.shadow,
    // Mobile: Bottom Sheet radius, Desktop: 표준 radius
    defaults.mobileBottomSheet
      ? cn(defaults.radiusMobile, defaults.radiusDesktop)
      : defaults.radiusDesktop,
    // max-height
    defaults.mobileMaxHeight,
    // Animation — mobile / desktop 분기
    defaults.mobileBottomSheet
      ? cn(defaults.animationMobile, defaults.animationDesktop)
      : defaults.animationDesktop,
    // Neon ambient glow
    'shadow-[0_0_48px_rgba(243,130,255,0.08)]',
    defaults.padding,
    className,
  )

  const content = (
    <div
      className={cn(
        'fixed inset-0 overflow-y-auto',
        resolvedZIndex,
      )}
    >
      <DialogOverlay backdrop={resolvedBackdrop} />
      <div
        className={cn(
          'relative flex min-h-full justify-center',
          // Mobile: Bottom Sheet → 하단 정렬, Desktop: 중앙 정렬
          defaults.mobileBottomSheet
            ? 'items-end md:items-center'
            : 'items-center p-4',
          // Mobile Bottom Sheet: 패딩 없음, Desktop: 전체 패딩 복원
          defaults.mobileBottomSheet && 'md:p-4',
        )}
      >
        <div
          role="dialog"
          aria-modal="true"
          className={containerClasses}
        >
          {children}
        </div>
      </div>
    </div>
  )

  return portal(content)
}

/* ═══════════════════════════════════════════════════════════
 * Dialog.Header
 * ═══════════════════════════════════════════════════════════ */

interface HeaderProps {
  title?: string
  description?: string
  showHandle?: boolean
  showClose?: boolean
  headerRight?: React.ReactNode
  className?: string
}

function DialogHeader({
  title,
  description,
  showHandle = false,
  showClose = true,
  headerRight,
  className,
}: HeaderProps) {
  const { onOpenChange } = useDialogContext()

  return (
    <div className={cn('relative flex shrink-0 items-center justify-between px-6 pt-8 pb-4', className)}>
      {showHandle && (
        <div className="absolute left-1/2 top-2 -translate-x-1/2">
          <div className="h-1 w-9 rounded-full bg-on-surface-variant/30" />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <h2 className="font-headline text-lg font-bold text-on-surface tracking-tight">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-1 text-sm text-on-surface-variant leading-relaxed">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {headerRight}
        {showClose && (
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center justify-center h-8 w-8 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * Dialog.Body
 * ═══════════════════════════════════════════════════════════ */

interface BodyProps {
  children: React.ReactNode
  className?: string
}

function DialogBody({ children, className }: BodyProps) {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto px-6 pt-2 pb-6 hide-scrollbar',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * Dialog.Footer
 * ═══════════════════════════════════════════════════════════ */

interface FooterProps {
  children: React.ReactNode
  className?: string
}

function DialogFooter({ children, className }: FooterProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-end gap-3 px-6 pb-6 pt-3',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
 * Dialog.Close
 * ═══════════════════════════════════════════════════════════ */

interface CloseProps {
  children?: React.ReactNode
  className?: string
}

function DialogClose({ children, className }: CloseProps) {
  const { onOpenChange } = useDialogContext()

  return (
    <button
      onClick={() => onOpenChange(false)}
      className={cn(
        'flex items-center justify-center h-8 w-8 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors',
        className,
      )}
      aria-label="Close"
    >
      {children ?? <X size={18} />}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════
 * Compound Export
 * ═══════════════════════════════════════════════════════════ */

export const Dialog = Object.assign(DialogRoot, {
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: DialogClose,
})
