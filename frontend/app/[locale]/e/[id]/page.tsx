'use client'

import { use, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users, Trophy, Clock, Calendar, CheckCircle2 } from 'lucide-react'
import { DetailPageShell } from '@/components/layout/DetailPageShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { useEvent } from '@/features/event/hooks'
import { MOCK_PARTNERS } from '@/mocks/partners'
import { MOCK_PARTICIPATIONS } from '@/mocks/participations'
import { MOCK_USERS } from '@/mocks/users'
import { EventStatusChip } from '@/features/event/components/EventStatusChip'
import { JoinEventDialog, type JoinFormData } from '@/features/event/components/JoinEventDialog'
import { useNavigationHistory } from '@/hooks/useNavigationHistory'

// Mock: 현재 로그인 사용자 (추후 authStore에서 가져올 것)
const CURRENT_USER_ID = 'u1'

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return String(count)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { canGoBack, goBack } = useNavigationHistory()
  const { data: event, isLoading } = useEvent(id ?? '')

  // Join dialog
  const [joinDialogOpen, setJoinDialogOpen] = useState(false)

  function handleJoinSubmit(data: JoinFormData) {
    // TODO: API 연동 시 실제 참여 요청
    console.log('Join event:', data)
  }

  // Sticky bar
  const headerRef = useRef<HTMLDivElement>(null)
  const [showStickyBar, setShowStickyBar] = useState(false)

  useEffect(() => {
    const el = headerRef.current
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
        <div className="flex gap-4 mb-6">
          <Skeleton className="size-28 shrink-0 rounded-xl" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-1/2 mb-3" />
        <Skeleton className="h-4 w-full" />
      </DetailPageShell>
    )
  }

  if (!event) {
    return (
      <DetailPageShell>
        <p className="text-on-surface-variant text-center py-20">
          이벤트를 찾을 수 없습니다
        </p>
      </DetailPageShell>
    )
  }

  const partner = MOCK_PARTNERS.find((p) => p.id === event.partnerId)

  // Get participants for this event
  const eventParticipations = MOCK_PARTICIPATIONS.filter(
    (p) => p.eventId === event.id,
  )
  const participants = eventParticipations
    .map((ep) => {
      const user = MOCK_USERS.find((u) => u.id === ep.userId)
      return user ? { ...user, participationStatus: ep.status } : null
    })
    .filter(
      (u): u is NonNullable<typeof u> => u !== null,
    )
    .sort((a, b) => {
      if (a.participationStatus === 'won' && b.participationStatus !== 'won') return -1
      if (a.participationStatus !== 'won' && b.participationStatus === 'won') return 1
      return 0
    })

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
          <span className="truncate text-sm font-semibold flex-1">
            {event.title}
          </span>
          <EventStatusChip status={event.status} endDate={event.startDate} />
        </div>
      </div>

      {/* ── Top Navigation ── */}
      <div ref={headerRef} className="pt-3 pb-2">
        {canGoBack && (
          <button
            type="button"
            onClick={goBack}
            className="flex size-10 items-center justify-center rounded-full hover:bg-surface-container-high transition-colors"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
      </div>

      {/* ── Event Header: Thumbnail + Info ── */}
      <div className="flex gap-4 mb-6">
        {/* Thumbnail — small, decorative */}
        <img
          className="size-28 shrink-0 rounded-xl object-cover"
          src={event.imageUrl}
          alt={event.title}
        />

        {/* Core info */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <EventStatusChip status={event.status} endDate={event.startDate} className="self-start" />
          <h1 className="font-headline text-lg font-black leading-snug line-clamp-2">
            {event.title}
          </h1>
          {partner && (
            <button
              type="button"
              onClick={() => router.push(`/p/${partner.id}`)}
              className="flex items-center gap-2 group mt-0.5"
            >
              <img
                className="size-5 rounded-full object-cover"
                src={partner.profileImage}
                alt={partner.channelName}
              />
              <span className="text-xs text-on-surface-variant group-hover:text-primary transition-colors">
                {partner.channelName}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── Meta + Description ── */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            {formatCount(event.participantCount)}명 참여
          </span>
          <span className="flex items-center gap-1.5">
            <Trophy className="size-3.5" />
            당첨 {event.winnerCount}명
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(event.endDate)} 마감
          </span>
        </div>

        <p className="text-on-surface-variant leading-relaxed text-sm">
          {event.description}
        </p>

        {/* Action */}
        {event.status === 'active' && (
          (() => {
            const myParticipation = MOCK_PARTICIPATIONS.find(
              (p) => p.eventId === event.id && p.userId === CURRENT_USER_ID,
            )
            if (myParticipation) {
              return (
                <div className="w-full flex items-center justify-center gap-2 bg-surface-container-high text-on-surface-variant font-headline font-black text-base uppercase tracking-widest rounded-full py-4 cursor-default">
                  <CheckCircle2 className="size-5 text-primary" />
                  참여완료
                </div>
              )
            }
            return (
              <>
                <button
                  onClick={() => setJoinDialogOpen(true)}
                  className="w-full bg-primary text-on-primary font-headline font-black text-base uppercase tracking-widest rounded-full py-4 shadow-[0_0_30px_rgba(243,130,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-transform"
                >
                  Join Now
                </button>
                <JoinEventDialog
                  open={joinDialogOpen}
                  onOpenChange={setJoinDialogOpen}
                  onSubmit={handleJoinSubmit}
                />
              </>
            )
          })()
        )}

        {event.status === 'pending' && (
          <div className="flex items-center gap-2 rounded-2xl bg-surface-container-low px-5 py-4">
            <Clock className="size-5 text-tertiary" />
            <span className="text-sm text-on-surface-variant">
              {formatDate(event.startDate)}에 시작됩니다
            </span>
          </div>
        )}

        {event.status === 'closed' && (
          (() => {
            const myParticipation = MOCK_PARTICIPATIONS.find(
              (p) => p.eventId === event.id && p.userId === CURRENT_USER_ID,
            )
            if (myParticipation?.status === 'won') {
              return (
                <div className="rounded-2xl bg-secondary/10 border border-secondary/30 px-5 py-4 flex items-center justify-center gap-2">
                  <Trophy className="size-5 text-secondary" />
                  <span className="text-sm font-bold text-secondary">
                    축하합니다! 당첨되었습니다
                  </span>
                </div>
              )
            }
            if (myParticipation?.status === 'lost') {
              return (
                <div className="rounded-2xl bg-surface-container-low px-5 py-4 text-center">
                  <span className="text-sm text-on-surface-variant">
                    아쉽게도 당첨되지 않았습니다
                  </span>
                </div>
              )
            }
            return (
              <div className="rounded-2xl bg-surface-container-low px-5 py-4 text-center">
                <span className="text-sm text-on-surface-variant">
                  이벤트가 마감되었습니다
                </span>
              </div>
            )
          })()
        )}
      </div>

      {/* ── Participants List ── */}
      <div className="border-t border-on-surface/10 pt-6 pb-12">
        <h2 className="font-headline text-base font-bold mb-4">
          참여자
          <span className="ml-2 text-sm font-normal text-on-surface-variant">
            {formatCount(event.participantCount)}
          </span>
        </h2>

        {participants.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {participants.map((user) => {
              if (!user) return null
              return (
                <li
                  key={user.id}
                  className="flex items-center gap-3 rounded-xl bg-surface-container-low px-4 py-3 hover:bg-surface-container transition-colors"
                >
                  <img
                    src={user.profileImage}
                    alt={user.nickname}
                    className="size-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-semibold">{user.nickname}</span>
                  {user.participationStatus === 'won' && (
                    <span className="ml-auto flex items-center gap-1 text-xs font-bold text-secondary">
                      <Trophy className="size-3.5" />
                      당첨
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="rounded-xl bg-surface-container-low px-4 py-10 text-center">
            <Users className="size-8 mx-auto text-on-surface-variant/40 mb-2" />
            <p className="text-sm text-on-surface-variant">
              아직 참여자가 없습니다
            </p>
          </div>
        )}
      </div>
    </DetailPageShell>
  )
}
