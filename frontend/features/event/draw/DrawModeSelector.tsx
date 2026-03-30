'use client'

import { useState } from 'react'
import { Dices, LayoutGrid, Minus, Plus, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { DRAW_MODE_CONFIGS } from './registry'
import type { DrawModeId } from './types'

const ICON_MAP = {
  Dices,
  LayoutGrid,
} as const

interface DrawModeSelectorProps {
  maxWinners: number
  participantCount: number
  onStart: (mode: DrawModeId, winnerCount: number) => void
}

export function DrawModeSelector({
  maxWinners,
  participantCount,
  onStart,
}: DrawModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<DrawModeId>('slot')
  const [winnerCount, setWinnerCount] = useState(maxWinners)

  const effectiveWinnerCount = Math.min(winnerCount, participantCount)
  const isOverflow = winnerCount > participantCount

  function handleDecrement() {
    setWinnerCount((prev) => Math.max(1, prev - 1))
  }

  function handleIncrement() {
    setWinnerCount((prev) => prev + 1)
  }

  function handleStart() {
    onStart(selectedMode, effectiveWinnerCount)
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="font-headline text-2xl md:text-3xl font-black tracking-tight text-on-background mb-2">
          추첨 방식 선택
        </h2>
        <p className="text-on-surface-variant text-sm">
          게임 모드를 선택하고 당첨자 수를 설정하세요
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {(Object.values(DRAW_MODE_CONFIGS)).map((config) => {
          const IconComponent = ICON_MAP[config.icon as keyof typeof ICON_MAP]
          const isSelected = selectedMode === config.id

          return (
            <button
              key={config.id}
              onClick={() => setSelectedMode(config.id)}
              className={cn(
                'relative rounded-2xl p-5 text-left transition-all duration-200',
                'border-2',
                isSelected
                  ? 'border-primary bg-surface-container-high neon-glow-primary'
                  : 'border-outline-variant/30 bg-surface-container hover:border-outline-variant/60',
              )}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-primary" />
              )}
              <IconComponent
                className={cn(
                  'w-8 h-8 mb-3',
                  isSelected ? 'text-primary' : 'text-on-surface-variant',
                )}
              />
              <p className="font-headline font-bold text-on-surface mb-1">
                {config.label}
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {config.description}
              </p>
            </button>
          )
        })}
      </div>

      <div className="w-full bg-surface-container rounded-2xl p-5">
        <p className="text-sm text-on-surface-variant mb-3 text-center">
          당첨자 수
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleDecrement}
            disabled={winnerCount <= 1}
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
              'border border-outline-variant/40',
              winnerCount <= 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-surface-container-high',
            )}
          >
            <Minus className="w-4 h-4 text-on-surface" />
          </button>
          <span className="font-headline text-4xl font-black text-on-surface tabular-nums min-w-[3ch] text-center">
            {winnerCount}
          </span>
          <button
            onClick={handleIncrement}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/40 hover:bg-surface-container-high transition-colors"
          >
            <Plus className="w-4 h-4 text-on-surface" />
          </button>
        </div>
        {isOverflow && (
          <div className="flex items-center gap-2 mt-3 justify-center">
            <AlertTriangle className="w-4 h-4 text-error" />
            <p className="text-xs text-error">
              참여자({participantCount}명)보다 많습니다. {participantCount}명만 추첨됩니다.
            </p>
          </div>
        )}
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleStart}
        disabled={participantCount === 0}
      >
        추첨 시작
      </Button>
    </div>
  )
}
