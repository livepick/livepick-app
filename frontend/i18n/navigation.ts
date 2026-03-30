import { supportedLocales, type SupportedLocale } from './settings'

export function stripLocalePrefix(pathname: string): string {
  for (const locale of supportedLocales) {
    if (pathname === `/${locale}`) return '/'
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1)
    }
  }
  return pathname
}

export function isLocalePrefix(segment: string): boolean {
  return (supportedLocales as readonly string[]).includes(segment)
}
