'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Calendar, Clock, Handshake } from 'lucide-react'
import { cn } from '@/lib/cn'

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/following', icon: Users, label: 'Following' },
  { path: '/events', icon: Calendar, label: 'Events' },
  { path: '/history', icon: Clock, label: 'History' },
  { path: '/partner', icon: Handshake, label: 'Partner' },
] as const

export function BottomNav() {
  const pathname = usePathname()

  // Strip locale prefix for matching (e.g. /ko/events -> /events)
  const strippedPath = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '') || '/'

  return (
    <footer className="fixed bottom-[11px] left-1/2 -translate-x-1/2 z-chrome w-full max-w-sm px-4 pointer-events-none">
      <nav
        className={cn(
          'glass-panel border-[0.5px] border-on-background/6',
          'rounded-full shadow-lv3',
          'grid px-2 py-1 pointer-events-auto',
        )}
        style={{ gridTemplateColumns: `repeat(${NAV_ITEMS.length}, 1fr)` }}
      >
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive =
            path === '/'
              ? strippedPath === '/'
              : strippedPath.startsWith(path)

          return (
            <Link
              key={path}
              href={path}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 rounded-full',
                'transition-all duration-200 active:scale-95',
                isActive
                  ? 'text-secondary'
                  : 'text-on-background/50 hover:text-on-background',
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-body text-[8px] font-black uppercase tracking-widest mt-0.5">
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}
