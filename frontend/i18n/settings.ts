export const defaultLocale = 'ko'
export const supportedLocales = ['ko', 'en'] as const
export type SupportedLocale = (typeof supportedLocales)[number]
