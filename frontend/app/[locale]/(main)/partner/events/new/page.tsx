'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { useAuthStore } from '@/stores/authStore'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

export default function EventCreatePage() {
  const router = useRouter()
  const isPartner = useAuthStore((s) => s.isPartner)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageBlob, setImageBlob] = useState<Blob | null>(null)
  const [imageError, setImageError] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [winnerCount, setWinnerCount] = useState('')

  if (!isPartner) {
    return (
      <Container className="flex flex-col gap-8 lg:gap-10">
        <SectionHeader
          level="page"
          title={<>이벤트 <span className="text-secondary italic">생성</span></>}
        />
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-lg mb-4">
            파트너만 이벤트를 생성할 수 있습니다
          </p>
          <Link
            href="/partner/join"
            className="text-primary font-bold hover:underline text-sm uppercase tracking-widest"
          >
            파트너 가입하러 가기
          </Link>
        </div>
      </Container>
    )
  }

  const handleSubmit = () => {
    router.push('/partner')
  }

  const isFormValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    startDate !== '' &&
    endDate !== '' &&
    Number(winnerCount) > 0

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
        title={<>이벤트 <span className="text-secondary italic">생성</span></>}
        subtitle="새 이벤트를 만들어 팬들과 소통하세요"
      />

      <div className="space-y-6">
        <Input
          label="이벤트 제목"
          placeholder="이벤트 제목을 입력하세요"
          value={title}
          onChange={setTitle}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            이벤트 설명
          </label>
          <textarea
            placeholder="이벤트에 대해 상세히 설명해주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className={cn(
              'bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3',
              'text-on-surface font-body placeholder:text-on-surface-variant/50',
              'focus:border-tertiary focus:shadow-[0_0_10px_rgba(129,236,255,0.2)] focus:outline-none',
              'transition-all resize-none',
            )}
          />
        </div>

        <ImageUploader
          label="이벤트 이미지 (선택)"
          onImageReady={setImageBlob}
          onError={setImageError}
        />
        {imageError && (
          <p className="text-xs text-error">{imageError}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              시작일
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={cn(
                'bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3',
                'text-on-surface font-body',
                'focus:border-tertiary focus:shadow-[0_0_10px_rgba(129,236,255,0.2)] focus:outline-none',
                'transition-all',
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              종료일
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={cn(
                'bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3',
                'text-on-surface font-body',
                'focus:border-tertiary focus:shadow-[0_0_10px_rgba(129,236,255,0.2)] focus:outline-none',
                'transition-all',
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            당첨자 수
          </label>
          <input
            type="number"
            min="1"
            placeholder="1"
            value={winnerCount}
            onChange={(e) => setWinnerCount(e.target.value)}
            className={cn(
              'bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3',
              'text-on-surface font-body placeholder:text-on-surface-variant/50',
              'focus:border-tertiary focus:shadow-[0_0_10px_rgba(129,236,255,0.2)] focus:outline-none',
              'transition-all',
            )}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          이벤트 생성하기
        </Button>
      </div>
    </Container>
  )
}
