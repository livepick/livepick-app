'use client'

import { use, useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { DetailPageShell } from '@/components/layout/DetailPageShell'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { EventCard } from '@/features/event/components/EventCard'
import { FollowButton } from '@/features/follow/components/FollowButton'
import { usePartner } from '@/features/partner/hooks'
import { useEventsByPartner } from '@/features/event/hooks'
import { useNavigationHistory } from '@/hooks/useNavigationHistory'

function formatFollowerCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`
  return String(count)
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { canGoBack, goBack } = useNavigationHistory()
  const { data: partner, isLoading } = usePartner(id ?? '')
  const { data: events } = useEventsByPartner(id ?? '')

  // Sticky bar
  const coverRef = useRef<HTMLDivElement>(null)
  const [showStickyBar, setShowStickyBar] = useState(false)

  useEffect(() => {
    const el = coverRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (isLoading) {
    return (
      <DetailPageShell className="pt-14">
        <Skeleton className="w-24 h-24 rounded-full mb-4" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-5 w-32" />
      </DetailPageShell>
    )
  }

  if (!partner) {
    return (
      <DetailPageShell>
        <p className="text-on-surface-variant text-center py-20">
          파트너를 찾을 수 없습니다
        </p>
      </DetailPageShell>
    )
  }

  return (
    <DetailPageShell>
      {/* ── Sticky App Bar ── */}
      <div
        className={`fixed inset-x-0 top-0 z-30 mx-auto w-full transition-all duration-300 ${
          showStickyBar
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ maxWidth: '720px' }}
      >
        <div className="flex h-12 items-center gap-3 bg-background/80 px-4 backdrop-blur-xl border-b border-on-surface/10">
          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="size-[18px]" />
            </button>
          )}
          <img
            src={partner.profileImage}
            alt={partner.channelName}
            className="size-6 shrink-0 rounded-full object-cover"
          />
          <span className="flex-1 truncate text-sm font-semibold">
            {partner.channelName}
          </span>
          <FollowButton partnerId={partner.id} />
        </div>
      </div>

      {/* ── Cover + Back ── */}
      <div
        ref={coverRef}
        className="relative -mx-4 md:-mx-6 h-48 bg-surface-container-high overflow-hidden"
      >
        {partner.coverImage ? (
          <img
            src={partner.coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/10 opacity-50" />
        )}
        <div
          className={`absolute inset-x-0 top-0 z-20 flex items-center px-4 pt-3 transition-opacity duration-300 ${
            showStickyBar ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {canGoBack && (
            <button
              type="button"
              onClick={goBack}
              className="flex size-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/50"
              aria-label="뒤로 가기"
            >
              <ArrowLeft className="size-5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Profile Content ── */}
      <div className="relative -mt-16 flex flex-col gap-6 pb-12">
        {/* Avatar + Follow */}
        <div className="flex items-end justify-between">
          <div className="size-24 rounded-full border-4 border-background overflow-hidden shadow-[0_0_30px_rgba(243,130,255,0.2)]">
            <img
              className="w-full h-full object-cover"
              src={partner.profileImage}
              alt={partner.channelName}
            />
          </div>
          <FollowButton partnerId={partner.id} />
        </div>

        {/* Name + Category */}
        <div>
          <h1 className="font-headline text-2xl font-black mb-1">
            {partner.channelName}
          </h1>
          <p className="text-secondary font-bold tracking-widest uppercase text-xs">
            {partner.category}
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg">
              {formatFollowerCount(partner.followerCount)}
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">
              Followers
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-lg">
              {partner.activeEventCount}
            </span>
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">
              Events
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-on-surface-variant leading-relaxed text-sm">
          {partner.bio}
        </p>

        {/* Events */}
        {events && events.length > 0 && (
          <section>
            <SectionHeader level="section" title="Events" />
            <div className="grid grid-cols-1 gap-4 mt-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
    </DetailPageShell>
  )
}
