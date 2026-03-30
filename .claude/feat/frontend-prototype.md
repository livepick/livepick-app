# Frontend Prototype — 프로젝트 구조 + 목업

## 1. Overview

### 목표
백엔드 없이 동작하는 React SPA 프로토타입. 목적:
- **UX 흐름 검증**: 12개 페이지 전체 네비게이션
- **디자인 시스템 테스트**: "The Neon Editorial" 디자인을 Tailwind로 구현
- **프로젝트 구조 확보**: 향후 MVP 구현의 기반이 되는 디렉토리/패턴 확립

### 스코프
- **포함**: 프로젝트 초기화, 디자인 토큰, UI 컴포넌트, 12페이지, mock 데이터, 라우팅
- **제외**: 실제 API 연동, OAuth 인증, 서버 배포, 테스트 코드

### 모듈
- Frontend only (Vite SPA, 단일 프로젝트)

---

## 2. Design Direction

### 톤: "The Kinetic Curator"
- 하이엔드 디지털 매거진 + 사이버 글로우 에너지
- 의도적 비대칭, 에디토리얼 타이포그래피
- 활기찬 + 신뢰감 (인플루언서 이벤트 흥미 + 공정한 추첨 신뢰)

### 핵심 시각 규칙
1. **No-Line Rule**: 1px 보더 금지 → 배경색 차이로 영역 구분
2. **Glass & Gradient**: 네비/FAB에 Glassmorphism (60% opacity + blur 20px)
3. **Ghost Border**: 입력 필드만 outline-variant 20% opacity
4. **순백 금지**: 텍스트는 항상 `on-background` (#dee5ff)
5. **네온 글로우 섀도**: primary 틴트 32px blur, 8% opacity
6. **Pill 버튼**: rounded-full, primary 그라데이션
7. **Pop 요소**: 모든 카드에 secondary/tertiary 칩 (LIVE, D-3 등)

### 이벤트 상태 시각화
| 상태 | 톤 | 표현 |
|------|-----|------|
| pending | 차분 | "D-N" 카운트다운, tertiary 칩 |
| active | 강조 | secondary 글로우, 참여 CTA, 라이브 카운트 |
| closed | 디밍 | 흐린 톤, "마감" 배지, 결과 CTA |
| won | 축하 | primary 글로우, 강조 카드 |

---

## 3. Technical Decisions

| 결정 | 선택 | 근거 |
|------|------|------|
| 빌드 도구 | Vite | CLAUDE.md 지정, 빠른 HMR |
| UI 프레임워크 | React 19 + TypeScript strict | CLAUDE.md 지정 |
| 스타일링 | Tailwind CSS v4 | CLAUDE.md 지정, temp에서 검증됨 |
| 라우팅 | React Router v7 | SPA 표준, 12페이지 라우팅 |
| 서버 상태 | TanStack Query v5 | 규칙 필수. mock 데이터도 queryFn으로 래핑 |
| 클라이언트 상태 | Zustand | 인증 토글, 모달 상태 등 |
| 아이콘 | Lucide React | temp에서 사용, 경량 |
| 클래스 유틸 | clsx + tailwind-merge | 조건부 클래스 결합 |
| Mock 데이터 | const 객체 + queryFn 래핑 | 프로토타입이므로 단순하게, 나중에 API로 교체 용이 |
| 환경 설정 | 파일 기반 config (Setto 패턴) | .env에는 ENV만, 실제 설정은 config 파일에 정의 |

---

## 4. 디렉토리 구조

```
frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js          # Tailwind v4
├── .env.local                 # VITE_APP_ENV=local (이 값만)
├── .env.example               # 환경 변수 템플릿 (문서용)
│
└── src/
    ├── main.tsx                # ReactDOM.createRoot
    ├── App.tsx                 # RouterProvider
    ├── router.tsx              # createBrowserRouter 정의
    │
    ├── config/                 # 환경별 설정 (Setto 패턴)
    │   ├── environments/
    │   │   ├── local.ts        # 로컬 개발 설정
    │   │   ├── dev.ts          # 개발 서버 설정
    │   │   └── prod.ts         # 프로덕션 설정
    │   ├── environment.ts      # Environment 타입 + detectEnv + getter 함수
    │   └── index.ts            # re-export
    │
    ├── styles/
    │   ├── globals.css         # @import "tailwindcss" + @theme 토큰 + 유틸 클래스
    │   └── fonts.css           # Google Fonts import (Space Grotesk, Manrope)
    │
    ├── components/
    │   ├── ui/                 # Primitive 컴포넌트
    │   │   ├── Button.tsx
    │   │   ├── Card.tsx
    │   │   ├── Input.tsx
    │   │   ├── Chip.tsx        # 상태 뱃지, 필터 태그
    │   │   ├── Avatar.tsx
    │   │   ├── Badge.tsx       # 카운트/상태 표시
    │   │   └── Skeleton.tsx    # 로딩 플레이스홀더
    │   │
    │   └── layout/             # Composite 레이아웃
    │       ├── AppLayout.tsx   # Header + Main + BottomNav 래핑
    │       ├── Header.tsx      # Logo + Avatar/Login
    │       ├── BottomNav.tsx   # 5탭 네비게이션
    │       └── PageContainer.tsx # 페이지 콘텐츠 래퍼 (max-width, padding)
    │
    ├── features/
    │   ├── event/
    │   │   ├── components/     # EventCard, EventGrid, EventStatusChip
    │   │   ├── types.ts        # Event, EventStatus, EventParticipation
    │   │   └── hooks.ts        # useEvents, useEvent (TanStack Query + mock)
    │   │
    │   ├── partner/
    │   │   ├── components/     # PartnerCard, PartnerGrid, MetricCard
    │   │   ├── types.ts        # Partner, PartnerCategory
    │   │   └── hooks.ts        # usePartners, usePartner
    │   │
    │   ├── auth/
    │   │   ├── components/     # LoginButton, NicknameForm
    │   │   ├── types.ts        # User, AuthState
    │   │   └── hooks.ts        # useAuth (mock)
    │   │
    │   └── follow/
    │       ├── components/     # FollowButton, FollowingList
    │       ├── types.ts        # Follow
    │       └── hooks.ts        # useFollowing, useFollow
    │
    ├── pages/                  # 라우트 페이지 (thin layer)
    │   ├── HomePage.tsx
    │   ├── FollowingPage.tsx
    │   ├── EventsPage.tsx
    │   ├── EventDetailPage.tsx
    │   ├── HistoryPage.tsx
    │   ├── PartnerDashboardPage.tsx
    │   ├── PartnerJoinPage.tsx
    │   ├── EventCreatePage.tsx
    │   ├── EventManagePage.tsx
    │   ├── ProfilePage.tsx
    │   ├── AuthPage.tsx
    │   └── NicknamePage.tsx
    │
    ├── mocks/                  # Mock 데이터
    │   ├── users.ts            # 샘플 사용자 데이터
    │   ├── partners.ts         # 샘플 파트너 (인플루언서)
    │   ├── events.ts           # 샘플 이벤트 (pending/active/closed)
    │   ├── follows.ts          # 샘플 팔로우 관계
    │   └── participations.ts   # 샘플 이벤트 참여
    │
    ├── stores/                 # Zustand
    │   └── authStore.ts        # 로그인/비로그인 토글, 현재 사용자
    │
    ├── types/                  # 공통 타입
    │   └── api.ts              # ApiResponse<T>, PaginatedResponse<T>
    │
    ├── hooks/                  # 공통 훅
    │   └── useMediaQuery.ts    # 반응형 브레이크포인트
    │
    └── lib/                    # 유틸리티
        ├── cn.ts               # clsx + tailwind-merge 래퍼
        └── queryClient.ts      # QueryClient 설정
```

---

## 5. 환경 설정 (Config 패턴)

### 원칙
`.env`에는 환경 식별자만, 실제 설정값은 파일로 정의. 배포 시 `.env`만 바꾸면 모든 설정이 전환됨.

### .env.local
```
VITE_APP_ENV=local
```
이 값 하나만. 그 외 키, URL 등은 절대 .env에 넣지 않는다.

### .env.example
```bash
# 환경 식별자 (local | dev | prod)
VITE_APP_ENV=local
```

### config/environments/local.ts
```ts
import type { EnvironmentConfig } from '../environment'

export const localConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'http://localhost:8080',
    prefix: '/api/v1',
  },
  auth: {
    googleClientId: '',           // 프로토타입에서는 빈 값
    redirectUrl: 'http://localhost:5173/auth/callback',
  },
  features: {
    enableMockData: true,         // mock 데이터 사용
    enableDebug: true,
  },
}
```

### config/environments/dev.ts
```ts
export const devConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'https://dev-api.livepick.app',
    prefix: '/api/v1',
  },
  auth: {
    googleClientId: 'dev-client-id.apps.googleusercontent.com',
    redirectUrl: 'https://dev.livepick.app/auth/callback',
  },
  features: {
    enableMockData: false,
    enableDebug: true,
  },
}
```

### config/environments/prod.ts
```ts
export const prodConfig: EnvironmentConfig = {
  api: {
    baseUrl: 'https://api.livepick.app',
    prefix: '/api/v1',
  },
  auth: {
    googleClientId: 'prod-client-id.apps.googleusercontent.com',
    redirectUrl: 'https://livepick.app/auth/callback',
  },
  features: {
    enableMockData: false,
    enableDebug: false,
  },
}
```

### config/environment.ts
```ts
export type Environment = 'local' | 'dev' | 'prod'

export interface EnvironmentConfig {
  api: {
    baseUrl: string
    prefix: string
  }
  auth: {
    googleClientId: string
    redirectUrl: string
  }
  features: {
    enableMockData: boolean
    enableDebug: boolean
  }
}

// 환경 감지: VITE_APP_ENV → default 'local'
export function detectEnvironment(): Environment {
  const env = import.meta.env.VITE_APP_ENV
  if (env === 'dev' || env === 'prod') return env
  return 'local'
}

// 타입-세이프 getter
export function getConfig(): EnvironmentConfig { ... }
export function getApiConfig(): EnvironmentConfig['api'] { ... }
export function getAuthConfig(): EnvironmentConfig['auth'] { ... }
export function isMockEnabled(): boolean { ... }
export function isDebugEnabled(): boolean { ... }
```

### 사용 패턴
```tsx
// 앱 어디서든
import { getApiConfig, isMockEnabled } from '@/config'

const { baseUrl, prefix } = getApiConfig()
// → local: http://localhost:8080/api/v1
// → prod:  https://api.livepick.app/api/v1

if (isMockEnabled()) {
  // mock 데이터 사용
}
```

---

## 6. Design System → Tailwind 매핑

### 5-1. 컬러 토큰 (globals.css @theme)

temp/src/index.css의 54개 토큰을 그대로 사용. DESIGN.md와 일치 확인 완료.

핵심 매핑:
```
bg-background      → #060e20 (base layer)
bg-surface          → #060e20
bg-surface-container-low  → #091328 (secondary sections)
bg-surface-container-high → #141f38 (interactive cards)
bg-surface-bright   → #1f2b49 (floating modals)

text-on-background  → #dee5ff (기본 텍스트)
text-on-surface     → #dee5ff
text-on-surface-variant → #a3aac4 (보조 텍스트)

bg-primary          → #f382ff (CTA, 주요 액션)
bg-secondary        → #a2f31f (강조, 뱃지)
bg-tertiary         → #81ecff (보조 강조)
```

### 5-2. 타이포그래피

```css
--font-headline: "Space Grotesk", sans-serif;  /* 헤드라인 전용 */
--font-body: "Manrope", sans-serif;            /* 본문, UI */
```

사용 패턴:
```
display-lg: font-headline text-[3.5rem] font-bold tracking-[-0.02em]
display-md: font-headline text-[2.5rem] font-bold tracking-[-0.02em]
title-lg:   font-headline text-2xl font-semibold
title-md:   font-headline text-xl font-semibold
body-md:    font-body text-base
body-sm:    font-body text-sm
label-md:   font-body text-sm font-medium uppercase tracking-wider
```

### 5-3. 커스텀 유틸리티 클래스 (globals.css)

```css
.glass-panel     /* backdrop-blur-[24px] + bg-surface-container-high/60 */
.glass-card      /* gradient + backdrop-blur-[12px] */
.neon-glow-primary   /* box-shadow: 0 0 32px rgba(243, 130, 255, 0.15) */
.neon-glow-secondary /* box-shadow: 0 0 24px rgba(162, 243, 31, 0.1) */
.text-glow       /* text-shadow: 0 0 10px rgba(243, 130, 255, 0.4) */
.scrim-gradient  /* 이미지 오버레이 그라데이션 */
.hide-scrollbar  /* 스크롤바 숨김 */
```

### 5-4. 반응형 그리드

```
모바일 (기본):      grid-cols-2          ~480px
모바일 (넓은):      sm:grid-cols-3       481~768px
태블릿/소형 웹:     md:grid-cols-4       769~1024px
데스크탑:           lg:grid-cols-5       1025~1440px
대형 데스크탑:      xl:grid-cols-6       1441px~
```

---

## 6. 컴포넌트 설계

### 6-1. Primitive UI 컴포넌트

#### Button
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}
```
- primary: bg-primary rounded-full, 그라데이션 glass effect, hover시 neon-glow
- secondary: ghost-border (outline-variant/20), text-secondary
- ghost: 배경 없음, text-on-surface

#### Card
```tsx
interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'glass'
  hover?: boolean
  className?: string
}
```
- default: bg-surface-container-high, 보더 없음, rounded-xl, p-6
- glass: glass-card 클래스 적용
- hover: hover:-translate-y-1 + transition

#### Input
```tsx
interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
}
```
- bg-surface-container-lowest (#000), ghost-border 10% opacity
- focus: border-tertiary + outer glow

#### Chip
```tsx
interface ChipProps {
  label: string
  variant: 'primary' | 'secondary' | 'tertiary' | 'muted'
  size?: 'sm' | 'md'
}
```
- 이벤트 상태 뱃지, 필터 태그 등
- LIVE → secondary, D-3 → tertiary, 마감 → muted

#### Avatar
```tsx
interface AvatarProps {
  src?: string
  alt: string
  size: 'sm' | 'md' | 'lg'
  fallback?: string
}
```

### 6-2. Composite 레이아웃

#### AppLayout
```tsx
// 모든 페이지를 감싸는 최상위 레이아웃
<div className="min-h-screen bg-background text-on-background font-body">
  <Header />
  <main className="pt-16 pb-20">  {/* header/nav 높이만큼 padding */}
    <Outlet />
  </main>
  <BottomNav />
</div>
```

#### Header
- 좌측: "LivePick" 로고 (font-headline, text-primary, italic)
- 우측: Avatar (로그인) 또는 "로그인" 버튼 (비로그인)
- glass-panel 스타일, fixed top, z-50

#### BottomNav
- 5탭: 홈, 팔로잉, 이벤트, 기록, 파트너
- Lucide 아이콘 사용
- 활성 탭: text-secondary + bg-secondary/10 pill
- glass-panel 스타일, fixed bottom, z-50

### 6-3. Feature 컴포넌트

#### EventCard
```tsx
interface EventCardProps {
  event: Event
  onNavigate: (eventId: string) => void
}
```
- 이미지 + scrim-gradient 오버레이
- 상단: EventStatusChip (Pop 요소)
- 하단: 제목, 파트너명, 날짜
- hover: scale + neon-glow

#### PartnerCard
```tsx
interface PartnerCardProps {
  partner: Partner
  onNavigate: (partnerId: string) => void
}
```
- 프로필 이미지 (aspect-[3/4])
- 이름, 카테고리, 팔로워 수
- 진행 중 이벤트 있으면 secondary 뱃지

#### MetricCard (파트너 대시보드)
```tsx
interface MetricCardProps {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
}
```

---

## 7. 라우팅

```tsx
// router.tsx
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/',                    element: <HomePage /> },
      { path: '/following',           element: <FollowingPage /> },
      { path: '/events',              element: <EventsPage /> },
      { path: '/events/:id',          element: <EventDetailPage /> },
      { path: '/history',             element: <HistoryPage /> },
      { path: '/partner',             element: <PartnerDashboardPage /> },
      { path: '/partner/join',        element: <PartnerJoinPage /> },
      { path: '/partner/events/new',  element: <EventCreatePage /> },
      { path: '/partner/events/:id',  element: <EventManagePage /> },
      { path: '/profile/:id',         element: <ProfilePage /> },
      { path: '/auth',                element: <AuthPage /> },
      { path: '/auth/nickname',       element: <NicknamePage /> },
    ],
  },
])
```

---

## 8. Mock 데이터 구조

### 패턴: const 객체 + TanStack Query queryFn 래핑

```tsx
// mocks/partners.ts
export const MOCK_PARTNERS: Partner[] = [
  {
    id: 'p1',
    userId: 'u2',
    channelName: '먹방의 신',
    channelUrl: 'https://youtube.com/@mukbang',
    category: 'food',
    bio: '매일 맛있는 먹방을 합니다',
    profileImage: '/images/partner1.jpg',
    followerCount: 12500,
    createdAt: '2025-01-15T00:00:00Z',
  },
  // ... 6~8명의 다양한 카테고리 파트너
]

// features/partner/hooks.ts
export function usePartners() {
  return useQuery({
    queryKey: partnerKeys.lists(),
    queryFn: async () => {
      await delay(300) // 네트워크 시뮬레이션
      return MOCK_PARTNERS
    },
  })
}
```

### Mock 데이터 규모
| 도메인 | 갯수 | 다양성 |
|--------|------|--------|
| Users | 5명 | 일반 3, 파트너 2 |
| Partners | 8명 | food, game, beauty, tech, music 등 |
| Events | 12개 | pending 3, active 5, closed 4 |
| Follows | 6개 | 현재 사용자가 3명 팔로우 |
| Participations | 8개 | joined 4, won 2, lost 2 |

---

## 9. 상태 관리

### Zustand — authStore
```tsx
interface AuthState {
  isLoggedIn: boolean
  currentUser: User | null
  isPartner: boolean
  // actions
  toggleLogin: () => void      // 프로토타입용 토글
  setCurrentUser: (user: User | null) => void
}
```

- 프로토타입이므로 Header에 로그인/로그아웃 토글 버튼
- 로그인 상태에 따라 Following, History 페이지 접근 제어
- 파트너 여부에 따라 Partner 대시보드 vs 가입 화면 분기

---

## 10. 구현 순서

프로토타입이므로 bottom-up으로 빠르게:

### Phase 1: 프로젝트 셋업
1. `frontend/` Vite + React + TS + Tailwind v4 초기화
2. config/ — 환경 설정 (local/dev/prod) + .env.local + .env.example
3. globals.css — 디자인 토큰 (temp에서 이관) + 커스텀 유틸 클래스
4. fonts.css — Space Grotesk + Manrope
5. lib/cn.ts, lib/queryClient.ts

### Phase 2: UI 기반
5. components/ui/ — Button, Card, Input, Chip, Avatar, Badge, Skeleton
6. components/layout/ — AppLayout, Header, BottomNav, PageContainer
7. router.tsx + App.tsx — 12페이지 라우팅

### Phase 3: 도메인
8. types/ + mocks/ — 타입 정의 + mock 데이터
9. features/*/types.ts + hooks.ts
10. stores/authStore.ts

### Phase 4: 페이지
11. pages/ — 12개 페이지 구현 (mock 데이터 연결)
12. features/*/components/ — 도메인별 컴포넌트

### 파일 수 예상: ~45개

---

## 11. 보안, 에러 처리, 엣지 케이스

### 프로토타입 한정
- **인증**: Zustand 토글 (실제 OAuth 없음)
- **에러 처리**: mock 데이터이므로 에러 시나리오 최소한
- **접근 제어**: 로그인 필요 페이지는 비로그인 시 AuthPage로 리다이렉트 (프로토타입용 간단 가드)

### 향후 MVP에서 추가할 것
- Google OAuth 2.0 연동
- API 에러 핸들링 (Result 패턴)
- httpOnly cookie 인증
- 입력값 validation (zod)
