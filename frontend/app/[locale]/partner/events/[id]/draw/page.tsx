'use client'

import { use, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { DetailPageShell } from '@/components/layout/DetailPageShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { useEvent } from '@/features/event/hooks'
import { useAuthStore } from '@/stores/authStore'
import { MOCK_PARTICIPANTS } from '@/mocks/participants'
import { DrawModeSelector } from '@/features/event/draw/DrawModeSelector'
import { SlotMachineMode } from '@/features/event/draw/SlotMachineMode'
import { HighlightGridMode } from '@/features/event/draw/HighlightGridMode'
import { DrawResult } from '@/features/event/draw/DrawResult'
import type { DrawPhase, DrawModeId } from '@/features/event/draw/types'

export default function DrawPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>
}) {
  const { id, locale } = use(params)
  const router = useRouter()
  const { data: event, isLoading } = useEvent(id)
  const isPartner = useAuthStore((s) => s.isPartner)

  const [phase, setPhase] = useState<DrawPhase>('select')
  const [selectedMode, setSelectedMode] = useState<DrawModeId>('slot')
  const [winnerCount, setWinnerCount] = useState(0)
  const [winnerIds, setWinnerIds] = useState<string[]>([])

  // Use mock participants (in production this would come from the API)
  const participants = MOCK_PARTICIPANTS

  const winnerParticipants = useMemo(
    () => participants.filter((p) => winnerIds.includes(p.id)),
    [participants, winnerIds],
  )

  // If event already has winners, show result immediately
  const hasExistingWinners = Boolean(event?.winners && event.winners.length > 0)

  const existingWinnerParticipants = useMemo(() => {
    if (!event?.winners) return []
    return participants.filter((p) => event.winners!.includes(p.id))
  }, [event?.winners, participants])

  function handleStart(mode: DrawModeId, count: number) {
    setSelectedMode(mode)
    setWinnerCount(count)
    setPhase('running')
  }

  function handleDrawComplete(ids: string[]) {
    setWinnerIds(ids)
    setPhase('result')
  }

  function handleBack() {
    router.push(`/${locale}/partner`)
  }

  function handleBackToManage() {
    router.back()
  }

  // Access check: partner only
  if (!isPartner) {
    return (
      <DetailPageShell className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-on-surface-variant text-lg">
          파트너만 추첨을 진행할 수 있습니다
        </p>
        <button
          onClick={handleBack}
          className="text-primary font-bold hover:underline text-sm uppercase tracking-widest"
        >
          돌아가기
        </button>
      </DetailPageShell>
    )
  }

  if (isLoading) {
    return (
      <DetailPageShell className="pt-8 pb-12">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-6 w-32 mb-8" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </DetailPageShell>
    )
  }

  if (!event) {
    return (
      <DetailPageShell className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-on-surface-variant text-lg">
          이벤트를 찾을 수 없습니다
        </p>
        <button
          onClick={handleBack}
          className="text-primary font-bold hover:underline text-sm uppercase tracking-widest"
        >
          돌아가기
        </button>
      </DetailPageShell>
    )
  }

  // Already drawn: show result
  if (hasExistingWinners && phase === 'select') {
    return (
      <DetailPageShell className="pt-8 pb-12">
        <button
          onClick={handleBackToManage}
          className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors w-fit text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          이벤트 관리
        </button>
        <DrawResult
          winners={existingWinnerParticipants}
          eventTitle={event.title}
          onBack={handleBackToManage}
        />
      </DetailPageShell>
    )
  }

  return (
    <DetailPageShell className="pt-8 pb-12">
      {/* Back button (only in select phase) */}
      {phase === 'select' && (
        <button
          onClick={handleBackToManage}
          className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors w-fit text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          이벤트 관리
        </button>
      )}

      {/* Event title */}
      <div className="text-center mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-black tracking-tighter text-on-background">
          {event.title}
        </h1>
        {phase !== 'result' && (
          <p className="text-on-surface-variant text-sm mt-1">
            참여자 {participants.length}명
          </p>
        )}
      </div>

      {/* Phase content */}
      {phase === 'select' && (
        <div className="draw-fade-in">
          <DrawModeSelector
            maxWinners={event.winnerCount}
            participantCount={participants.length}
            onStart={handleStart}
          />
        </div>
      )}

      {phase === 'running' && selectedMode === 'slot' && (
        <div className="draw-fade-in">
          <SlotMachineMode
            participants={participants}
            winnerCount={winnerCount}
            onComplete={handleDrawComplete}
          />
        </div>
      )}

      {phase === 'running' && selectedMode === 'highlight' && (
        <div className="draw-fade-in">
          <HighlightGridMode
            participants={participants}
            winnerCount={winnerCount}
            onComplete={handleDrawComplete}
          />
        </div>
      )}

      {phase === 'result' && (
        <div className="draw-fade-in">
          <DrawResult
            winners={winnerParticipants}
            eventTitle={event.title}
            onBack={handleBackToManage}
          />
        </div>
      )}
    </DetailPageShell>
  )
}
