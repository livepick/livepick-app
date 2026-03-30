import { type NextRequest, NextResponse } from 'next/server'
import { defaultLocale, supportedLocales, type SupportedLocale } from '@/i18n/settings'

function getLocaleFromRequest(request: NextRequest): SupportedLocale {
  // 1. Cookie
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && (supportedLocales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale as SupportedLocale
  }

  // 2. Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language')
  if (acceptLanguage) {
    for (const locale of supportedLocales) {
      if (acceptLanguage.includes(locale)) {
        return locale
      }
    }
  }

  // 3. Default
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip internal paths
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if path already has a locale prefix
  const hasLocalePrefix = supportedLocales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )

  const locale = getLocaleFromRequest(request)

  let response: NextResponse

  if (hasLocalePrefix) {
    response = NextResponse.next()
  } else {
    // Rewrite to add locale prefix (URL stays clean)
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}${pathname}`
    response = NextResponse.rewrite(url)
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
