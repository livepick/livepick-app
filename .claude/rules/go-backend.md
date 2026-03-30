---
paths:
  - "**/*.go"
  - "**/go.mod"
  - "**/go.sum"
---

# Go Backend Architecture

> 기준: Google 내부 권장 가이드 + LivePick 프로젝트 구조
> 코딩 규약·성능 패턴은 go-style.md 참조

---

## I. Project Structure (Google Standard Layout)

```
backend/
├── cmd/
│   └── api/
│       └── main.go              # 진입점. 의존성 조립(wire-up)만 수행
├── internal/                    # 외부 패키지에서 import 불가 (Go 언어 강제)
│   ├── <도메인>/                # 도메인별 패키지 (event, partner, user, follow 등)
│   │   ├── handler.go           # HTTP 핸들러 (전송 계층)
│   │   ├── service.go           # 비즈니스 로직 (핵심)
│   │   ├── repository.go        # 데이터 접근 계층
│   │   └── model.go             # 도메인 모델/엔티티
│   ├── middleware/               # HTTP 미들웨어 (auth, logging, cors, ratelimit)
│   └── config/                   # 설정 로드
├── pkg/                          # 프로젝트 공유 유틸리티 (외부 import 가능)
│   ├── response/                 # 표준 JSON 응답 포맷
│   ├── validator/                # 입력 검증 유틸리티
│   └── auth/                     # JWT/OAuth 유틸리티
├── config/                       # YAML 설정 파일 (local, dev, prod)
├── migrations/                   # DB 마이그레이션 파일
└── go.mod
```

### 도메인 모델의 상태/타입 필드 (model.go)
- status, type, category 등 식별자 필드는 반드시 Go typed const로 정의
- 비즈니스 로직에서 문자열/숫자 리터럴 직접 비교 절대 금지
```go
type EventStatus string
const (
    EventStatusPending  EventStatus = "pending"
    EventStatusActive   EventStatus = "active"
    EventStatusClosed   EventStatus = "closed"
)
if event.Status == EventStatusPending {}   // Good
// if event.Status == "pending" {}         // 금지
```

---

## II. Layered Architecture

```
Handler (전송 계층)     → 요청 파싱/응답 포맷팅
Service (비즈니스 계층)  → 비즈니스 규칙/오케스트레이션
Repository (데이터 계층) → DB/외부 서비스 접근
```

### Handler (전송 계층)
- HTTP 라우터 핸들러 구현, 입력 검증, Service 호출, 에러 → HTTP status 변환
```go
func (h *EventHandler) CreateEvent(w http.ResponseWriter, r *http.Request) {
    var req CreateEventRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        response.Error(w, http.StatusBadRequest, "invalid request body")
        return
    }
    if err := h.validator.Validate(req); err != nil {
        response.Error(w, http.StatusBadRequest, err.Error())
        return
    }
    result, err := h.service.CreateEvent(r.Context(), req)
    if err != nil {
        response.HandleError(w, err)
        return
    }
    response.JSON(w, http.StatusCreated, result)
}
```

### Service (비즈니스 계층)
- 순수 비즈니스 로직, 여러 Repository 오케스트레이션, HTTP 의존 금지

### Repository (데이터 계층)
- DB/외부 서비스 접근만, 비즈니스 로직 금지
```go
type EventRepository interface {
    Create(ctx context.Context, event *model.Event) error
    FindByID(ctx context.Context, id string) (*model.Event, error)
    ListByPartnerID(ctx context.Context, partnerID string, opts ListOptions) ([]*model.Event, error)
}
```

---

## III. Dependency Injection

- 전역 변수/싱글톤 금지. 생성자에서 모든 의존성 주입. 인터페이스에 의존
```go
// Good — 생성자 주입
func NewEventService(repo EventRepository, logger *zap.Logger) *EventService {
    return &EventService{repo: repo, logger: logger}
}
// Bad — var db = sql.Open(...)
```
- 조립은 `cmd/api/main.go`에서: config → logger → db → repo → svc → handler → router

---

## IV. HTTP Router & REST Patterns

### 라우터
- `net/http` 표준 라이브러리 또는 경량 라우터 (chi, gorilla/mux 등) 사용

### URL 패턴
| 동작 | HTTP | URL 패턴 |
|------|------|----------|
| 생성 | POST | `/api/v1/{리소스}` |
| 조회 | GET | `/api/v1/{리소스}/{id}` |
| 목록 | GET | `/api/v1/{리소스}` |
| 수정 | PUT/PATCH | `/api/v1/{리소스}/{id}` |
| 삭제 | DELETE | `/api/v1/{리소스}/{id}` |
| 액션 | POST | `/api/v1/{리소스}/{id}/{action}` |

### 표준 JSON 응답 포맷
```json
// 성공
{ "data": { ... } }

// 목록 성공
{ "data": [...], "meta": { "total": 100, "page": 1, "per_page": 20 } }

// 에러
{ "error": { "code": "not_found", "message": "event not found" } }
```

---

## V. Error Handling

### 비즈니스 에러 → HTTP 상태 코드 매핑
| 비즈니스 에러 | HTTP 코드 | 용도 |
|---------------|-----------|------|
| 입력 검증 실패 | 400 | Bad Request |
| 인증 실패 | 401 | Unauthorized |
| 권한 없음 | 403 | Forbidden |
| 리소스 없음 | 404 | Not Found |
| 이미 존재 | 409 | Conflict |
| 사전 조건 불충족 | 422 | Unprocessable Entity |
| 서버 내부 오류 | 500 | Internal Server Error |

### 에러 코드 체계
```go
// pkg/apperror/errors.go
type AppError struct {
    Code    string `json:"code"`
    Message string `json:"message"`
    Status  int    `json:"-"`
}

var (
    ErrNotFound     = &AppError{Code: "not_found", Message: "resource not found", Status: 404}
    ErrUnauthorized = &AppError{Code: "unauthorized", Message: "authentication required", Status: 401}
    ErrForbidden    = &AppError{Code: "forbidden", Message: "permission denied", Status: 403}
    ErrConflict     = &AppError{Code: "conflict", Message: "resource already exists", Status: 409}
)
```

---

## VI. Configuration

### 환경별 설정 파일
```
config/
├── local.yaml     # 로컬 개발
├── dev.yaml       # 개발 서버
└── prod.yaml      # 프로덕션
```

- 시크릿은 설정 파일에 넣지 않음 → 환경 변수 또는 AWS Secrets Manager 사용
- 환경 변수로 설정 파일 선택: `APP_ENV=local`

---

## VII. Logging

- 구조화된 로깅 (zap) 사용. `fmt.Println` 금지
- 민감 데이터 로깅 금지 (토큰, 비밀번호, 개인정보)
```go
// Good
s.logger.Info("event created", zap.String("eventID", event.ID), zap.String("partnerID", event.PartnerID))
// Bad — fmt.Println("event created:", event) / s.logger.Info("token: " + token)
```

---

## VIII. Concurrency Patterns

### errgroup (Google 권장)
```go
g, ctx := errgroup.WithContext(ctx)
g.Go(func() error { return notifyFollowers(ctx, eventID) })
g.Go(func() error { return updateFeed(ctx, eventID) })
if err := g.Wait(); err != nil { return fmt.Errorf("processing failed: %w", err) }
```

### Goroutine 관리
- 수명 주기 명확히: `sync.WaitGroup` 또는 context로 종료 관리
- 제한 없는 goroutine 생성 금지 (메모리 폭발)
- 동기 함수 선호 — 호출자가 동시성 결정

---

## IX. Database

### 일반 원칙
- SQL DB (PostgreSQL/MySQL) 사용 시 ORM 또는 sqlx 활용
- 마이그레이션 파일로 스키마 관리
- 쿼리에 사용자 입력 직접 주입 금지 — parameterized query 사용
- 인덱스는 쿼리 패턴에 맞게 설계

---

## X. Security

- HTTP 미들웨어에서 인증/인가 검증 필수
- SQL injection 방지: parameterized query 사용
- 시크릿은 환경 변수 또는 AWS Secrets Manager 관리 (하드코딩 금지)
- 모든 외부 입력(사용자 입력, URL 파라미터)은 validation/sanitization 필수
- Rate limiting 적용 필수
- CORS 설정 명시
- 민감 데이터 로깅 금지 (토큰, 비밀번호, 개인정보)
- 하드코딩된 API 키, 시크릿, 비밀번호 금지
- 보안 코드에 `math/rand` 금지 → `crypto/rand` 사용

---

## XI. Test Patterns

- 테이블 드리븐 테스트 필수
- 인터페이스 기반 모킹
- 실패 메시지: `got X; want Y` 패턴
- 테스트 파일은 같은 패키지에 `_test.go` 접미사
- 통합 테스트는 `//go:build integration` 태그 사용

---

## XII. Deploy (AWS EC2 + Load Balancer)

- 바이너리 빌드: `CGO_ENABLED=0 GOOS=linux go build -o app ./cmd/api`
- Graceful shutdown 필수: `os.Signal` 핸들링
- Health check 엔드포인트: `GET /health`
- Load Balancer 연동을 위한 헬스 체크 응답 필수
