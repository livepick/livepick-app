'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { MetricCard } from '@/features/partner/components/MetricCard'
import { useAuthStore } from '@/stores/authStore'
import { useEventsByPartner } from '@/features/event/hooks'
import { usePartners } from '@/features/partner/hooks'
import { Calendar, Users, Trophy, Plus, Clock, CheckCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { EventStatus } from '@/features/event/types'

const STATUS_LABELS: Record<EventStatus, string> = {
  active: '진행중',
  pending: '예정',
  closed: '마감',
}

const STATUS_STYLES: Record<EventStatus, string> = {
  active: 'bg-secondary/20 text-secondary',
  pending: 'bg-tertiary/20 text-tertiary',
  closed: 'bg-on-surface-variant/20 text-on-surface-variant',
}

function formatNumber(num: number): string {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}만`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    const futureDays = Math.abs(diffDays)
    if (futureDays === 0) return '오늘 시작'
    if (futureDays <= 30) return `D-${futureDays}`
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
  }
  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '어제'
  if (diffDays < 7) return `${diffDays}일 전`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`
  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
}

export default function PartnerPage() {
  const isPartner = useAuthStore((s) => s.isPartner)
  const currentUser = useAuthStore((s) => s.currentUser)

  // 현재 유저의 파트너 정보 찾기
  const { data: partners } = usePartners()
  const myPartner = useMemo(
    () => partners?.find((p) => p.userId === currentUser?.id),
    [partners, currentUser?.id],
  )

  const { data: events } = useEventsByPartner(myPartner?.id ?? '')

  const stats = useMemo(() => {
    if (!events) return { total: 0, active: 0, totalParticipants: 0, participationRate: '0' }
    const active = events.filter((e) => e.status === 'active').length
    const totalParticipants = events.reduce((sum, e) => sum + e.participantCount, 0)
    const avgParticipants = events.length > 0
      ? Math.round(totalParticipants / events.length)
      : 0
    return {
      total: events.length,
      active,
      totalParticipants,
      avgParticipants,
    }
  }, [events])

  // 최근 이벤트 (최신순 5개)
  const recentEvents = useMemo(
    () =>
      events
        ?.slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5) ?? [],
    [events],
  )

  if (!isPartner) {
    return (
      <Container className="flex flex-col gap-6 lg:gap-8">
        <SectionHeader
          level="page"
          title={<>PARTNER <span className="text-primary italic">HUB</span></>}
        />
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-lg mb-4">
            파트너 전용 페이지입니다
          </p>
          <p className="text-on-surface-variant/60 text-sm">
            상단 헤더에서 파트너 모드로 전환하세요
          </p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="flex flex-col gap-6 lg:gap-8">
      <div className="flex items-center justify-between">
        <SectionHeader
          level="page"
          title={<>PARTNER <span className="text-primary italic">DASHBOARD</span></>}
          subtitle="이벤트 관리"
        />
        <Link
          href="/partner/events/new"
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          새 이벤트
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon={Calendar}
          iconColor="text-primary"
          label="총 이벤트"
          value={String(stats.total)}
        />
        <MetricCard
          icon={Zap}
          iconColor="text-secondary"
          label="진행중"
          value={String(stats.active)}
        />
        <MetricCard
          icon={Users}
          iconColor="text-tertiary"
          label="총 참여자"
          value={formatNumber(stats.totalParticipants)}
        />
        <MetricCard
          icon={Trophy}
          iconColor="text-primary"
          label="팔로워"
          value={formatNumber(myPartner?.followerCount ?? 0)}
        />
      </div>

      <section className="bg-surface-container-low rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <SectionHeader level="section" title="최근 이벤트" />
        </div>

        {recentEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-on-surface-variant">아직 생성한 이벤트가 없습니다</p>
            <Link
              href="/partner/events/new"
              className="inline-block mt-4 text-primary font-bold text-sm hover:underline"
            >
              첫 이벤트 만들기
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                href={`/partner/events/${event.id}`}
                className="flex items-center justify-between p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center shrink-0">
                    {event.status === 'active' ? (
                      <Zap className="w-5 h-5 text-secondary" />
                    ) : event.status === 'pending' ? (
                      <Clock className="w-5 h-5 text-tertiary" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-on-surface-variant" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-on-surface truncate">
                      {event.title}
                    </h4>
                    <p className="text-xs text-on-surface-variant">
                      {event.status === 'active'
                        ? `마감 ${getRelativeDate(event.endDate)}`
                        : event.status === 'pending'
                          ? `시작 ${getRelativeDate(event.startDate)}`
                          : `종료 ${getRelativeDate(event.endDate)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-on-surface tabular-nums text-sm">
                      {formatNumber(event.participantCount)}명
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      당첨 {event.winnerCount}명
                    </p>
                  </div>
                  <span
                    className={cn(
                      'text-xs font-bold px-2 py-1 rounded-md',
                      STATUS_STYLES[event.status],
                    )}
                  >
                    {STATUS_LABELS[event.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Container>
  )
}
