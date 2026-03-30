import { useQuery } from '@tanstack/react-query'
import { MOCK_EVENTS } from '@/mocks/events'
import type { Event, EventStatus } from './types'

export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters?: { status?: EventStatus }) =>
    [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  byPartner: (partnerId: string) =>
    [...eventKeys.all, 'partner', partnerId] as const,
}

async function fetchEvents(status?: EventStatus): Promise<Event[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  if (status) {
    return MOCK_EVENTS.filter((e) => e.status === status)
  }
  return MOCK_EVENTS.filter((e) => e.status !== 'closed').sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )
}

async function fetchEvent(id: string): Promise<Event | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_EVENTS.find((e) => e.id === id)
}

async function fetchEventsByPartner(partnerId: string): Promise<Event[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_EVENTS.filter((e) => e.partnerId === partnerId)
}

export function useEvents(status?: EventStatus) {
  return useQuery({
    queryKey: eventKeys.list({ status }),
    queryFn: () => fetchEvents(status),
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => fetchEvent(id),
    enabled: Boolean(id),
  })
}

export function useEventsByPartner(partnerId: string) {
  return useQuery({
    queryKey: eventKeys.byPartner(partnerId),
    queryFn: () => fetchEventsByPartner(partnerId),
    enabled: Boolean(partnerId),
  })
}
