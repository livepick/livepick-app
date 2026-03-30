'use client'

import { createContext, useContext, useRef } from 'react'
import i18next, { type i18n } from 'i18next'
import { I18nextProvider, useTranslation as useI18nextTranslation } from 'react-i18next'
import { defaultLocale, type SupportedLocale } from './settings'

const LocaleContext = createContext<SupportedLocale>(defaultLocale)

interface TranslationsProviderProps {
  locale: SupportedLocale
  resources: Record<string, unknown>
  children: React.ReactNode
}

export function TranslationsProvider({
  locale,
  resources,
  children,
}: TranslationsProviderProps) {
  const instanceRef = useRef<i18n | null>(null)

  if (!instanceRef.current) {
    const instance = i18next.createInstance()
    instance.init({
      lng: locale,
      resources: {
        [locale]: { translation: resources },
      },
      interpolation: { escapeValue: false },
    })
    instanceRef.current = instance
  }

  return (
    <LocaleContext.Provider value={locale}>
      <I18nextProvider i18n={instanceRef.current}>
        {children}
      </I18nextProvider>
    </LocaleContext.Provider>
  )
}

export function useCurrentLocale(): SupportedLocale {
  return useContext(LocaleContext)
}

export { useI18nextTranslation as useTranslation }
