'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { OverlayProvider } from '@/components/ui/OverlayProvider'
import { NavigationTracker } from '@/hooks/useNavigationHistory'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <NavigationTracker />
        {children}
      </OverlayProvider>
    </QueryClientProvider>
  )
}
