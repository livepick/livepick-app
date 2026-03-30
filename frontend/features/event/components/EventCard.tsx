'use client'

import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EventStatusChip } from './EventStatusChip'
import { MOCK_PARTNERS } from '@/mocks/partners'
import type { Event } from '../types'

interface EventCardProps {
  event: Event
}

function formatCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return String(count)
}

export function EventCard({ event }: EventCardProps) {
  const router = useRouter()
  const partner = MOCK_PARTNERS.find((p) => p.id === event.partnerId)

  const handleClick = () => {
    router.push(`/e/${event.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group relative bg-surface-container-high rounded-xl overflow-hidden transition-transform duration-500 hover:-translate-y-1 flex flex-row"
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
        <div className="absolute top-3 left-3 md:top-4 md:left-4">
          <EventStatusChip status={event.status} endDate={event.startDate} />
        </div>
      </div>
      <div className="flex flex-col justify-center gap-2 md:gap-3 p-4 md:p-6 min-w-0">
        {partner && (
          <div className="flex items-center gap-2 md:gap-3">
            <img
              className={cn(
                'w-6 h-6 md:w-8 md:h-8 rounded-full object-cover transition-all shrink-0',
                event.status === 'closed'
                  ? 'grayscale'
                  : 'grayscale group-hover:grayscale-0',
              )}
              src={partner.profileImage}
              alt={partner.channelName}
              loading="lazy"
            />
            <span className="font-headline font-bold text-xs md:text-sm text-on-surface truncate">
              {partner.channelName}
            </span>
            <span className="text-[9px] md:text-[10px] text-primary uppercase font-black tracking-widest shrink-0">
              {partner.category}
            </span>
          </div>
        )}
        <h3 className="font-headline text-sm md:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-on-surface-variant text-xs md:text-sm line-clamp-1 md:line-clamp-2">
          {event.description}
        </p>
        <div className="flex items-center justify-between text-[10px] md:text-xs text-on-surface-variant mt-auto">
          <span>
            {new Date(event.startDate).toLocaleDateString('ko-KR', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {formatCount(event.participantCount)} Joined
          </div>
        </div>
      </div>
    </div>
  )
}
