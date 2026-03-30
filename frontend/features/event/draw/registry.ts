import type { DrawModeId, DrawModeConfig } from './types'

export const DRAW_MODE_CONFIGS: Record<DrawModeId, DrawModeConfig> = {
  slot: {
    id: 'slot',
    label: '슬롯머신',
    description: '참여자가 세로로 빠르게 스크롤되며 한 명씩 당첨자를 선정합니다.',
    icon: 'Dices',
  },
  highlight: {
    id: 'highlight',
    label: '하이라이트 격자',
    description: '100명의 참여자 격자에서 하이라이트가 이동하며 당첨자를 선정합니다.',
    icon: 'LayoutGrid',
  },
} as const
