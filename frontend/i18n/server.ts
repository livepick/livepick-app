import type { SupportedLocale } from './settings'

const resourceCache = new Map<string, Record<string, unknown>>()

export async function initTranslations(
  locale: SupportedLocale,
): Promise<Record<string, unknown>> {
  if (resourceCache.has(locale)) {
    return resourceCache.get(locale)!
  }

  const resources = (await import(`./resources/${locale}.json`)).default as Record<string, unknown>
  resourceCache.set(locale, resources)
  return resources
}
