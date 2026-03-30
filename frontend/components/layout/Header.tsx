'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Chip } from '@/components/ui/Chip'
import { useAuthStore } from '@/stores/authStore'
import { UserMenu } from './UserMenu'

export function Header() {
  const { mode, toggleAuth } = useAuthStore()

  return (
    <header className="fixed top-0 w-full z-chrome glass-panel shadow-[0_8px_32px_rgba(243,129,255,0.08)]">
      <div className="flex justify-between items-center px-4 lg:px-6 py-2 w-full max-w-[var(--max-content-width)] mx-auto">
        <Link href="/">
          <Image src="/logo.png" alt="LivePick" width={120} height={36} priority />
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAuth}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high/60 hover:bg-surface-container-highest transition-colors"
          >
            <Chip
              label={mode}
              variant={mode === 'partner' ? 'secondary' : mode === 'user' ? 'tertiary' : 'muted'}
              size="sm"
            />
          </button>

          <UserMenu />
        </div>
      </div>
    </header>
  )
}
