'use client'

import { use } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { EventStatusChip } from '@/features/event/components/EventStatusChip'
import { useEvent } from '@/features/event/hooks'
import { useAuthStore } from '@/stores/authStore'
import { Users, Calendar, Trophy, ArrowLeft } from 'lucide-react'

const MOCK_PARTICIPANTS = [
  { id: 'p1', nickname: '행운의별', joinedAt: '2026-03-28T10:00:00Z' },
  { id: 'p2', nickname: '럭키세븐', joinedAt: '2026-03-28T11:30:00Z' },
  { id: 'p3', nickname: '이벤트킹', joinedAt: '2026-03-28T14:20:00Z' },
  { id: 'p4', nickname: '팬클럽회장', joinedAt: '2026-03-29T09:00:00Z' },
  { id: 'p5', nickname: '응모왕', joinedAt: '2026-03-29T16:45:00Z' },
] as const

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return String(count)
}

export default function EventManagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: event, isLoading } = useEvent(id ?? '')
  const isPartner = useAuthStore((s) => s.isPartner)

  if (!isPartner) {
    return (
      <Container className="flex flex-col gap-8 lg:gap-10">
        <SectionHeader
          level="page"
          title={<>이벤트 <span className="text-tertiary italic">관리</span></>}
        />
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-lg mb-4">
            파트너만 이벤트를 관리할 수 있습니다
          </p>
          <Link
            href="/partner/join"
            className="text-primary font-bold hover:underline text-sm uppercase tracking-widest"
          >
            파트너 가입하러 가기
          </Link>
        </div>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container maxWidth="768px" className="flex flex-col gap-8 lg:gap-10">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-48 w-full rounded-2xl mb-6" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </Container>
    )
  }

  if (!event) {
    return (
      <Container className="flex flex-col gap-8 lg:gap-10">
        <p className="text-on-surface-variant text-center py-20">
          이벤트를 찾을 수 없습니다
        </p>
      </Container>
    )
  }

  return (
    <Container maxWidth="768px" className="flex flex-col gap-6 lg:gap-8">
      <Link
        href="/partner"
        className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors w-fit text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        대시보드
      </Link>
      <header>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-headline text-3xl md:text-5xl font-black tracking-tighter text-on-background">
            {event.title}
          </h1>
          <EventStatusChip status={event.status} endDate={event.endDate} />
        </div>
        <p className="font-body text-on-surface-variant text-sm">
          {event.description}
        </p>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface-container-low rounded-2xl p-5 text-center">
          <Users className="w-5 h-5 text-tertiary mx-auto mb-2" />
          <p className="font-headline font-bold text-2xl text-on-surface tabular-nums">
            {formatCount(event.participantCount)}
          </p>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">
            Participants
          </p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-5 text-center">
          <Trophy className="w-5 h-5 text-secondary mx-auto mb-2" />
          <p className="font-headline font-bold text-2xl text-on-surface tabular-nums">
            {event.winnerCount}
          </p>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">
            Winners
          </p>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-5 text-center">
          <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
          <p className="font-headline font-bold text-sm text-on-surface">
            {formatDate(event.endDate)}
          </p>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">
            End Date
          </p>
        </div>
      </div>

      <section className="bg-surface-container-low rounded-3xl p-6 md:p-8">
        <SectionHeader level="section" title="참여자 목록" />
        <div className="space-y-3">
          {MOCK_PARTICIPANTS.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-4 bg-surface-container rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-surface-container-highest rounded-full flex items-center justify-center font-headline font-bold text-sm text-on-surface-variant">
                  {participant.nickname.charAt(0)}
                </div>
                <span className="font-bold text-on-surface">
                  {participant.nickname}
                </span>
              </div>
              <span className="text-xs text-on-surface-variant tabular-nums">
                {formatDate(participant.joinedAt)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {event.status === 'active' && (
          <Button variant="secondary" size="md" className="flex-1">
            조기 마감
          </Button>
        )}
        {event.status === 'closed' && (
          <Button variant="primary" size="md" className="flex-1">
            당첨자 추첨
          </Button>
        )}
        <Button variant="secondary" size="md" className="flex-1">
          이벤트 수정
        </Button>
        <Button variant="ghost" size="md" className="flex-1 text-error">
          이벤트 삭제
        </Button>
      </div>
    </Container>
  )
}
