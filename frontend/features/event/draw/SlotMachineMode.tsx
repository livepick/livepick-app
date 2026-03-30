'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import type { DrawModeProps, Participant } from './types'

const ITEM_HEIGHT = 80
const VISIBLE_ITEMS = 7
const VIEWPORT_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2)

/** easeOutCubic deceleration curve */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface SlotState {
  phase: 'idle' | 'spinning' | 'stopping' | 'revealed'
  currentRound: number
  winners: string[]
}

export function SlotMachineMode({
  participants,
  winnerCount,
  onComplete,
}: DrawModeProps) {
  const [state, setState] = useState<SlotState>({
    phase: 'idle',
    currentRound: 0,
    winners: [],
  })

  const offsetRef = useRef(0)
  const speedRef = useRef(0)
  const rafRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const stopStartTimeRef = useRef(0)
  const stopStartSpeedRef = useRef(0)
  const poolRef = useRef<Participant[]>([])

  // Build the participant pool for the current round (exclude already-won)
  const getPool = useCallback(
    (currentWinners: string[]): Participant[] => {
      const remaining = participants.filter(
        (p) => !currentWinners.includes(p.id),
      )
      return shuffleArray(remaining)
    },
    [participants],
  )

  // Get the participant at the center of the viewport based on current offset
  const getCenterParticipant = useCallback((): Participant | undefined => {
    const pool = poolRef.current
    if (pool.length === 0) return undefined
    const centerOffset = offsetRef.current + CENTER_INDEX * ITEM_HEIGHT
    const index =
      ((Math.round(centerOffset / ITEM_HEIGHT) % pool.length) + pool.length) %
      pool.length
    return pool[index]
  }, [])

  // Start a new round
  const startRound = useCallback(
    (roundIndex: number, currentWinners: string[]) => {
      const pool = getPool(currentWinners)
      poolRef.current = pool
      offsetRef.current = Math.floor(Math.random() * pool.length) * ITEM_HEIGHT
      speedRef.current = 25 + Math.random() * 10

      setState((prev) => ({
        ...prev,
        phase: 'spinning',
        currentRound: roundIndex,
      }))
    },
    [getPool],
  )

  // Animation loop
  useEffect(() => {
    if (state.phase === 'idle' || state.phase === 'revealed') return

    let running = true

    function tick() {
      if (!running) return

      if (state.phase === 'spinning') {
        offsetRef.current += speedRef.current
        forceRender()
        rafRef.current = requestAnimationFrame(tick)
      } else if (state.phase === 'stopping') {
        const elapsed = Date.now() - stopStartTimeRef.current
        const duration = 2500
        const t = Math.min(elapsed / duration, 1)
        const eased = easeOutCubic(t)

        const currentSpeed =
          stopStartSpeedRef.current * (1 - eased)
        offsetRef.current += currentSpeed
        forceRender()

        if (t >= 1) {
          // Snap to the nearest item center
          const pool = poolRef.current
          if (pool.length > 0) {
            const centerOffset =
              offsetRef.current + CENTER_INDEX * ITEM_HEIGHT
            const nearestIndex = Math.round(centerOffset / ITEM_HEIGHT)
            offsetRef.current =
              nearestIndex * ITEM_HEIGHT - CENTER_INDEX * ITEM_HEIGHT
          }
          forceRender()

          const winner = getCenterParticipant()
          if (winner) {
            const newWinners = [...state.winners, winner.id]
            setState((prev) => ({
              ...prev,
              phase: 'revealed',
              winners: newWinners,
            }))

            // Check if we need more rounds
            if (newWinners.length < winnerCount) {
              setTimeout(() => {
                startRound(state.currentRound + 1, newWinners)
              }, 1500)
            } else {
              setTimeout(() => {
                onComplete(newWinners)
              }, 2000)
            }
          }
          return
        }

        rafRef.current = requestAnimationFrame(tick)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [
    state.phase,
    state.currentRound,
    state.winners,
    winnerCount,
    onComplete,
    getCenterParticipant,
    startRound,
  ])

  // Force re-render for animation (using a render counter)
  const [, setRenderTick] = useState(0)
  function forceRender() {
    setRenderTick((t) => t + 1)
  }

  // Auto-start first round
  useEffect(() => {
    const timer = setTimeout(() => {
      startRound(0, [])
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleStop() {
    if (state.phase !== 'spinning') return
    stopStartTimeRef.current = Date.now()
    stopStartSpeedRef.current = speedRef.current
    setState((prev) => ({ ...prev, phase: 'stopping' }))
  }

  // Render the slot items
  const pool = poolRef.current
  const items: { participant: Participant; yPos: number; index: number }[] = []

  if (pool.length > 0) {
    const totalHeight = pool.length * ITEM_HEIGHT
    for (let i = 0; i < VISIBLE_ITEMS + 2; i++) {
      const rawOffset = offsetRef.current + i * ITEM_HEIGHT
      const normalizedOffset =
        ((rawOffset % totalHeight) + totalHeight) % totalHeight
      const participantIndex =
        Math.floor(normalizedOffset / ITEM_HEIGHT) % pool.length
      const yPos = i * ITEM_HEIGHT
      items.push({
        participant: pool[participantIndex],
        yPos,
        index: i,
      })
    }
  }

  const isCenter = (index: number) => index === CENTER_INDEX
  const isRevealed = state.phase === 'revealed'

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Round indicator */}
      {winnerCount > 1 && (
        <div className="flex items-center gap-2">
          <span className="text-on-surface-variant text-sm">라운드</span>
          <span className="font-headline font-bold text-primary text-lg tabular-nums">
            {state.currentRound + 1}
          </span>
          <span className="text-on-surface-variant text-sm">/</span>
          <span className="text-on-surface-variant text-sm tabular-nums">
            {winnerCount}
          </span>
        </div>
      )}

      {/* Won participants so far */}
      {state.winners.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {state.winners.map((winnerId) => {
            const p = participants.find((pp) => pp.id === winnerId)
            if (!p) return null
            return (
              <div
                key={winnerId}
                className="flex items-center gap-2 bg-surface-container rounded-full px-3 py-1.5 border border-secondary/40"
              >
                <Avatar src={p.profileImage} alt={p.nickname} size="sm" className="w-6 h-6" />
                <span className="text-xs font-bold text-secondary">
                  {p.nickname}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Slot viewport */}
      <div className="relative w-full max-w-sm mx-auto">
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

        {/* Center focus line */}
        <div
          className={cn(
            'absolute left-0 right-0 z-20 pointer-events-none border-y-2 transition-all duration-300',
            isRevealed
              ? 'border-primary shadow-[0_0_40px_rgba(243,130,255,0.5)]'
              : 'border-primary/60',
          )}
          style={{
            top: CENTER_INDEX * ITEM_HEIGHT,
            height: ITEM_HEIGHT,
          }}
        />

        {/* Slot container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden"
          style={{ height: VIEWPORT_HEIGHT }}
        >
          {items.map(({ participant, yPos, index }) => (
            <div
              key={`${index}-${participant.id}`}
              className={cn(
                'absolute left-0 right-0 flex items-center gap-4 px-4 transition-opacity',
                isCenter(index) && isRevealed
                  ? 'opacity-100'
                  : isCenter(index)
                    ? 'opacity-100'
                    : 'opacity-40',
              )}
              style={{
                top: yPos,
                height: ITEM_HEIGHT,
              }}
            >
              <Avatar
                src={participant.profileImage}
                alt={participant.nickname}
                size="lg"
                className={cn(
                  'transition-all duration-500',
                  isCenter(index) && isRevealed &&
                    'ring-4 ring-primary shadow-[0_0_24px_rgba(243,130,255,0.6)] scale-110',
                )}
              />
              <span
                className={cn(
                  'font-headline font-bold text-lg transition-all duration-500',
                  isCenter(index) && isRevealed
                    ? 'text-primary text-glow text-xl'
                    : 'text-on-surface',
                )}
              >
                {participant.nickname}
              </span>
              {isCenter(index) && isRevealed && (
                <span className="ml-auto font-headline text-sm font-bold text-primary uppercase tracking-widest animate-pulse">
                  Winner!
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* STOP button */}
      {state.phase === 'spinning' && (
        <Button
          variant="primary"
          size="lg"
          onClick={handleStop}
          className="min-w-[200px] animate-pulse"
        >
          STOP
        </Button>
      )}

      {state.phase === 'stopping' && (
        <p className="text-on-surface-variant text-sm animate-pulse">
          감속 중...
        </p>
      )}

      {state.phase === 'revealed' && state.winners.length < winnerCount && (
        <p className="text-on-surface-variant text-sm animate-pulse">
          다음 라운드 준비 중...
        </p>
      )}
    </div>
  )
}
