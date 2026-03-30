'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Globe, LogOut, User, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Avatar } from '@/components/ui/Avatar'
import { useAuthStore } from '@/stores/authStore'
import { LanguageModal } from './LanguageModal'
import { AuthModal } from './AuthModal'

/* ── Menu Item ── */

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  trailing?: React.ReactNode
  className?: string
}

function MenuItem({ icon, label, onClick, trailing, className }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface',
        'hover:bg-surface-container-high/80 transition-colors rounded-lg',
        className,
      )}
    >
      <span className="text-on-surface-variant">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {trailing && <span className="text-on-surface-variant">{trailing}</span>}
    </button>
  )
}

/* ── Dropdown ── */

interface UserMenuDropdownProps {
  open: boolean
  onClose: () => void
  onLanguage: () => void
}

function UserMenuDropdown({ open, onClose, onLanguage }: UserMenuDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { currentUser } = useAuthStore()

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        'absolute top-full right-0 mt-2 w-56',
        'bg-surface-bright border border-outline-variant/10 rounded-2xl',
        'shadow-lv2 shadow-[0_0_32px_rgba(243,130,255,0.06)]',
        'py-2 z-modal',
        'animate-in fade-in-0 zoom-in-95',
      )}
    >
      {/* User info */}
      {currentUser && (
        <>
          <div className="px-4 py-2.5">
            <p className="text-sm font-bold text-on-surface truncate">
              {currentUser.nickname}
            </p>
            <p className="text-xs text-on-surface-variant truncate">
              {currentUser.email}
            </p>
          </div>
          <div className="h-px bg-outline-variant/15 mx-3 my-1" />
        </>
      )}

      {/* Menu items */}
      <div className="px-1.5">
        <MenuItem
          icon={<Globe size={16} />}
          label="언어 / Language"
          onClick={() => {
            onClose()
            onLanguage()
          }}
          trailing={<ChevronRight size={14} />}
        />
        {currentUser && (
          <>
            <MenuItem
              icon={<User size={16} />}
              label="프로필"
              onClick={onClose}
              trailing={<ChevronRight size={14} />}
            />
            <div className="h-px bg-outline-variant/15 mx-3 my-1" />
            <MenuItem
              icon={<LogOut size={16} />}
              label="로그아웃"
              onClick={onClose}
              className="text-error"
            />
          </>
        )}
      </div>
    </div>
  )
}

/* ── UserMenu (Container) ── */

export function UserMenu() {
  const { isLoggedIn, currentUser } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const handleToggle = useCallback(() => {
    if (isLoggedIn) {
      setMenuOpen((prev) => !prev)
    } else {
      setAuthOpen(true)
    }
  }, [isLoggedIn])

  const handleClose = useCallback(() => setMenuOpen(false), [])
  const handleLanguage = useCallback(() => setLangOpen(true), [])

  return (
    <div className="relative flex items-center">
      <button
        onClick={handleToggle}
        className="rounded-full transition-transform hover:scale-105 active:scale-95"
        aria-label="User menu"
      >
        {isLoggedIn && currentUser ? (
          <Avatar
            src={currentUser.profileImage}
            alt={currentUser.nickname}
            size="sm"
          />
        ) : (
          <Avatar alt="G" size="sm" fallback="G" />
        )}
      </button>

      <UserMenuDropdown
        open={menuOpen}
        onClose={handleClose}
        onLanguage={handleLanguage}
      />

      <LanguageModal open={langOpen} onOpenChange={setLangOpen} />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  )
}
