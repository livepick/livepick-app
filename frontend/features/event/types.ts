export const EVENT_STATUSES = ['pending', 'active', 'closed'] as const
export type EventStatus = (typeof EVENT_STATUSES)[number]

export const PARTICIPATION_STATUSES = ['joined', 'won', 'lost'] as const
export type ParticipationStatus = (typeof PARTICIPATION_STATUSES)[number]

export interface Event {
  id: string
  partnerId: string
  title: string
  description: string
  imageUrl: string
  startDate: string
  endDate: string
  status: EventStatus
  winnerCount: number
  participantCount: number
  createdAt: string
}

export interface EventParticipation {
  id: string
  eventId: string
  userId: string
  status: ParticipationStatus
  createdAt: string
}
