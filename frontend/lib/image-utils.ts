/**
 * Image Processing Utilities for LivePick
 *
 * Canvas 기반 이미지 크롭 & 리사이즈 유틸리티.
 * Setto ImageUploader 패턴 참조.
 */

export interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageProcessingOptions {
  width: number
  height: number
  quality?: number
  format?: 'image/jpeg' | 'image/png' | 'image/webp'
}

export interface ImageSpec {
  width: number
  height: number
  aspectRatio: string
  maxFileSizeMB: number
}

/** 이벤트 이미지 스펙: 1:1, 1024x1024 */
export const EVENT_IMAGE_SPEC: ImageSpec = {
  width: 1024,
  height: 1024,
  aspectRatio: '1:1',
  maxFileSizeMB: 5,
} as const

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export interface ValidationResult {
  valid: boolean
  error?: string
}

export function validateImageFile(file: File): ValidationResult {
  if (!ALLOWED_MIME_TYPES.includes(file.type as typeof ALLOWED_MIME_TYPES[number])) {
    return { valid: false, error: `지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP만 가능)` }
  }

  const maxBytes = EVENT_IMAGE_SPEC.maxFileSizeMB * 1024 * 1024
  if (file.size > maxBytes) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
    return { valid: false, error: `파일 크기(${sizeMB}MB)가 최대 ${EVENT_IMAGE_SPEC.maxFileSizeMB}MB를 초과합니다.` }
  }

  return { valid: true }
}

function loadImage(source: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(source)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('이미지를 불러올 수 없습니다.'))
    }
    img.src = url
  })
}

export async function cropImage(
  source: File | Blob,
  cropArea: CropArea,
  options: ImageProcessingOptions,
): Promise<Blob> {
  const img = await loadImage(source)
  const targetWidth = options.width
  const targetHeight = options.height
  const format = options.format ?? (source.type === 'image/png' ? 'image/png' : 'image/jpeg')
  const quality = options.quality ?? 0.9

  const canvas = document.createElement('canvas')
  canvas.width = targetWidth
  canvas.height = targetHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context를 생성할 수 없습니다.')

  if (format !== 'image/png') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, targetWidth, targetHeight)
  }

  ctx.drawImage(
    img,
    cropArea.x, cropArea.y, cropArea.width, cropArea.height,
    0, 0, targetWidth, targetHeight,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Blob 변환에 실패했습니다.'))),
      format,
      quality,
    )
  })
}
