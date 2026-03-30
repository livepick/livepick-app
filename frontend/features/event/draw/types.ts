export const DRAW_MODES = ['slot', 'highlight'] as const
export type DrawModeId = (typeof DRAW_MODES)[number]

export const DRAW_PHASES = ['select', 'running', 'result'] as const
export type DrawPhase = (typeof DRAW_PHASES)[number]

export interface Participant {
  id: string
  nickname: string
  profileImage: string
}

export interface DrawModeProps {
  participants: Participant[]
  winnerCount: number
  onComplete: (winnerIds: string[]) => void
}

export interface DrawModeConfig {
  id: DrawModeId
  label: string
  description: string
  icon: string
}
