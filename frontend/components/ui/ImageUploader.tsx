'use client'

import { useState, useRef, useCallback, type ChangeEvent } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { ImagePlus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import {
  validateImageFile,
  cropImage,
  EVENT_IMAGE_SPEC,
} from '@/lib/image-utils'

interface ImageUploaderProps {
  label?: string
  currentImageUrl?: string
  onImageReady: (blob: Blob) => void
  onError?: (message: string) => void
  disabled?: boolean
  className?: string
}

/**
 * 이미지 선택 + 크롭 컴포넌트
 *
 * Flow:
 * 1. 사용자가 업로드 영역 클릭 → 파일 선택
 * 2. 파일 검증 (타입, 크기)
 * 3. 크롭 모달 (Dialog) 표시
 * 4. 크롭 확인 → Canvas 처리 → Blob 반환
 */
export function ImageUploader({
  label,
  currentImageUrl,
  onImageReady,
  onError,
  disabled = false,
  className,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [processedPreview, setProcessedPreview] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  const aspectRatio = EVENT_IMAGE_SPEC.width / EVENT_IMAGE_SPEC.height

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget

      const newCrop = centerCrop(
        makeAspectCrop(
          { unit: '%', width: 90 },
          aspectRatio,
          width,
          height,
        ),
        width,
        height,
      )
      setCrop(newCrop)
    },
    [aspectRatio],
  )

  const handleFileSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      const validation = validateImageFile(file)
      if (!validation.valid) {
        onError?.(validation.error ?? '유효하지 않은 이미지입니다.')
        return
      }

      const objectUrl = URL.createObjectURL(file)
      setPreviewSrc(objectUrl)
      setSelectedFile(file)
      setIsCropModalOpen(true)
      setCrop(undefined)
      setCompletedCrop(undefined)
    },
    [onError],
  )

  const handleCropConfirm = useCallback(async () => {
    if (!selectedFile || !completedCrop || !imgRef.current) {
      onError?.('크롭 영역을 선택해주세요.')
      return
    }

    try {
      setIsConverting(true)

      const image = imgRef.current
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height

      const cropArea = {
        x: completedCrop.x * scaleX,
        y: completedCrop.y * scaleY,
        width: completedCrop.width * scaleX,
        height: completedCrop.height * scaleY,
      }

      const processedBlob = await cropImage(selectedFile, cropArea, {
        width: EVENT_IMAGE_SPEC.width,
        height: EVENT_IMAGE_SPEC.height,
        quality: 0.9,
      })

      const processedUrl = URL.createObjectURL(processedBlob)

      if (previewSrc) URL.revokeObjectURL(previewSrc)
      if (processedPreview) URL.revokeObjectURL(processedPreview)

      setProcessedPreview(processedUrl)
      setPreviewSrc(null)
      setSelectedFile(null)
      setIsCropModalOpen(false)
      setIsConverting(false)

      onImageReady(processedBlob)
    } catch (err) {
      onError?.(err instanceof Error ? err.message : '이미지 처리에 실패했습니다.')
      setIsConverting(false)
    }
  }, [selectedFile, completedCrop, previewSrc, processedPreview, onImageReady, onError])

  const handleCropCancel = useCallback(() => {
    if (previewSrc) URL.revokeObjectURL(previewSrc)
    setPreviewSrc(null)
    setSelectedFile(null)
    setIsCropModalOpen(false)
    setCrop(undefined)
    setCompletedCrop(undefined)
  }, [previewSrc])

  const handleClick = useCallback(() => {
    if (!disabled && !isConverting) {
      fileInputRef.current?.click()
    }
  }, [disabled, isConverting])

  const displayImageUrl = processedPreview || currentImageUrl
  const showPlaceholder = !displayImageUrl

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          {label}
        </label>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isConverting}
      />

      {/* Clickable upload area — 16:9 */}
      <div
        onClick={handleClick}
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-all',
          'aspect-square',
          disabled || isConverting
            ? 'cursor-not-allowed border-outline-variant/10 opacity-50'
            : 'cursor-pointer border-outline-variant/20 hover:border-tertiary hover:shadow-[0_0_10px_rgba(129,236,255,0.15)]',
        )}
      >
        {isConverting ? (
          <div className="flex flex-col items-center gap-3 text-sm text-on-surface-variant">
            <div className="size-8 animate-spin rounded-full border-[3px] border-outline-variant/30 border-t-tertiary" />
            <span>이미지 처리 중...</span>
          </div>
        ) : showPlaceholder ? (
          <div className="flex flex-col items-center justify-center gap-2 p-5 text-on-surface-variant">
            <ImagePlus className="size-10 opacity-50" strokeWidth={1.5} />
            <span className="text-sm font-medium">이미지 선택</span>
            <span className="text-xs opacity-60">
              JPEG, PNG, WebP · 최대 {EVENT_IMAGE_SPEC.maxFileSizeMB}MB
            </span>
          </div>
        ) : (
          <div className="group relative flex size-full items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImageUrl}
              alt="이벤트 이미지 미리보기"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-sm font-bold text-white">이미지 변경</span>
            </div>
          </div>
        )}
      </div>

      {/* Crop Modal — Dialog 미사용, 전용 구현 */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleCropCancel}
          />
          {/* Modal */}
          <div className="relative flex h-full items-center justify-center p-4">
            <div className="flex max-h-[90vh] w-full max-w-[600px] flex-col overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-bright shadow-lv2">
              {/* Header */}
              <div className="shrink-0 px-6 pt-6 pb-2">
                <h2 className="font-headline text-lg font-bold text-on-surface">이미지 크롭</h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  이벤트 이미지 비율 ({EVENT_IMAGE_SPEC.aspectRatio})
                </p>
              </div>

              {/* Crop Area */}
              {previewSrc && (
                <>
                  <div className="mt-4 flex min-h-0 flex-1 justify-center rounded-2xl bg-surface-container-lowest mx-4 p-4">
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={aspectRatio}
                      minWidth={50}
                      minHeight={50}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        ref={imgRef}
                        src={previewSrc}
                        alt="크롭 미리보기"
                        onLoad={onImageLoad}
                        style={{ maxHeight: '50vh', maxWidth: '100%' }}
                      />
                    </ReactCrop>
                  </div>

                  {/* Footer */}
                  <div className="flex shrink-0 justify-end gap-3 px-6 py-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCropCancel}
                      disabled={isConverting}
                    >
                      취소
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleCropConfirm}
                      disabled={!completedCrop || isConverting}
                    >
                      {isConverting ? '처리 중...' : '확인'}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
