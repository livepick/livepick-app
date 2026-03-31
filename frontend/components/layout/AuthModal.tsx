'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/authStore'

/* ── Google icon (inline SVG, same as auth page) ── */

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

/* ── Steps ── */

type AuthStep = 'login' | 'nickname'

/* ── AuthModal ── */

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const toggleAuth = useAuthStore((s) => s.toggleAuth)
  const [step, setStep] = useState<AuthStep>('login')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')

  const handleGoogleSignIn = () => {
    // TODO: real OAuth — for now go to nickname step
    setStep('nickname')
  }

  const handleNicknameSubmit = () => {
    if (nickname.trim().length < 2) {
      setError('닉네임은 최소 2자 이상이어야 합니다')
      return
    }
    // TODO: save nickname to server
    toggleAuth()
    handleClose(false)
  }

  const handleClose = (value: boolean) => {
    onOpenChange(value)
    if (!value) {
      setStep('login')
      setNickname('')
      setError('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose} variant="formSheet">
      <Dialog.Content>
        {step === 'login' && (
          <>
            <Dialog.Header
              title="로그인"
              description="LivePick에 오신 것을 환영합니다"
              showHandle
            />

            <Dialog.Body className="space-y-3 pb-2">
              <button
                onClick={handleGoogleSignIn}
                className={cn(
                  'flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl',
                  'bg-surface-container-high border border-outline-variant/10',
                  'text-on-surface text-sm font-medium',
                  'hover:bg-surface-container-highest transition-colors',
                )}
              >
                <GoogleIcon />
                Google로 로그인
              </button>
            </Dialog.Body>

            <div className="px-6 pb-5 pt-1 text-center space-y-2">
              <p className="text-xs text-on-surface-variant">
                계정이 없으신가요?{' '}
                <button
                  onClick={handleGoogleSignIn}
                  className="text-primary font-medium hover:underline"
                >
                  회원가입
                </button>
              </p>
              <p className="text-[11px] text-on-surface-variant/50 leading-relaxed">
                계속하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다
              </p>
            </div>
          </>
        )}

        {step === 'nickname' && (
          <>
            <Dialog.Header
              title="닉네임 설정"
              description="LivePick에서 사용할 닉네임을 입력하세요"
              showHandle
              showClose
            />

            <Dialog.Body className="space-y-4 pb-2">
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
                onClick={handleNicknameSubmit}
                disabled={nickname.trim().length === 0}
              >
                시작하기
              </Button>
            </Dialog.Body>
          </>
        )}
      </Dialog.Content>
    </Dialog>
  )
}
