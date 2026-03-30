# LivePick — 인플루언서 이벤트 플랫폼

## 프로젝트 개요

인플루언서(유튜버)와 팬(팔로워)을 연결하는 이벤트 플랫폼.
인플루언서가 이벤트를 생성하고, 팔로워가 참여하는 구조.

## 기술 스택

### Frontend
- **React** + TypeScript
- **TanStack Query v5** (서버 상태)
- **Zustand** (클라이언트 상태)
- **Tailwind CSS** (스타일링)
- **Cloudflare Workers** 배포

### Backend
- **Go** (REST API)
- **chi** 또는 **gorilla/mux** (HTTP 라우터)
- **PostgreSQL** (메인 DB)
- **Redis** (캐시/세션)
- **zap** (구조화 로깅)
- **AWS EC2 + Load Balancer** 배포

### 인증
- Google OAuth 2.0 (1차)
- Kakao OAuth (추후)

---

## 프로젝트 구조

```
livepick/
├── frontend/              # React SPA
│   └── src/
│       ├── components/    # 공통 UI 컴포넌트
│       ├── features/      # 도메인별 기능 (event, partner, auth, follow)
│       ├── hooks/         # 공통 커스텀 훅
│       ├── api/           # API 클라이언트 및 함수
│       ├── stores/        # Zustand 스토어
│       ├── types/         # 공통 타입
│       └── pages/         # 페이지 컴포넌트
├── backend/               # Go REST API
│   ├── cmd/api/           # 진입점 (main.go)
│   ├── internal/          # 도메인 패키지 (event, partner, user, follow)
│   ├── pkg/               # 공유 유틸리티 (response, validator, auth)
│   ├── config/            # 환경별 설정
│   └── migrations/        # DB 마이그레이션
├── docs/planning/         # 기획 문서
└── .claude/               # Claude Code 설정
    ├── agents/            # 에이전트 정의
    ├── rules/             # 코딩 규칙
    └── skills/            # 스킬 정의
```

---

## 작업 규칙

### 공통 원칙
1. **추측 금지**: 코드를 읽고 확인한 후 작업한다. 추측으로 코드를 작성하지 않는다.
2. **규칙 우선**: `.claude/rules/` 규칙을 반드시 읽고 준수한다.
3. **기존 패턴 복제**: 새 코드는 기존 코드의 패턴을 따른다.
4. **에러 코드 상수화**: 상태값, 에러 코드 등은 반드시 typed const / `as const`로 정의. 문자열 리터럴 비교 금지.

### Backend (Go)
- Google Standard Layout: `cmd/` → `internal/<domain>/` → handler/service/repository/model
- Handler → Service → Repository 계층 분리 필수
- 생성자 주입 (DI), 전역 변수/싱글톤 금지
- 구조화 로깅 (zap). `fmt.Println` 금지
- 상세: `.claude/rules/go-backend.md`, `.claude/rules/go-style.md`

### Frontend (React)
- TanStack Query로 서버 상태 관리. `useEffect` 데이터 페칭 금지
- Zustand는 클라이언트 상태만. API 데이터 캐싱 금지
- Tailwind CSS 사용. 인라인 스타일 금지
- TypeScript strict. `any` 금지
- 상세: `.claude/rules/frontend-react.md`

### API 설계
- REST API, `/api/v1/` 접두사 필수
- 표준 JSON 응답: `{ "data": ... }` / `{ "error": { "code": "...", "message": "..." } }`
- 상세: `.claude/rules/api-design.md`

### Git
- 커밋 메시지: `type: description` (lowercase, present tense, max 72 chars)
- main에 force push 금지
- 시크릿 파일 커밋 금지
- 상세: `.claude/rules/git-workflow.md`

---

## 사용 가능한 스킬 (Slash Commands)

| 스킬 | 용도 | 규모 |
|------|------|------|
| `/discuss` | 기술 조사 + 분석 리포트 | 조사 전용 |
| `/design-feature` | 피처 설계 문서 작성 | 대규모 |
| `/impl-fullstack` | Backend + Frontend 풀스택 구현 | 대규모 |
| `/impl-backend-go` | Go 백엔드 구현 | 대규모 |
| `/impl-frontend` | 프론트엔드 구현 | 대규모 |
| `/impl-light` | 소규모 양쪽 변경 (7파일 이하) | 소규모 |
| `/fix-light` | 버그 수정 | 소규모 |
| `/design-review` | 설계 문서 검토 | 리뷰 |
| `/git-push` | 커밋 + 푸시 | 유틸 |

### 스킬 선택 가이드
```
"이거 어떻게 하면 좋을까?" → /discuss
"새 기능 설계해줘"          → /design-feature
"풀스택 구현해줘"           → /impl-fullstack
"백엔드만 구현해줘"         → /impl-backend-go
"프론트만 구현해줘"         → /impl-frontend
"간단하게 수정해줘"         → /impl-light
"버그 고쳐줘"              → /fix-light
"설계 검토해줘"            → /design-review
"커밋해줘"                → /git-push
```

---

## 에이전트

| 에이전트 | 역할 | 모델 |
|---------|------|------|
| `backend-go-developer` | Go 백엔드 구현 | Opus |
| `backend-go-reviewer` | Go 백엔드 코드 리뷰 | Sonnet |
| `frontend-developer` | 프론트엔드 구현 | Opus |
| `frontend-reviewer` | 프론트엔드 코드 리뷰 | Sonnet |
| `codebase-analyst` | 코드베이스 분석 | Sonnet |
| `tech-researcher` | 기술 자료 조사 | Sonnet |

---

## 도메인 모델 (핵심)

### User (사용자)
- id, email, nickname, profile_image, is_partner, created_at

### Partner (파트너/인플루언서)
- id, user_id, channel_name, channel_url, category, bio, profile_image, follower_count, created_at

### Event (이벤트)
- id, partner_id, title, description, image_url, start_date, end_date, status, winner_count, created_at
- status: `pending` | `active` | `closed`

### Follow (팔로우)
- id, user_id, partner_id, created_at

### EventParticipation (이벤트 참여)
- id, event_id, user_id, status, created_at
- status: `joined` | `won` | `lost`
