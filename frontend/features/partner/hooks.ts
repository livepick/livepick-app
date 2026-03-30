import { useQuery } from '@tanstack/react-query'
import { MOCK_PARTNERS } from '@/mocks/partners'
import type { Partner } from './types'

export const partnerKeys = {
  all: ['partners'] as const,
  lists: () => [...partnerKeys.all, 'list'] as const,
  list: (filters?: { category?: string }) =>
    [...partnerKeys.lists(), filters] as const,
  details: () => [...partnerKeys.all, 'detail'] as const,
  detail: (id: string) => [...partnerKeys.details(), id] as const,
}

async function fetchPartners(): Promise<Partner[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_PARTNERS
}

async function fetchPartner(id: string): Promise<Partner | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_PARTNERS.find((p) => p.id === id)
}

export function usePartners() {
  return useQuery({
    queryKey: partnerKeys.lists(),
    queryFn: fetchPartners,
  })
}

export function usePartner(id: string) {
  return useQuery({
    queryKey: partnerKeys.detail(id),
    queryFn: () => fetchPartner(id),
    enabled: Boolean(id),
  })
}
