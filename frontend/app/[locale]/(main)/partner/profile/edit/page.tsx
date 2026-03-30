'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { usePartners } from '@/features/partner/hooks'
import { PROFILE_IMAGE_SPEC, COVER_IMAGE_SPEC } from '@/lib/image-utils'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function ProfileEditPage() {
  const router = useRouter()
  const isPartner = useAuthStore((s) => s.isPartner)
  const currentUser = useAuthStore((s) => s.currentUser)

  const { data: partners } = usePartners()
  const myPartner = useMemo(
    () => partners?.find((p) => p.userId === currentUser?.id),
    [partners, currentUser?.id],
  )

  const [bio, setBio] = useState(myPartner?.bio ?? '')
  const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null)
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null)
  const [imageError, setImageError] = useState('')

  if (!isPartner) {
    return (
      <Container className="flex flex-col gap-6 lg:gap-8">
        <SectionHeader
          level="page"
          title="프로필 편집"
        />
        <p className="text-center text-on-surface-variant py-20">
          파트너 전용 페이지입니다
        </p>
      </Container>
    )
  }

  const handleSave = () => {
    // TODO: API 연동
    router.push('/partner')
  }

  return (
    <Container maxWidth="672px" className="flex flex-col gap-6 lg:gap-8">
      <Link
        href="/partner"
        className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors w-fit text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        대시보드
      </Link>

      <SectionHeader
        level="page"
        title={<>프로필 <span className="text-primary italic">편집</span></>}
        subtitle="팬에게 보여지는 프로필을 관리하세요"
      />

      <div className="space-y-8">
        {/* 섬네일 이미지 */}
        <ImageUploader
          label="섬네일 이미지"
          currentImageUrl={myPartner?.profileImage}
          onImageReady={setThumbnailBlob}
          onError={setImageError}
          imageSpec={PROFILE_IMAGE_SPEC}
        />

        {/* 커버 이미지 */}
        <ImageUploader
          label="커버 이미지"
          currentImageUrl={myPartner?.coverImage || undefined}
          onImageReady={setCoverBlob}
          onError={setImageError}
          imageSpec={COVER_IMAGE_SPEC}
        />

        {imageError && (
          <p className="text-xs text-error">{imageError}</p>
        )}

        {/* 소개글 */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            소개글
          </label>
          <textarea
            placeholder="채널에 대한 소개글을 작성해주세요"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={300}
            className={cn(
              'bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3',
              'text-on-surface font-body placeholder:text-on-surface-variant/50',
              'focus:border-tertiary focus:shadow-[0_0_10px_rgba(129,236,255,0.2)] focus:outline-none',
              'transition-all resize-none',
            )}
          />
          <span className="text-xs text-on-surface-variant/60 text-right">
            {bio.length}/300
          </span>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSave}
        >
          저장하기
        </Button>
      </div>
    </Container>
  )
}
