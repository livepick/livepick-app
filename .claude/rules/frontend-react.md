---
paths:
  - "**/*.tsx"
  - "**/*.ts"
  - "**/*.css"
---

# Frontend React Rules

> React + Vite (또는 Next.js) + Cloudflare Workers 배포 기준

---

## I. State Management (3-tier)

| 계층 | 도구 | 대상 | 예시 |
|------|------|------|------|
| **Server State** | TanStack Query | 서버 데이터 (비동기, 캐싱) | 이벤트 목록, 파트너 정보 |
| **Client State** | Zustand | UI 데이터 (동기, 로컬) | 인증 토큰, 모달 상태, 테마 |
| **Derived** | 렌더링 중 계산 | props/state 파생값 | 필터된 목록, 합계 |

---

## II. Naming Rules

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | `PascalCase.tsx` | `EventCard.tsx` |
| 유틸리티/훅 | `camelCase.ts` | `useEvent.ts` |
| 라우트 경로 | `kebab-case` | `/event-detail` |
| Props 인터페이스 | `ComponentNameProps` | `EventCardProps` |
| 이벤트 핸들러 | `handle` + 동사 | `handleSubmit` |
| Boolean props | `is`/`has`/`should` | `isOpen`, `hasError` |

---

## III. Export Rules

- **Named Export 기본**: `export function ComponentName`
- **Default Export**: 프레임워크 요구 시에만 (`page.tsx`, `layout.tsx` 등)

---

## IV. Component Structure

### 디렉토리 구조
```
frontend/
├── src/
│   ├── components/          # 공통 UI 컴포넌트
│   │   ├── ui/              # 기본 컴포넌트 (Button, Input, Card 등)
│   │   └── layout/          # 레이아웃 (Header, Footer, Nav)
│   ├── features/            # 도메인별 기능 컴포넌트
│   │   ├── event/           # 이벤트 관련
│   │   ├── partner/         # 파트너 관련
│   │   ├── auth/            # 인증 관련
│   │   └── follow/          # 팔로우 관련
│   ├── hooks/               # 공통 커스텀 훅
│   ├── api/                 # API 클라이언트 및 함수
│   ├── stores/              # Zustand 스토어
│   ├── types/               # 공통 타입 정의
│   ├── utils/               # 유틸리티 함수
│   └── pages/               # 페이지 컴포넌트 (라우팅)
```

---

## V. Data Fetching

### TanStack Query 필수
```tsx
// Good
const { data: events, isLoading } = useQuery({
  queryKey: ['events', { tab, page }],
  queryFn: () => eventApi.listEvents({ tab, page }),
});

// Bad — useEffect + useState로 데이터 페칭
```

### Query Key Factory 패턴
```ts
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: EventFilters) => [...eventKeys.lists(), filters] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
};
```

### Mutation + Cache Invalidation
```tsx
const { mutate: joinEvent } = useMutation({
  mutationFn: (eventId: string) => eventApi.joinEvent(eventId),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: eventKeys.all });
  },
});
```

---

## VI. useEffect Rules

> **외부 시스템 동기화 전용**. React 내부 로직에 사용 금지.

금지: 파생 상태 계산 / 이벤트 후속 처리 / props→state 동기화 / state 연쇄 업데이트 / 데이터 페칭
허용: WebSocket / DOM 조작 / 브라우저 이벤트 리스너 / 타이머 / Analytics (cleanup 필수)

---

## VII. Styling

### Tailwind CSS 기본
- 시맨틱 토큰 사용 권장 (디자인 시스템 구축 시)
- hex 하드코딩 최소화 → CSS 변수 또는 Tailwind config 활용
- `style={{}}` 인라인 스타일 금지 → Tailwind 클래스
- `cn()` 또는 `clsx()` 로 조건부 클래스 결합

### 반응형 (Mobile First)
- 모바일 기본 → `sm:` → `md:` → `lg:` → `xl:` 순서
- 기획 문서 그리드 시스템 참조 (08_system.md)

---

## VIII. Security

| 금지 | 대안 |
|------|------|
| `dangerouslySetInnerHTML`에 사용자 입력 | sanitization 라이브러리 또는 금지 |
| `eval()`, `new Function()`, `innerHTML` | 사용 금지 |
| localStorage에 인증 토큰 (프로덕션) | httpOnly cookie 권장 |
| console.log에 민감 데이터 | 노출 금지 |
| 하드코딩 API 키/시크릿 | 환경 변수 사용 |

---

## IX. Prohibited Patterns

| 금지 | 대안 |
|------|------|
| `style={{}}` 인라인 | Tailwind |
| hex 하드코딩 (대량) | CSS 변수 / Tailwind config |
| raw `<button>`, `<input>` (디자인 시스템 구축 후) | 시스템 컴포넌트 |
| `useEffect` 데이터 페칭 | TanStack Query |
| API→useState/Zustand 캐싱 | TanStack Query |
| `any` 타입 | `unknown` + 타입 가드 |
| 에러 코드 문자열 하드코딩 | 상수 정의 후 사용 |

---

## X. Type Safety

- TypeScript strict 모드 필수
- `any` 금지 → `unknown` + 타입 가드
- API 응답 타입은 백엔드와 공유 또는 API 스키마 기반 생성
- 상태값(status, type 등)은 `as const` 또는 enum으로 정의

---

## XI. API Client

### 표준 API 클라이언트
```ts
// api/client.ts
const apiClient = {
  get: <T>(url: string, params?: Record<string, unknown>) => Promise<ApiResponse<T>>,
  post: <T>(url: string, data?: unknown) => Promise<ApiResponse<T>>,
  patch: <T>(url: string, data?: unknown) => Promise<ApiResponse<T>>,
  delete: <T>(url: string) => Promise<ApiResponse<T>>,
};
```

### 에러 처리
- API 함수는 에러를 throw하지 않고 Result 패턴 또는 TanStack Query의 onError에서 처리
- 에러 코드 기반 사용자 메시지 표시 (서버 에러 메시지 직접 노출 금지)

---

## XII. Performance

- `Promise.all()` 로 독립적인 API 호출 병렬화
- 무한 스크롤: `useInfiniteQuery` 사용
- 이미지 lazy loading
- 코드 스플리팅: 라우트 기반
- 번들 크기 주의: barrel import 자제

---

## XIII. Deploy (Cloudflare Workers)

- 정적 자산은 Cloudflare CDN에서 서빙
- 환경 변수는 Cloudflare Workers 환경에서 관리
- API 엔드포인트는 환경별 설정 (local → dev → prod)
