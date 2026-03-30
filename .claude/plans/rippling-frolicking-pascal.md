# Frontend Prototype Implementation Plan

## Context

LivePick 프로젝트의 첫 프론트엔드 구현. 백엔드 없이 동작하는 React SPA 프로토타입으로, 12개 페이지의 UX 흐름 검증, "The Neon Editorial" 디자인 시스템 적용, 향후 MVP의 기반 구조 확립이 목표. `temp/`에 참조 구현이 존재하며 이를 기반으로 production-ready 구조로 재작성한다. 프로젝트명: **livepick-app**.

---

## Reuse Strategy

### temp/에서 포팅할 것
| temp/ 파일 | 포팅 대상 | 변경 사항 |
|---|---|---|
| `src/index.css` | `src/styles/globals.css` + `src/styles/fonts.css` | 폰트 import 분리, `@import "tailwindcss"` + `@theme` 54토큰 유지, 커스텀 유틸 클래스 유지 |
| `components/TopNav.tsx` | `components/layout/Header.tsx` | 하드코딩 hex → 시맨틱 토큰, authStore 연동, React Router Link |
| `components/BottomNav.tsx` | `components/layout/BottomNav.tsx` | useState → useLocation + Link, 활성탭 로직 유지 |
| `screens/Home.tsx` | `pages/HomePage.tsx` + `features/partner/components/PartnerCard.tsx` | 카드 패턴 추출, usePartners() 훅 연동 |
| `screens/Events.tsx` | `pages/EventsPage.tsx` + `features/event/components/EventCard.tsx` | 카드 패턴 추출, useEvents() 훅 연동 |
| 나머지 screens | 각 pages/ 파일 | 동일 패턴 적용 |

### 새로 작성할 것
- 프로젝트 설정 (package.json, tsconfig, vite.config, config/)
- UI 프리미티브 7개 (Button, Card, Input, Chip, Avatar, Badge, Skeleton)
- 도메인 타입, mock 데이터, TanStack Query 훅
- Zustand authStore
- AuthPage, NicknamePage, PartnerJoinPage, EventCreatePage, EventManagePage

---

## Implementation Phases

### Phase 1: Project Scaffolding (~18 files)

**1a. Root configs (생성 순서대로)**
1. `frontend/package.json` — name: "livepick-app", deps: react 19, react-dom, react-router 7, @tanstack/react-query 5, zustand, lucide-react, clsx, tailwind-merge. devDeps: vite 6, @vitejs/plugin-react, @tailwindcss/vite, tailwindcss 4, typescript ~5.8
2. `frontend/tsconfig.json` — strict: true, paths: `@/*` → `./src/*`, target: ES2022, jsx: react-jsx
3. `frontend/vite.config.ts` — plugins: [tailwindcss(), react()], resolve.alias: `@` → `src/`
4. `frontend/index.html` — Vite 템플릿, title "LivePick"
5. `frontend/.env.local` — `VITE_APP_ENV=local`
6. `frontend/.env.example` — `VITE_APP_ENV=local`

**1b. Styles** (temp/src/index.css 포팅)
7. `frontend/src/styles/fonts.css` — Google Fonts import (Space Grotesk, Manrope)
8. `frontend/src/styles/globals.css` — `@import "./fonts.css"` + `@import "tailwindcss"` + `@theme` 54토큰 + body 스타일 + 커스텀 유틸 클래스 6개

**1c. Config module**
9. `frontend/src/config/environment.ts` — Environment 타입, EnvironmentConfig 인터페이스, detectEnvironment(), getConfig() 등
10. `frontend/src/config/environments/local.ts`
11. `frontend/src/config/environments/dev.ts`
12. `frontend/src/config/environments/prod.ts`
13. `frontend/src/config/index.ts` — re-export

**1d. Core utilities**
14. `frontend/src/lib/cn.ts` — clsx + twMerge 래퍼
15. `frontend/src/lib/queryClient.ts` — QueryClient 인스턴스 (staleTime, retry 설정)
16. `frontend/src/types/api.ts` — ApiResponse<T>, PaginatedResponse<T>
17. `frontend/src/hooks/useMediaQuery.ts` — 반응형 브레이크포인트 훅
18. `frontend/src/stores/authStore.ts` — isLoggedIn, currentUser, isPartner, toggleLogin()

### Phase 2: UI Components + Layout + Router (~12 files)

**2a. UI Primitives** (cn.ts, Tailwind 토큰에만 의존)
19. `frontend/src/components/ui/Button.tsx` — variant: primary/secondary/ghost, size: sm/md/lg, pill shape
20. `frontend/src/components/ui/Card.tsx` — variant: default/glass, hover prop
21. `frontend/src/components/ui/Input.tsx` — ghost border, focus: tertiary glow
22. `frontend/src/components/ui/Chip.tsx` — variant: primary/secondary/tertiary/muted
23. `frontend/src/components/ui/Avatar.tsx` — size: sm/md/lg, fallback initials
24. `frontend/src/components/ui/Badge.tsx` — count/status 표시
25. `frontend/src/components/ui/Skeleton.tsx` — pulse 애니메이션 로딩 플레이스홀더

**2b. Layout** (UI + authStore + React Router 의존)
26. `frontend/src/components/layout/Header.tsx` — glass-panel, 로고 Link, Avatar/로그인 토글
27. `frontend/src/components/layout/BottomNav.tsx` — 5탭, useLocation + Link, 활성탭 스타일
28. `frontend/src/components/layout/PageContainer.tsx` — max-w-7xl mx-auto px-6
29. `frontend/src/components/layout/AppLayout.tsx` — Header + Outlet + BottomNav 합성

**2c. Router + Entry**
30. `frontend/src/router.tsx` — createBrowserRouter, 12 라우트 (stub 페이지로 시작)
31. `frontend/src/App.tsx` — QueryClientProvider + RouterProvider
32. `frontend/src/main.tsx` — createRoot, globals.css import, App 렌더

### Phase 3: Domain Layer (~14 files)

**3a. Feature types**
33. `frontend/src/features/auth/types.ts` — User, AuthState
34. `frontend/src/features/partner/types.ts` — Partner, PartnerCategory (as const)
35. `frontend/src/features/event/types.ts` — Event, EventStatus (as const), EventParticipation, ParticipationStatus (as const)
36. `frontend/src/features/follow/types.ts` — Follow

**3b. Mock data** (types 의존)
37. `frontend/src/mocks/users.ts` — 5명 (일반 3, 파트너 2)
38. `frontend/src/mocks/partners.ts` — 8명 (food, game, beauty, tech, music 등)
39. `frontend/src/mocks/events.ts` — 12개 (pending 3, active 5, closed 4)
40. `frontend/src/mocks/follows.ts` — 6개 관계
41. `frontend/src/mocks/participations.ts` — 8개 (joined 4, won 2, lost 2)

**3c. Feature hooks** (Query Key Factory + mock data)
42. `frontend/src/features/partner/hooks.ts` — partnerKeys, usePartners(), usePartner(id)
43. `frontend/src/features/event/hooks.ts` — eventKeys, useEvents(), useEvent(id), useJoinEvent()
44. `frontend/src/features/follow/hooks.ts` — followKeys, useFollowing(), useToggleFollow()
45. `frontend/src/features/auth/hooks.ts` — useAuth() (authStore 래핑)

**3d. Feature components**
46. `frontend/src/features/partner/components/PartnerCard.tsx` — 인플루언서 그리드 카드
47. `frontend/src/features/event/components/EventCard.tsx` — 이벤트 리스트 카드
48. `frontend/src/features/event/components/EventStatusChip.tsx` — 상태별 Chip
49. `frontend/src/features/partner/components/MetricCard.tsx` — 대시보드 통계 카드
50. `frontend/src/features/follow/components/FollowButton.tsx` — 팔로우/언팔로우 토글

### Phase 4: Pages (~12 files)

**4a. Auth/Form 페이지**
51. `frontend/src/pages/AuthPage.tsx` — Google 로그인 버튼 (mock)
52. `frontend/src/pages/NicknamePage.tsx` — 닉네임 설정 폼
53. `frontend/src/pages/PartnerJoinPage.tsx` — 파트너 가입 폼

**4b. List 페이지**
54. `frontend/src/pages/HomePage.tsx` — 파트너 그리드 + 카테고리 필터 칩
55. `frontend/src/pages/FollowingPage.tsx` — 팔로잉 파트너 목록 (로그인 가드)
56. `frontend/src/pages/EventsPage.tsx` — 이벤트 목록 + 팔로워/전체 탭 + 상태 필터
57. `frontend/src/pages/HistoryPage.tsx` — 참여 기록 (로그인 가드)

**4c. Detail/Management 페이지**
58. `frontend/src/pages/EventDetailPage.tsx` — 히어로 이미지 + 상세 + 참여 CTA
59. `frontend/src/pages/ProfilePage.tsx` — 인플루언서 프로필 + 이벤트/소개 탭
60. `frontend/src/pages/PartnerDashboardPage.tsx` — 메트릭 카드 + 이벤트 목록 (파트너 가드)
61. `frontend/src/pages/EventCreatePage.tsx` — 이벤트 생성 폼 (파트너 가드)
62. `frontend/src/pages/EventManagePage.tsx` — 이벤트 관리 + 참여자 목록 (파트너 가드)

---

## Key Technical Decisions

| 결정 | 내용 |
|---|---|
| **라우터** | `createBrowserRouter` + `RouterProvider` (React Router v7) |
| **Mock 데이터** | `useQuery({ queryFn: async () => { await delay(300); return MOCK_DATA } })` |
| **Auth 토글** | Header에 3-state 토글: 비로그인 → 일반유저 → 파트너 |
| **라우트 가드** | 페이지 내부에서 authStore 체크 → 비로그인 시 AuthPage 안내 렌더 |
| **PostCSS** | 불필요 — @tailwindcss/vite 플러그인이 처리 |
| **이미지** | mock 데이터에 외부 URL 사용 (로컬 이미지 디렉토리 없음) |
| **Named export** | 모든 파일 named export (default export 없음) |

## Design System 적용 체크리스트

- [ ] No-Line Rule: 1px 보더 금지 → bg 색상 차이로 구분
- [ ] Glass & Gradient: Header, BottomNav에 glass-panel 적용
- [ ] Ghost Border: Input 필드만 outline-variant/20
- [ ] 순백 금지: 텍스트는 항상 text-on-background (#dee5ff)
- [ ] Neon glow: neon-glow-primary/secondary 카드/버튼에 적용
- [ ] Pill 버튼: rounded-full + primary 그라데이션
- [ ] Pop 요소: 모든 카드에 secondary/tertiary 칩 (LIVE, D-3 등)
- [ ] 하드코딩 hex 금지: text-[#f382ff] → text-primary 시맨틱 토큰 사용

---

## Verification

| 단계 | 검증 |
|---|---|
| Phase 1 완료 | `cd frontend && npm install && npx tsc --noEmit` 성공 |
| Phase 2 완료 | `npm run dev` → Header + BottomNav 표시, 탭 네비게이션 동작 |
| Phase 3 완료 | mock 데이터가 useQuery를 통해 로딩, feature 컴포넌트 렌더 |
| Phase 4 완료 | 12개 페이지 전체 접근 가능, auth 토글로 3가지 상태 전환 |
| **최종** | `npm run build` + `npx tsc --noEmit` 에러 없음, 전체 네비게이션 동작 |

---

## Critical Reference Files

- `temp/src/index.css` — Tailwind v4 @theme 토큰 54개 + 커스텀 유틸 클래스 (직접 포팅)
- `temp/src/screens/Home.tsx` — 인플루언서 카드 패턴, 그리드 레이아웃 (가장 완성도 높은 참조)
- `temp/src/components/TopNav.tsx` — Header 글래스 패턴
- `.docs/DESIGN.md` — "Neon Editorial" 디자인 규칙
- `.claude/feat/frontend-prototype.md` — 전체 스펙 (컴포넌트 인터페이스, mock 데이터 구조 등)
- `.docs/planning/02_page_definition.md` — 12페이지 정의 + 접근 권한
- `.docs/planning/03_home.md ~ 07_partner.md` — 각 페이지 상세 기획
