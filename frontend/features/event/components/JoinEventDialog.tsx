'use client'

import { useState, useCallback } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface JoinEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: JoinFormData) => void
}

export interface JoinFormData {
  name: string
  phone: string
  zonecode: string
  address: string
  addressDetail: string
}

export function JoinEventDialog({ open, onOpenChange, onSubmit }: JoinEventDialogProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [zonecode, setZonecode] = useState('')
  const [address, setAddress] = useState('')
  const [addressDetail, setAddressDetail] = useState('')
  const [errors, setErrors] = useState<Partial<Record<keyof JoinFormData, string>>>({})

  const resetForm = useCallback(() => {
    setName('')
    setPhone('')
    setZonecode('')
    setAddress('')
    setAddressDetail('')
    setErrors({})
  }, [])

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 3) return digits
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
  }

  function handlePhoneChange(value: string) {
    setPhone(formatPhone(value))
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof JoinFormData, string>> = {}

    if (!name.trim()) next.name = '이름을 입력해주세요'

    const phoneDigits = phone.replace(/\D/g, '')
    if (!phoneDigits) next.phone = '전화번호를 입력해주세요'
    else if (phoneDigits.length < 10) next.phone = '올바른 전화번호를 입력해주세요'

    if (!address.trim()) next.address = '주소를 검색해주세요'
    if (address.trim() && !addressDetail.trim()) next.addressDetail = '상세주소를 입력해주세요'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onSubmit({
      name: name.trim(),
      phone,
      zonecode,
      address: address.trim(),
      addressDetail: addressDetail.trim(),
    })
    handleOpenChange(false)
  }

  function handleSearchAddress() {
    if (!window.daum?.Postcode) return
    new window.daum.Postcode({
      oncomplete(data: DaumPostcodeData) {
        setZonecode(data.zonecode)
        setAddress(data.roadAddress || data.jibunAddress)
        setErrors((prev) => ({ ...prev, address: undefined }))
      },
    }).open()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} variant="formSheet">
      <Dialog.Content variant="formSheet">
        <Dialog.Header
          title="이벤트 참여"
          description="당첨 시 상품 지급을 위해 정보를 입력해주세요"
          showHandle
        />

        <Dialog.Body className="flex flex-col gap-5">
          {/* Name */}
          <Input
            label="이름"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(v) => {
              setName(v)
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
            }}
            error={errors.name}
          />

          {/* Phone */}
          <Input
            label="전화번호"
            placeholder="010-0000-0000"
            value={phone}
            onChange={handlePhoneChange}
            error={errors.phone}
          />

          {/* Address — Kakao Postcode */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              주소
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                placeholder="주소를 검색하세요"
                value={address ? `(${zonecode}) ${address}` : ''}
                onClick={handleSearchAddress}
                className={`flex-1 min-w-0 bg-surface-container-lowest border border-outline-variant/10 rounded-xl px-4 py-3
                  text-on-surface font-body placeholder:text-on-surface-variant/50 cursor-pointer
                  focus:border-tertiary focus:shadow-[0_0_10px_rgba(129,236,255,0.2)] focus:outline-none
                  transition-all
                  ${errors.address ? 'border-error focus:border-error focus:shadow-[0_0_10px_rgba(255,110,132,0.2)]' : ''}
                `}
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSearchAddress}
                className="shrink-0 whitespace-nowrap"
              >
                주소검색
              </Button>
            </div>
            {errors.address && (
              <span className="text-xs text-error">{errors.address}</span>
            )}
          </div>

          {/* Address Detail */}
          {address && (
            <Input
              label="상세주소"
              placeholder="동/호수 등 상세주소를 입력하세요"
              value={addressDetail}
              onChange={(v) => {
                setAddressDetail(v)
                if (errors.addressDetail) setErrors((prev) => ({ ...prev, addressDetail: undefined }))
              }}
              error={errors.addressDetail}
            />
          )}
        </Dialog.Body>

        <div className="px-6 pb-2">
          <p className="text-xs text-on-surface-variant/60 leading-relaxed">
            입력하신 정보가 정확하지 않아 발생하는 지급 오류는 당첨자 본인에게 책임이 있습니다.
          </p>
        </div>

        <Dialog.Footer className="flex-col gap-2 sm:flex-row">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
          >
            참여하기
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  )
}
