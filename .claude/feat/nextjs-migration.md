# Next.js App Router 마이그레이션

## 1. Overview

**Goal**: livepick frontend를 React+Vite SPA → Next.js App Router SSR로 전환. setto-app과 동일한 구조.

**Scope**:
- Next.js + App Router + SSR
- `[locale]` 동적 세그먼트 + i18n (i18next + react-i18next)
- `(main)` route group = AppLayout (Header + BottomNav)
- middleware.ts locale 감지/rewrite (URL에 locale 미노출)
- Cloudflare Workers 배포 (`@opennextjs/cloudflare`)
- 지원 언어: `ko` (기본), `en`

**Modules**: Frontend only

---

## 2. Technical Decisions

| 항목 | 결정 | 근거 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) | setto-app 동일 |
| 배포 | Cloudflare Workers (`@opennextjs/cloudflare`) | setto-app 동일 |
| i18n | `i18next` + `react-i18next` | setto-app 동일 |
| locale 전략 | URL rewrite (locale 미노출) | setto-app 동일 |
| 기본 언어 | `ko` | 한국 서비스 |
| CSS | Tailwind v4 + `@tailwindcss/postcss` | setto-app 동일 (Vite 플러그인 → PostCSS로 전환) |
| 상태관리 | TanStack Query v5 + Zustand | 기존 유지 |

---

## 3. 디렉토리 구조

### Before (Vite SPA)
```
frontend/
├── index.html
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx
│   ├── components/
│   ├── features/
│   ├── pages/
│   └── ...
```

### After (Next.js App Router — setto-app 동일 구조)
```
frontend/
├── next.config.ts
├── open-next.config.ts
├── wrangler.jsonc
├── postcss.config.js
├── middleware.ts
├── app/
│   ├── layout.tsx                    # Root Layout (폰트, 테마 스크립트)
│   ├── globals.css                   # Tailwind v4 진입점
│   ├── [locale]/
│   │   ├── layout.tsx                # Locale Layout (TranslationsProvider)
│   │   └── (main)/
│   │       ├── layout.tsx            # → NavigationLayout 위임
│   │       ├── NavigationLayout.tsx  # AppLayout(Header+BottomNav) + 네비 로직
│   │       ├── page.tsx              # / (HomePage)
│   │       ├── following/
│   │       │   └── page.tsx
│   │       ├── events/
│   │       │   ├── page.tsx
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       ├── history/
│   │       │   └── page.tsx
│   │       ├── partner/
│   │       │   ├── page.tsx
│   │       │   ├── join/
│   │       │   │   └── page.tsx
│   │       │   └── events/
│   │       │       ├── new/
│   │       │       │   └── page.tsx
│   │       │       └── [id]/
│   │       │           └── page.tsx
│   │       ├── profile/
│   │       │   └── [id]/
│   │       │       └── page.tsx
│   │       └── auth/
│   │           ├── page.tsx
│   │           └── nickname/
│   │               └── page.tsx
│   └── fonts.css
├── components/
│   ├── ui/                           # 기존 유지 (+ 'use client')
│   └── layout/                       # 기존 유지 (AppLayout, Container, SectionHeader 등)
├── features/                         # 기존 유지 (event, partner, follow, auth)
├── hooks/                            # 기존 유지
├── stores/                           # 기존 유지
├── mocks/                            # 기존 유지
├── config/                           # VITE_ → NEXT_PUBLIC_ 전환
├── lib/                              # 기존 유지 (cn, queryClient)
├── i18n/
│   ├── settings.ts                   # defaultLocale='ko', supportedLocales=['ko','en']
│   ├── client.tsx                    # TranslationsProvider + useTranslation 재export
│   ├── server.ts                     # initTranslations(locale) — Server Component용
│   ├── navigation.ts                 # useCurrentLocale, stripLocalePrefix
│   └── resources/
│       ├── ko.json
│       └── en.json
├── types/                            # 기존 유지
└── providers.tsx                     # QueryClientProvider + 기타 Provider ('use client')
```

---

## 4. 핵심 파일 설계

### 4.1 middleware.ts (setto-app 동일 패턴)

```
요청 → locale 감지 (cookie → Accept-Language → 'ko') → rewrite(/ko/events → 내부)
URL 노출: /events (locale 없음)
보안 헤더: X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, HSTS
matcher: /((?!_next|api|.*\\..*).*)
```

### 4.2 app/layout.tsx (Root Layout)

- 폰트 로드: Space Grotesk, Manrope (next/font/google)
- 테마 인라인 스크립트 (hydration 전 실행)
- `<html lang={locale} suppressHydrationWarning>`
- `globals.css` import

### 4.3 app/[locale]/layout.tsx (Locale Layout)

- `generateStaticParams()` → `['ko', 'en']`
- `initTranslations(locale)` → resources 로드
- `<TranslationsProvider locale={locale} resources={resources}>`
- `<Providers>` (QueryClientProvider 등)

### 4.4 app/[locale]/(main)/layout.tsx + NavigationLayout.tsx

- `layout.tsx`: `<NavigationLayout>{children}</NavigationLayout>`
- `NavigationLayout.tsx` (`'use client'`): 기존 AppLayout 로직 이관
  - Header + BottomNav + `<main>` 3-layer DOM 구조
  - `usePathname()`으로 active nav 감지

### 4.5 i18n 구조

**settings.ts**:
```ts
export const defaultLocale = 'ko'
export const supportedLocales = ['ko', 'en'] as const
export type SupportedLocale = (typeof supportedLocales)[number]
```

**번역 파일 구조** (단일 파일 + 도메인 키):
```json
{
  "nav": { "home": "홈", "following": "팔로잉", "events": "이벤트", "history": "히스토리", "partner": "파트너" },
  "common": { "loading": "로딩 중...", "cancel": "취소", "save": "저장", "login": "로그인" },
  "auth": { "signIn": "로그인", "signInWithGoogle": "Google로 로그인", "joinTheVibe": "JOIN THE VIBE" },
  "home": { "vibeCheck": "VIBE CHECK", "recommended": "추천", "popular": "인기", "new": "신규", "trending": "트렌딩" },
  "events": { "livePulse": "LIVE PULSE", "joinNow": "참여하기", "winners": "당첨자", "aboutEvent": "이벤트 소개" },
  "partner": { "hub": "파트너 허브", "dashboard": "대시보드", "createEvent": "이벤트 생성", "manageEvent": "이벤트 관리" },
  "follow": { "following": "팔로잉", "yourCreators": "YOUR CREATORS", "follow": "팔로우", "unfollow": "언팔로우" },
  "history": { "title": "히스토리", "participationRecords": "참여 기록" },
  "profile": { "bio": "소개", "events": "이벤트", "followers": "팔로워" },
  "errors": { "notFound": "찾을 수 없습니다", "partnerOnly": "파트너 전용", "loginRequired": "로그인 필요" }
}
```

### 4.6 Cloudflare Workers 배포

**wrangler.jsonc**:
```jsonc
{
  "main": ".open-next/worker.js",
  "name": "livepick-web",
  "compatibility_date": "2025-05-05",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" }
}
```

**open-next.config.ts**:
```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
export default defineCloudflareConfig();
```

**package.json scripts**:
```json
{
  "dev": "next dev -p 3100",
  "build": "next build",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
  "typecheck": "tsc --noEmit"
}
```

---

## 5. 마이그레이션 변환 맵

### 5.1 삭제 대상

| 파일 | 이유 |
|------|------|
| `index.html` | Next.js가 HTML 생성 |
| `vite.config.ts` | Vite 제거 |
| `src/main.tsx` | Next.js entry 대체 |
| `src/App.tsx` | Root layout 대체 |
| `src/router.tsx` | App Router 대체 |

### 5.2 이동/변환 대상

| Before (src/) | After | 변환 내용 |
|---|---|---|
| `components/layout/AppLayout.tsx` | `app/[locale]/(main)/NavigationLayout.tsx` | `Outlet` → `{children}`, `useLocation` → `usePathname` |
| `components/layout/Header.tsx` | `components/layout/Header.tsx` | `Link` from `next/link`, `'use client'` 추가 |
| `components/layout/BottomNav.tsx` | `components/layout/BottomNav.tsx` | `Link`/`useLocation` → `next/link`/`usePathname` |
| `components/layout/Container.tsx` | `components/layout/Container.tsx` | 변경 없음 |
| `components/layout/SectionHeader.tsx` | `components/layout/SectionHeader.tsx` | 변경 없음 |
| `components/ui/*` | `components/ui/*` | `'use client'` 추가 |
| `features/*/hooks.ts` | `features/*/hooks.ts` | 변경 없음 (TanStack Query) |
| `features/*/types.ts` | `features/*/types.ts` | 변경 없음 |
| `features/*/components/*` | `features/*/components/*` | `'use client'` + `Link` 전환 |
| `stores/authStore.ts` | `stores/authStore.ts` | 변경 없음 |
| `config/environment.ts` | `config/environment.ts` | `import.meta.env.VITE_APP_ENV` → `process.env.NEXT_PUBLIC_APP_ENV` |
| `styles/globals.css` | `app/globals.css` | `@import` 경로 조정 |
| `styles/fonts.css` | 삭제 (next/font 사용) | Google CDN → next/font/google 전환 |
| `lib/cn.ts` | `lib/cn.ts` | 변경 없음 |
| `lib/queryClient.ts` | `lib/queryClient.ts` | 변경 없음 |
| `hooks/useMediaQuery.ts` | `hooks/useMediaQuery.ts` | 변경 없음 (SSR fallback 이미 있음) |
| `pages/HomePage.tsx` | `app/[locale]/(main)/page.tsx` | Server → Client wrapper, `'use client'` |
| `pages/EventsPage.tsx` | `app/[locale]/(main)/events/page.tsx` | 동일 패턴 |
| (나머지 10개 페이지) | 각 App Router 경로 | 동일 패턴 |

### 5.3 신규 생성

| 파일 | 역할 |
|------|------|
| `next.config.ts` | Next.js 설정 |
| `open-next.config.ts` | Cloudflare 어댑터 |
| `wrangler.jsonc` | Workers 설정 |
| `postcss.config.js` | `@tailwindcss/postcss` |
| `middleware.ts` | locale 감지 + rewrite + 보안 헤더 |
| `app/layout.tsx` | Root Layout |
| `app/[locale]/layout.tsx` | Locale Layout + TranslationsProvider |
| `app/[locale]/(main)/layout.tsx` | NavigationLayout 위임 |
| `app/[locale]/(main)/NavigationLayout.tsx` | Header+BottomNav client 로직 |
| `providers.tsx` | QueryClientProvider wrapper |
| `i18n/settings.ts` | locale 설정 |
| `i18n/client.tsx` | TranslationsProvider |
| `i18n/server.ts` | initTranslations |
| `i18n/navigation.ts` | locale 유틸 |
| `i18n/resources/ko.json` | 한국어 번역 |
| `i18n/resources/en.json` | 영어 번역 |

---

## 6. 패키지 변경

### 추가
```
next ^16.1.0
@opennextjs/cloudflare ^1.16.0
wrangler ^4.65.0
@tailwindcss/postcss ^4.0.0
i18next ^24.2.0
react-i18next ^15.4.0
```

### 삭제
```
vite
@vitejs/plugin-react
@tailwindcss/vite
react-router
```

### 유지
```
react, react-dom (^19)
@tanstack/react-query (^5)
zustand (^5)
tailwindcss (^4)
lucide-react
clsx, tailwind-merge
typescript (~5.7)
```

---

## 7. Implementation Plan

| # | 단계 | 파일 수 | 설명 |
|---|------|---------|------|
| 1 | 프로젝트 초기화 | ~8 | package.json 교체, next.config.ts, tsconfig.json, postcss, wrangler, open-next |
| 2 | Root Layout + globals.css | ~3 | app/layout.tsx, app/globals.css, providers.tsx |
| 3 | i18n 시스템 | ~6 | i18n/ 전체 + middleware.ts |
| 4 | Locale + Main Layout | ~3 | app/[locale]/layout.tsx, (main)/layout.tsx, NavigationLayout.tsx |
| 5 | 레이아웃 컴포넌트 전환 | ~5 | Header, BottomNav, Container, SectionHeader, PageContent — Link/usePathname 전환 |
| 6 | UI 컴포넌트 전환 | ~7 | components/ui/* — 'use client' 추가 |
| 7 | Feature 컴포넌트 전환 | ~6 | features/*/components/* — 'use client' + Link 전환 |
| 8 | 페이지 마이그레이션 | ~12 | 12개 페이지 → App Router page.tsx |
| 9 | 설정/유틸 전환 | ~3 | config/environment.ts, lib/*, hooks/* |
| 10 | Vite 잔재 삭제 | ~5 | index.html, vite.config.ts, src/main.tsx, src/App.tsx, src/router.tsx |
| 11 | 빌드 검증 | - | typecheck + next build + preview |

**구현 스킬**: `/impl-frontend` (대규모 프론트엔드 마이그레이션)

---

## 8. Security, Error Handling, Edge Cases

### 보안 (middleware.ts)
- CSP 헤더 (setto-app 패턴)
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- HSTS (production만)

### Edge Cases
- locale cookie 없을 때 → Accept-Language → defaultLocale('ko') fallback
- 지원하지 않는 locale → 'ko'로 fallback
- SSR hydration mismatch 방지: `suppressHydrationWarning`, `useRef` i18n 캐싱
- `useMediaQuery` SSR: server snapshot `false` (이미 처리됨)

### 배포
- `@opennextjs/cloudflare`가 Next.js 16과 호환되는지 빌드 시 검증 필요
- ISR 미사용 (추후 필요 시 R2 캐시 추가)
