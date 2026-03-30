---
paths:
  - "**/handler.go"
  - "**/service.go"
  - "**/router.go"
  - "**/routes/**"
  - "**/api/**"
---

# REST API 설계 수칙

---

## I. API 계층 구조

```
클라이언트 (React SPA)
  ↓ HTTP (REST)
Go 백엔드 (LivePick API Server)
  ↓ DB / 외부 서비스
PostgreSQL / Redis / Google OAuth
```

---

## II. URL 설계

### 기본 규칙
- API 버전 접두사 필수: `/api/v1/`
- 리소스 이름은 복수형, kebab-case: `/api/v1/events`, `/api/v1/partners`
- GET 요청에 body 포함 금지 → 쿼리 파라미터 사용

### URL 패턴

| 동작 | HTTP | URL 패턴 | 예시 |
|------|------|----------|------|
| 생성 | POST | `/api/v1/{리소스}` | `POST /api/v1/events` |
| 조회 | GET | `/api/v1/{리소스}/{id}` | `GET /api/v1/events/123` |
| 목록 | GET | `/api/v1/{리소스}` | `GET /api/v1/events?page=1&per_page=20` |
| 수정 | PATCH | `/api/v1/{리소스}/{id}` | `PATCH /api/v1/events/123` |
| 삭제 | DELETE | `/api/v1/{리소스}/{id}` | `DELETE /api/v1/events/123` |
| 액션 | POST | `/api/v1/{리소스}/{id}/{action}` | `POST /api/v1/events/123/join` |

### 중첩 리소스
```
GET  /api/v1/partners/{id}/events       # 파트너의 이벤트 목록
GET  /api/v1/events/{id}/participants   # 이벤트 참여자 목록
POST /api/v1/events/{id}/draw           # 이벤트 추첨
```

---

## III. 요청/응답 패턴

### 요청 (Request)
- Content-Type: `application/json`
- 인증: `Authorization: Bearer <token>` 헤더

### 응답 (Response)

```json
// 단일 리소스
{
  "data": {
    "id": "evt_123",
    "title": "이벤트 제목",
    "status": "active"
  }
}

// 목록
{
  "data": [
    { "id": "evt_123", "title": "이벤트 1" },
    { "id": "evt_124", "title": "이벤트 2" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20,
    "next_cursor": "abc123"
  }
}

// 에러
{
  "error": {
    "code": "not_found",
    "message": "Event not found"
  }
}
```

### 페이지네이션
- cursor 기반 우선 (무한 스크롤에 적합)
- offset 기반도 허용 (관리자 페이지 등)
- 쿼리 파라미터: `?cursor=abc123&per_page=20` 또는 `?page=1&per_page=20`

---

## IV. 에러 응답

### HTTP 상태 코드 매핑

| 코드 | 상수 | 용도 |
|------|------|------|
| 400 | `bad_request` | 잘못된 요청 형식 |
| 401 | `unauthorized` | 인증 필요 / 토큰 만료 |
| 403 | `forbidden` | 권한 없음 |
| 404 | `not_found` | 리소스 없음 |
| 409 | `conflict` | 중복 리소스 |
| 422 | `validation_error` | 검증 실패 (구체적 필드 에러) |
| 429 | `rate_limited` | 요청 제한 초과 |
| 500 | `internal_error` | 서버 내부 오류 |

### 검증 에러 상세
```json
{
  "error": {
    "code": "validation_error",
    "message": "Validation failed",
    "details": [
      { "field": "title", "message": "title is required" },
      { "field": "end_date", "message": "end_date must be after start_date" }
    ]
  }
}
```

---

## V. 인증 API

### Google OAuth 플로우
```
POST /api/v1/auth/google          # Google OAuth token → 서버 세션/JWT
POST /api/v1/auth/refresh         # 토큰 갱신
POST /api/v1/auth/logout          # 로그아웃
GET  /api/v1/auth/me              # 현재 사용자 정보
PATCH /api/v1/auth/me/nickname    # 닉네임 설정/변경
```

---

## VI. 금지 사항

| 금지 | 올바른 방법 |
|------|------------|
| API 버전 없이 URL 정의 | `/api/v1/` 접두사 필수 |
| GET 요청에 body 포함 | 쿼리 파라미터 사용 |
| 에러 메시지를 직접 UI에 표시 (서버 측 결정) | 에러 코드 반환 → 프론트에서 메시지 처리 |
| 내부 에러 상세를 클라이언트에 노출 | 일반 에러 메시지 반환 + 서버 로그에 상세 기록 |
| URL에 동사 사용 | 리소스 명사 + HTTP 메서드로 표현 (액션 제외) |
| 응답에 불필요한 데이터 포함 | 필요한 필드만 반환 |
