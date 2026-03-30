'use client'

import { Container } from '@/components/layout/Container'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { PartnerCard } from '@/features/partner/components/PartnerCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useFollowing } from '@/features/follow/hooks'
import { useAuthStore } from '@/stores/authStore'

export default function FollowingPage() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const { data: partners, isLoading } = useFollowing()

  return (
    <Container className="flex flex-col gap-6 lg:gap-8">
      <SectionHeader
        level="page"
        title={<>FOLLOW<span className="text-secondary italic">ING</span></>}
        subtitle="YOUR CREATORS"
      />

      {!isLoggedIn ? (
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-lg mb-4">
            로그인하여 팔로우한 크리에이터를 확인하세요
          </p>
          <p className="text-on-surface-variant/60 text-sm">
            상단 헤더에서 인증 모드를 전환할 수 있습니다
          </p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
          ))}
        </div>
      ) : partners && partners.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-lg">
            아직 팔로우한 크리에이터가 없습니다
          </p>
        </div>
      )}
    </Container>
  )
}
