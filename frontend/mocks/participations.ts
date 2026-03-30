import type { EventParticipation } from '@/features/event/types'

export const MOCK_PARTICIPATIONS: EventParticipation[] = [
  { id: 'ep1', eventId: 'e1', userId: 'u1', status: 'joined', createdAt: '2026-03-28T19:00:00Z' },
  { id: 'ep2', eventId: 'e2', userId: 'u1', status: 'joined', createdAt: '2026-03-27T10:00:00Z' },
  { id: 'ep3', eventId: 'e4', userId: 'u1', status: 'joined', createdAt: '2026-03-30T10:00:00Z' },
  { id: 'ep4', eventId: 'e5', userId: 'u3', status: 'joined', createdAt: '2026-03-26T00:00:00Z' },
  { id: 'ep5', eventId: 'e9', userId: 'u1', status: 'won', createdAt: '2026-01-26T00:00:00Z' },
  { id: 'ep6', eventId: 'e10', userId: 'u3', status: 'won', createdAt: '2026-02-11T00:00:00Z' },
  { id: 'ep7', eventId: 'e11', userId: 'u1', status: 'lost', createdAt: '2026-03-02T00:00:00Z' },
  { id: 'ep8', eventId: 'e12', userId: 'u4', status: 'lost', createdAt: '2026-03-12T00:00:00Z' },
  { id: 'ep9', eventId: 'e12', userId: 'u1', status: 'won', createdAt: '2026-03-11T00:00:00Z' },
  { id: 'ep10', eventId: 'e10', userId: 'u1', status: 'lost', createdAt: '2026-02-12T00:00:00Z' },
  { id: 'ep11', eventId: 'e12', userId: 'u3', status: 'won', createdAt: '2026-03-11T00:00:00Z' },
]
