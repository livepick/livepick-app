'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, X, Clock, Users } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Container } from '@/components/layout/Container'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Chip } from '@/components/ui/Chip'
import { EventStatusChip } from '@/features/event/components/EventStatusChip'
import { MOCK_EVENTS } from '@/mocks/events'
import { MOCK_PARTICIPATIONS } from '@/mocks/participations'
import { MOCK_PARTNERS } from '@/mocks/partners'
import type {
  Event,
  EventParticipation,
  ParticipationStatus,
} from '@/features/event/types'
import type { Partner } from '@/features/partner/types'

const CURRENT_USER_ID = 'u1'

interface ParticipationItem {
  participation: EventParticipation
  event: Event
  partner: Partner
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return String(count)
}

function ParticipationChip({ status }: { status: ParticipationStatus }) {
  if (status === 'won') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/20 text-secondary px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest">
        <Trophy className="w-3 h-3" />
        당첨
      </span>
    )
  }
  if (status === 'lost') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-error/20 text-error px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest">
        <X className="w-3 h-3" />
        미당첨
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 text-primary px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest">
      <Clock className="w-3 h-3" />
      참여중
    </span>
  )
}

export default function HistoryPage() {
  const router = useRouter()

  const myParticipations = useMemo(() => {
    return MOCK_PARTICIPATIONS
      .filter((p) => p.userId === CURRENT_USER_ID)
      .map((participation) => {
        const event = MOCK_EVENTS.find((e) => e.id === participation.eventId)
        const partner = event
          ? MOCK_PARTNERS.find((p) => p.id === event.partnerId)
          : undefined
        return { participation, event, partner }
      })
      .filter(
        (item): item is ParticipationItem =>
          item.event !== undefined && item.partner !== undefined,
      )
      .sort(
        (a, b) =>
          new Date(b.participation.createdAt).getTime() -
          new Date(a.participation.createdAt).getTime(),
      )
  }, [])

  const activeItems = myParticipations.filter(
    (item) => item.event.status === 'active',
  )
  const closedItems = myParticipations.filter(
    (item) => item.event.status === 'closed',
  )

  return (
    <Container className="flex flex-col gap-6 lg:gap-8">
      <SectionHeader
        level="page"
        title={
          <>
            HIS<span className="text-tertiary italic">TORY</span>
          </>
        }
        subtitle="PARTICIPATION RECORDS"
      />

      {/* Active participations */}
      {activeItems.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="font-headline text-lg font-bold">참여중인 이벤트</h2>
            <Chip
              label={String(activeItems.length)}
              variant="secondary"
              size="sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeItems.map(({ participation, event, partner }) => (
              <div
                key={participation.id}
                onClick={() => router.push(`/e/${event.id}`)}
                className="cursor-pointer group relative bg-surface-container-high rounded-xl overflow-hidden transition-transform duration-500 hover:-translate-y-1 flex flex-row h-[140px] md:h-[160px]"
              >
                <div className="relative overflow-hidden w-2/5 shrink-0">
                  <div className="h-full relative">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={event.imageUrl}
                      alt={event.title}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-container-high via-transparent to-transparent" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <EventStatusChip
                      status={event.status}
                      endDate={event.startDate}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2 p-4 md:p-6 min-w-0">
                  <div className="flex items-center gap-2">
                    <img
                      className="w-6 h-6 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all shrink-0"
                      src={partner.profileImage}
                      alt={partner.channelName}
                      loading="lazy"
                    />
                    <span className="font-headline font-bold text-xs text-on-surface truncate">
                      {partner.channelName}
                    </span>
                  </div>
                  <h3 className="font-headline text-sm md:text-base font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] md:text-xs text-on-surface-variant mt-auto">
                    <ParticipationChip status={participation.status} />
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {formatCount(event.participantCount)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Closed participations */}
      {closedItems.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h2 className="font-headline text-lg font-bold">완료된 이벤트</h2>
            <Chip
              label={String(closedItems.length)}
              variant="muted"
              size="sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {closedItems.map(({ participation, event, partner }) => (
              <div
                key={participation.id}
                onClick={() => router.push(`/e/${event.id}`)}
                className={cn(
                  'cursor-pointer group relative rounded-xl overflow-hidden transition-transform duration-500 hover:-translate-y-1 flex flex-row h-[140px] md:h-[160px]',
                  participation.status === 'won'
                    ? 'bg-secondary/10 ring-2 ring-secondary/50'
                    : 'bg-surface-container-high opacity-60 hover:opacity-100',
                )}
              >
                <div className="relative overflow-hidden w-2/5 shrink-0">
                  <div className="h-full relative">
                    <img
                      className={cn(
                        'w-full h-full object-cover transition-transform duration-700 group-hover:scale-110',
                        participation.status !== 'won' && 'grayscale',
                      )}
                      src={event.imageUrl}
                      alt={event.title}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-container-high via-transparent to-transparent" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <EventStatusChip status={event.status} />
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2 p-4 md:p-6 min-w-0">
                  <div className="flex items-center gap-2">
                    <img
                      className={cn(
                        'w-6 h-6 rounded-full object-cover transition-all shrink-0',
                        participation.status === 'won'
                          ? 'grayscale-0'
                          : 'grayscale',
                      )}
                      src={partner.profileImage}
                      alt={partner.channelName}
                      loading="lazy"
                    />
                    <span className="font-headline font-bold text-xs text-on-surface truncate">
                      {partner.channelName}
                    </span>
                  </div>
                  <h3 className="font-headline text-sm md:text-base font-bold group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] md:text-xs text-on-surface-variant mt-auto">
                    <ParticipationChip status={participation.status} />
                    <span>
                      {new Date(event.endDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </Container>
  )
}
