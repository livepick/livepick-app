'use client'

import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { useToggleFollow, useIsFollowing } from '../hooks'
import { useAuthStore } from '@/stores/authStore'

interface FollowButtonProps {
  partnerId: string
  className?: string
}

export function FollowButton({ partnerId, className }: FollowButtonProps) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const isFollowing = useIsFollowing(partnerId)
  const { mutate, isPending } = useToggleFollow()

  const handleClick = () => {
    if (!isLoggedIn) return
    mutate(partnerId)
  }

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'primary'}
      size="sm"
      disabled={!isLoggedIn || isPending}
      onClick={handleClick}
      className={cn(className)}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  )
}
