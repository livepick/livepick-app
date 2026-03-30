'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function NicknamePage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (nickname.trim().length < 2) {
      setError('닉네임은 최소 2자 이상이어야 합니다')
      return
    }
    router.push('/')
  }

  return (
    <Container maxWidth="448px" className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center mb-10 w-full">
        <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter text-on-background mb-3">
          닉네임 설정
        </h1>
        <p className="font-body text-on-surface-variant text-sm uppercase tracking-widest">
          LivePick에서 사용할 닉네임을 입력하세요
        </p>
      </div>

      <div className="space-y-6 w-full">
        <Input
          label="Nickname"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(value) => {
            setNickname(value)
            if (error) setError('')
          }}
          error={error}
        />

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSubmit}
          disabled={nickname.trim().length === 0}
        >
          시작하기
        </Button>
      </div>
    </Container>
  )
}
