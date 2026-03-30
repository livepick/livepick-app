'use client'

import { createContext, useContext, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

/* ── Context ── */
interface OverlayContextValue {
  overlayRoot: HTMLDivElement | null
  systemRoot: HTMLDivElement | null
}

const OverlayContext = createContext<OverlayContextValue>({
  overlayRoot: null,
  systemRoot: null,
})

/* ── Provider ── */
interface OverlayProviderProps {
  children: React.ReactNode
}

export function OverlayProvider({ children }: OverlayProviderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const systemRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const value: OverlayContextValue = {
    overlayRoot: mounted ? overlayRef.current : null,
    systemRoot: mounted ? systemRef.current : null,
  }

  return (
    <OverlayContext.Provider value={value}>
      {children}
      <div ref={overlayRef} id="livepick-overlay-root" className="z-overlay" />
      <div ref={systemRef} id="livepick-system-root" className="z-system" />
    </OverlayContext.Provider>
  )
}

/* ── Portal Hooks ── */
export function useOverlayPortal() {
  const { overlayRoot } = useContext(OverlayContext)
  return (children: React.ReactNode) => {
    const target = overlayRoot ?? (typeof document !== 'undefined' ? document.body : null)
    return target ? createPortal(children, target) : null
  }
}

export function useSystemPortal() {
  const { systemRoot } = useContext(OverlayContext)
  return (children: React.ReactNode) => {
    const target = systemRoot ?? (typeof document !== 'undefined' ? document.body : null)
    return target ? createPortal(children, target) : null
  }
}
