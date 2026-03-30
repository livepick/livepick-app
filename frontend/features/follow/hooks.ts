import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MOCK_FOLLOWS } from '@/mocks/follows'
import { MOCK_PARTNERS } from '@/mocks/partners'
import type { Follow } from './types'
import type { Partner } from '@/features/partner/types'
import { useAuthStore } from '@/stores/authStore'

export const followKeys = {
  all: ['follows'] as const,
  lists: () => [...followKeys.all, 'list'] as const,
  byUser: (userId: string) => [...followKeys.lists(), userId] as const,
}

let mockFollows = [...MOCK_FOLLOWS]

async function fetchFollowing(userId: string): Promise<Partner[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const followedPartnerIds = mockFollows
    .filter((f) => f.userId === userId)
    .map((f) => f.partnerId)
  return MOCK_PARTNERS.filter((p) => followedPartnerIds.includes(p.id))
}

async function toggleFollow(
  userId: string,
  partnerId: string,
): Promise<{ followed: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const existingIndex = mockFollows.findIndex(
    (f) => f.userId === userId && f.partnerId === partnerId,
  )
  if (existingIndex >= 0) {
    mockFollows = mockFollows.filter((_, i) => i !== existingIndex)
    return { followed: false }
  }
  const newFollow: Follow = {
    id: `f${Date.now()}`,
    userId,
    partnerId,
    createdAt: new Date().toISOString(),
  }
  mockFollows = [...mockFollows, newFollow]
  return { followed: true }
}

export function useFollowing() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const userId = currentUser?.id ?? ''

  return useQuery({
    queryKey: followKeys.byUser(userId),
    queryFn: () => fetchFollowing(userId),
    enabled: Boolean(userId),
  })
}

export function useIsFollowing(partnerId: string): boolean {
  const currentUser = useAuthStore((s) => s.currentUser)
  const userId = currentUser?.id ?? ''
  return mockFollows.some(
    (f) => f.userId === userId && f.partnerId === partnerId,
  )
}

export function useToggleFollow() {
  const queryClient = useQueryClient()
  const currentUser = useAuthStore((s) => s.currentUser)

  return useMutation({
    mutationFn: (partnerId: string) =>
      toggleFollow(currentUser?.id ?? '', partnerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: followKeys.all })
    },
  })
}
