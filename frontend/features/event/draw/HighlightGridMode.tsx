'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import type { DrawModeProps } from './types'

const GRID_COLS = 10
const FAST_INTERVAL = 50
const MAX_INTERVAL = 500
const DECEL_STEPS = 15

interface HighlightState {
  phase: 'idle' | 'running' | 'decelerating' | 'revealed'
  highlightIndex: number
  currentRound: number
  winners: string[]
}

export function HighlightGridMode({
  participants,
  winnerCount,
  onComplete,
}: DrawModeProps) {
  const [state, setState] = useState<HighlightState>({
    phase: 'idle',
    highlightIndex: -1,
    currentRound: 0,
    winners: [],
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const decelStepRef = useRef(0)
  const winnersRef = useRef<string[]>([])

  // Keep ref in sync with state
  winnersRef.current = state.winners

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Get eligible indices (not already won)
  const getEligibleIndices = useCallback(
    (currentWinners: string[]): number[] => {
      return participants
        .map((p, i) => ({ id: p.id, index: i }))
        .filter((item) => !currentWinners.includes(item.id))
        .map((item) => item.index)
    },
    [participants],
  )

  const pickRandomEligible = useCallback(
    (currentWinners: string[]): number => {
      const eligible = getEligibleIndices(currentWinners)
      if (eligible.length === 0) return 0
      return eligible[Math.floor(Math.random() * eligible.length)]
    },
    [getEligibleIndices],
  )

  // Start running phase
  const startRunning = useCallback(
    (roundIndex: number, currentWinners: string[]) => {
      clearTimer()
      setState((prev) => ({
        ...prev,
        phase: 'running',
        currentRound: roundIndex,
      }))

      intervalRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          highlightIndex: pickRandomEligible(currentWinners),
        }))
      }, FAST_INTERVAL)
    },
    [clearTimer, pickRandomEligible],
  )

  // Handle deceleration
  const startDeceleration = useCallback(
    (currentWinners: string[]) => {
      clearTimer()
      decelStepRef.current = 0

      setState((prev) => ({ ...prev, phase: 'decelerating' }))

      function scheduleNext() {
        decelStepRef.current++
        const step = decelStepRef.current

        if (step >= DECEL_STEPS) {
          // Final stop — reveal winner
          const finalIndex = pickRandomEligible(currentWinners)
          const winnerId = participants[finalIndex]?.id

          if (winnerId) {
            const newWinners = [...currentWinners, winnerId]

            setState((prev) => ({
              ...prev,
              phase: 'revealed',
              highlightIndex: finalIndex,
              winners: newWinners,
            }))

            if (newWinners.length < winnerCount) {
              setTimeout(() => {
                startRunning(
                  newWinners.length,
                  newWinners,
                )
              }, 1500)
            } else {
              setTimeout(() => {
                onComplete(newWinners)
              }, 2000)
            }
          }
          return
        }

        // Gradually increasing interval
        const progress = step / DECEL_STEPS
        const interval =
          FAST_INTERVAL + (MAX_INTERVAL - FAST_INTERVAL) * progress

        intervalRef.current = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            highlightIndex: pickRandomEligible(currentWinners),
          }))
          scheduleNext()
        }, interval) as unknown as ReturnType<typeof setInterval>
      }

      scheduleNext()
    },
    [clearTimer, pickRandomEligible, participants, winnerCount, onComplete, startRunning],
  )

  // Auto-start
  useEffect(() => {
    const timer = setTimeout(() => {
      startRunning(0, [])
    }, 500)
    return () => {
      clearTimeout(timer)
      clearTimer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  function handleStop() {
    if (state.phase !== 'running') return
    startDeceleration(state.winners)
  }

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

      {/* Grid */}
      <div
        className="grid gap-1 w-full max-w-md mx-auto"
        style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
      >
        {participants.map((participant, index) => {
          const isHighlighted = index === state.highlightIndex
          const isWon = state.winners.includes(participant.id)
          const isCurrentWinner = isHighlighted && state.phase === 'revealed'

          return (
            <div
              key={participant.id}
              className={cn(
                'relative aspect-square rounded-lg overflow-hidden transition-all',
                isCurrentWinner
                  ? 'ring-2 ring-primary scale-125 z-10 shadow-[0_0_20px_rgba(243,130,255,0.6)] duration-500'
                  : isHighlighted
                    ? 'ring-2 ring-primary/80 scale-110 z-10 duration-75'
                    : isWon
                      ? 'ring-2 ring-secondary/60 duration-300'
                      : 'ring-1 ring-outline-variant/20 duration-75',
                isWon && !isCurrentWinner && 'opacity-60',
              )}
            >
              <img
                src={participant.profileImage}
                alt={participant.nickname}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Glow overlay for highlight */}
              {isCurrentWinner && (
                <div className="absolute inset-0 bg-primary/20 animate-pulse" />
              )}
              {/* Won badge */}
              {isWon && !isCurrentWinner && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-[8px] font-bold text-on-secondary">W</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Current highlight nickname */}
      {state.highlightIndex >= 0 && state.highlightIndex < participants.length && (
        <p
          className={cn(
            'font-headline font-bold text-lg transition-all duration-200',
            state.phase === 'revealed'
              ? 'text-primary text-glow text-xl'
              : 'text-on-surface',
          )}
        >
          {participants[state.highlightIndex].nickname}
          {state.phase === 'revealed' && (
            <span className="ml-2 text-sm uppercase tracking-widest animate-pulse">
              Winner!
            </span>
          )}
        </p>
      )}

      {/* Won list */}
      {state.winners.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {state.winners.map((winnerId) => {
            const p = participants.find((pp) => pp.id === winnerId)
            if (!p) return null
            return (
              <div
                key={winnerId}
                className="flex items-center gap-1.5 bg-surface-container rounded-full px-3 py-1.5 border border-secondary/40"
              >
                <span className="text-xs font-bold text-secondary">
                  {p.nickname}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* STOP button */}
      {state.phase === 'running' && (
        <Button
          variant="primary"
          size="lg"
          onClick={handleStop}
          className="min-w-[200px] animate-pulse"
        >
          STOP
        </Button>
      )}

      {state.phase === 'decelerating' && (
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
