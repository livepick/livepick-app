'use client'

import { Container } from '@/components/layout/Container'
import { EventCard } from '@/features/event/components/EventCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useEvents } from '@/features/event/hooks'

export default function EventsPage() {
  const { data: events, isLoading } = useEvents()

  return (
    <Container className="flex flex-col gap-8 lg:gap-10">
      <header className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="relative z-10">
          <h1 className="font-headline text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-4">
            LIVE<br />
            <span className="text-secondary">PULSE</span>
          </h1>
          <p className="font-body text-on-surface-variant max-w-md text-lg">
            Experience the shift. Curated events from your favorite creators,
            delivered in high-fidelity.
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[16/7] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events?.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </Container>
  )
}
