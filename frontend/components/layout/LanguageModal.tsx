'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Dialog } from '@/components/ui/Dialog'
import { useCurrentLocale } from '@/i18n/client'
import { supportedLocales, type SupportedLocale } from '@/i18n/settings'
import { stripLocalePrefix } from '@/i18n/navigation'

const LOCALE_META: Record<SupportedLocale, { label: string; flag: string }> = {
  ko: { label: '한국어', flag: '🇰🇷' },
  en: { label: 'English', flag: '🇺🇸' },
} as const

interface LanguageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LanguageModal({ open, onOpenChange }: LanguageModalProps) {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useCurrentLocale()

  function handleSelect(locale: SupportedLocale) {
    if (locale === currentLocale) {
      onOpenChange(false)
      return
    }

    // Set cookie for middleware
    document.cookie = `locale=${locale};path=/;max-age=${60 * 60 * 24 * 365}`

    // Navigate to the new locale path
    const strippedPath = stripLocalePrefix(pathname)
    router.push(`/${locale}${strippedPath}`)

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} variant="formSheet">
      <Dialog.Content>
        <Dialog.Header
          title="언어 선택"
          description="Language"
          showHandle
          showClose
        />
        <Dialog.Body className="space-y-1.5 pb-2">
          {supportedLocales.map((locale) => {
            const meta = LOCALE_META[locale]
            const isActive = locale === currentLocale

            return (
              <button
                key={locale}
                onClick={() => handleSelect(locale)}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all',
                  isActive
                    ? 'bg-primary/10 border border-primary/30 shadow-[0_0_16px_rgba(243,130,255,0.1)]'
                    : 'hover:bg-surface-container-high border border-transparent',
                )}
              >
                <span className="text-xl">{meta.flag}</span>
                <span
                  className={cn(
                    'flex-1 text-left text-sm font-bold',
                    isActive ? 'text-primary' : 'text-on-surface',
                  )}
                >
                  {meta.label}
                </span>
                {isActive && (
                  <Check size={16} className="text-primary" />
                )}
              </button>
            )
          })}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  )
}
