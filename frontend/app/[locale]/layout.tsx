import { TranslationsProvider } from '@/i18n/client'
import { initTranslations } from '@/i18n/server'
import { supportedLocales, type SupportedLocale } from '@/i18n/settings'
import { Providers } from '@/providers'

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const validLocale = (supportedLocales as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'ko'

  const resources = await initTranslations(validLocale)

  return (
    <TranslationsProvider locale={validLocale} resources={resources}>
      <Providers>
        {children}
      </Providers>
    </TranslationsProvider>
  )
}
