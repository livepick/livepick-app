'use client'

import { cn } from '@/lib/cn'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import type { Participant } from './types'

interface DrawResultProps {
  winners: Participant[]
  eventTitle: string
  onBack: () => void
}

export function DrawResult({ winners, eventTitle, onBack }: DrawResultProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto">
      <div className="text-center">
        <p className="text-primary font-headline font-bold text-sm uppercase tracking-[0.2em] mb-2">
          Draw Complete
        </p>
        <h2 className="font-headline text-3xl md:text-4xl font-black tracking-tight text-on-background mb-2 text-glow">
          추첨 완료!
        </h2>
        <p className="text-on-surface-variant text-sm">
          {eventTitle}
        </p>
      </div>

      <div className="w-full space-y-3">
        {winners.map((winner, index) => (
          <div
            key={winner.id}
            className={cn(
              'flex items-center gap-4 p-4 rounded-2xl',
              'bg-surface-container-high border border-primary/20',
              'neon-glow-primary',
            )}
          >
            <span className="font-headline font-black text-2xl text-primary/60 tabular-nums min-w-[2ch] text-right">
              {index + 1}
            </span>
            <Avatar
              src={winner.profileImage}
              alt={winner.nickname}
              size="lg"
              className="ring-2 ring-primary/40"
            />
            <div className="flex-1">
              <p className="font-headline font-bold text-on-surface text-lg">
                {winner.nickname}
              </p>
              <p className="text-xs text-on-surface-variant">
                ID: {winner.id}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-sm">&#x2605;</span>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onClick={onBack}
      >
        이벤트 관리로 돌아가기
      </Button>
    </div>
  )
}
