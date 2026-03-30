import { create } from 'zustand'
import type { User } from '@/features/auth/types'

const MOCK_USER: User = {
  id: 'u1',
  email: 'user@example.com',
  nickname: '테스트유저',
  profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-iSjGM7JN7_Hf5OXH_TxFXv2GOrIw2GGUrh1Xkk8Uu1cyDabBi-kHZ3M3L2yqbtUD1M9fePLnGlxo-ATeIEV3uKFVpQUVTUGrB9zUL18v6CRVlomNGg64VMIJd2hT4r0Lr6aH00TJbbaU2VGzFAr7cbgAT0uz3vAOZSPYUVuARz9aPzZWbu9RDheHtvhpyPDl40tXQOk0Vu-J1I-gUuiNYQY4NoyDJvNOo4WbiF2s6MVusldHOfwD69Xs8kGwsFN8_k_tlENo44I',
  isPartner: false,
  createdAt: '2025-01-01T00:00:00Z',
}

const MOCK_PARTNER_USER: User = {
  id: 'u2',
  email: 'partner@example.com',
  nickname: '먹방의 신',
  profileImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyNizw4IJovu6RCpxUaWaQKRhKG2wLD2H2OCKanw9E82FspDiq26svfZW3tcVlzCLUifv2p2cqhVGlphI_5Ot2JpPFZiT5MzwTs7fHkCZgZQ4xkgUiTt7PgbMQVPzx9Bxh2sngzrCPGu3h8v9UC6pgxKLjGicdrkAykJ8VRNVIBMSTN9q0ZiVUxyQmBIesj03kubMJASIWBbMeD-7f0slC_k9HlS-oouv2b6chAfaPgDF-Rm9B5vlkONJH-fzxBK9VqFFOKPzD9eU',
  isPartner: true,
  createdAt: '2025-01-01T00:00:00Z',
}

const AUTH_MODES = ['guest', 'user', 'partner'] as const
type AuthMode = (typeof AUTH_MODES)[number]

interface AuthState {
  mode: AuthMode
  isLoggedIn: boolean
  currentUser: User | null
  isPartner: boolean
  toggleAuth: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  mode: 'guest',
  isLoggedIn: false,
  currentUser: null,
  isPartner: false,
  toggleAuth: () => {
    const currentIndex = AUTH_MODES.indexOf(get().mode)
    const nextMode = AUTH_MODES[(currentIndex + 1) % AUTH_MODES.length]
    const nextUser =
      nextMode === 'user'
        ? MOCK_USER
        : nextMode === 'partner'
          ? MOCK_PARTNER_USER
          : null
    set({
      mode: nextMode,
      isLoggedIn: nextMode !== 'guest',
      currentUser: nextUser,
      isPartner: nextMode === 'partner',
    })
  },
}))
