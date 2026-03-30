'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { SectionHeader } from '@/components/layout/SectionHeader'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'
import { PARTNER_CATEGORIES } from '@/features/partner/types'
import type { PartnerCategory } from '@/features/partner/types'
import { cn } from '@/lib/cn'

export default function PartnerJoinPage() {
  const router = useRouter()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)
  const toggleAuth = useAuthStore((s) => s.toggleAuth)

  const [channelName, setChannelName] = useState('')
  const [channelUrl, setChannelUrl] = useState('')
  const [category, setCategory] = useState<PartnerCategory | ''>('')
  const [bio, setBio] = useState('')

  if (!isLoggedIn) {
    return (
      <Container className="flex flex-col gap-8 lg:gap-10">
        <SectionHeader
          level="page"
          title={<>파트너가 <span className="text-primary italic">되어보세요!</span></>}
        />
        <div className="text-center py-20">
          <p className="text-on-surface-variant text-lg mb-4">
            로그인이 필요합니다
          </p>
          <Link
            href="/auth"
            className="text-primary font-bold hover:underline text-sm uppercase tracking-widest"
          >
            로그인하러 가기
          </Link>
        </div>
      </Container>
    )
  }

  const handleSubmit = () => {
    toggleAuth()
    router.push('/partner')
  }

  const isFormValid =
    channelName.trim().length > 0 &&
    channelUrl.trim().length > 0 &&
    category !== ''

  return (
    <Container maxWidth="672px" className="flex flex-col gap-8 lg:gap-10">
      <SectionHeader
        level="page"
        title={<>파트너가 <span className="text-primary italic">되어보세요!</span></>}
        subtitle="이벤트를 만들고 팬들과 소통하세요"
      />

      <div className="space-y-6">
        <Input
          label="채널명"
          placeholder="채널 이름을 입력하세요"
          value={channelName}
          onChange={setChannelName}
        />

        <Input
          label="채널 URL"
          placeholder="https://youtube.com/@channel"
          value={channelUrl}
          onChange={setChannelUrl}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            카테고리
          </label>
          <div className="flex flex-wrap gap-2">
            {PARTNER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all',
                  category === cat
                    ? 'bg-secondary text-on-secondary shadow-[0_0_15px_rgba(162,243,31,0.2)]'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline-variant/20',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            소개 (선택)
          </label>
          <textarea
            placeholder="채널에 대해 간단히 소개해주세요"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className={cn(
              'bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3',
              'text-on-surface font-body placeholder:text-on-surface-variant/50',
              'focus:border-tertiary focus:shadow-[0_0_10px_rgba(129,236,255,0.2)] focus:outline-none',
              'transition-all resize-none',
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
          파트너 가입하기
        </Button>
      </div>
    </Container>
  )
}
