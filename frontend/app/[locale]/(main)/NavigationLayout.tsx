'use client'

import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'

interface NavigationLayoutProps {
  children: React.ReactNode
}

export function NavigationLayout({ children }: NavigationLayoutProps) {
  return (
    <div className="relative min-h-screen bg-background text-on-background overflow-x-hidden">
      <main className="min-h-screen overflow-x-hidden pt-[calc(var(--header-height)+12px)] pb-[calc(var(--bottom-nav-height)+16px)]">
        {children}
      </main>
      <Header />
      <BottomNav />
    </div>
  )
}
