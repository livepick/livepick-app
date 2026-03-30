---
paths:
  - "**/error/**"
  - "**/errors.ts"
  - "**/error.ts"
  - "**/*.go"
---

# 에러 처리 아키텍처 (크로스 레이어)

---

## I. 에러 전파 흐름

```
DB / 외부 서비스
  ↓ DB 에러 / 네트워크 에러
Go 백엔드 (handler → service → repository)
  ↓ HTTP 에러 응답 (JSON)
프론트엔드 API Client
  ↓ 에러 코드 → 사용자 메시지
사용자
```

---

## II. 계층별 에러 정의

### 백엔드 (Go)
- 위치: `pkg/apperror/` 또는 각 도메인의 `errors.go`
- AppError 구조체: code + message + HTTP status

```go
type AppError struct {
    Code    string `json:"code"`
    Message string `json:"message"`
    Status  int    `json:"-"`
}

// 공통 에러
var (
    ErrNotFound     = &AppError{Code: "not_found", Status: 404}
    ErrUnauthorized = &AppError{Code: "unauthorized", Status: 401}
    ErrForbidden    = &AppError{Code: "forbidden", Status: 403}
)

// 도메인 에러
var (
    ErrEventClosed     = &AppError{Code: "event_closed", Message: "event is already closed", Status: 422}
    ErrAlreadyJoined   = &AppError{Code: "already_joined", Message: "already joined this event", Status: 409}
    ErrNotPartner      = &AppError{Code: "not_partner", Message: "partner registration required", Status: 403}
)
```

### 프론트엔드 (TypeScript)
- 위치: `src/api/errors.ts`
- 에러 코드 상수 + 사용자 메시지 매핑

```typescript
export const ErrorCode = {
  NOT_FOUND: 'not_found',
  UNAUTHORIZED: 'unauthorized',
  FORBIDDEN: 'forbidden',
  EVENT_CLOSED: 'event_closed',
  ALREADY_JOINED: 'already_joined',
  NOT_PARTNER: 'not_partner',
  NETWORK_ERROR: 'network_error',
  INTERNAL_ERROR: 'internal_error',
} as const;

export const ErrorMessage: Record<string, string> = {
  [ErrorCode.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [ErrorCode.UNAUTHORIZED]: '로그인이 필요합니다.',
  [ErrorCode.EVENT_CLOSED]: '이미 마감된 이벤트입니다.',
  [ErrorCode.ALREADY_JOINED]: '이미 참여한 이벤트입니다.',
  // ...
};
```

---

## III. 에러 처리 규칙

### 백엔드 (Go)
- 시스템 에러 (DB 실패) → 500 + 일반 메시지 (상세는 로그에만)
- 비즈니스 에러 (검증 실패) → 적절한 HTTP 코드 + 에러 코드
- 에러 wrapping: 내부 `%w`, 시스템 경계 `%v`

### 프론트엔드
- 에러 코드 문자열 하드코딩 금지 → `ErrorCode.XXX` 상수 사용
- `error.message` (서버 메시지) 직접 UI 표시 금지 → `ErrorMessage[code]` 사용
- 네트워크 에러 / 타임아웃 별도 처리

---

## IV. 금지 사항

| 금지 | 이유 |
|------|------|
| 서버 에러 상세를 클라이언트에 노출 | 보안 위험 (스택 트레이스 등) |
| 에러 코드 문자열 하드코딩 | 상수로 관리하여 오타/불일치 방지 |
| 에러 무시 (catch에서 아무 것도 안 함) | 최소한 로깅 필수 |
| 500 에러에 구체적 DB 에러 메시지 포함 | 일반 메시지 반환 |
