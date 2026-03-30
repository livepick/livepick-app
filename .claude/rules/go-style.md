---
paths:
  - "**/*.go"
  - "**/go.mod"
  - "**/go.sum"
---

# Go Coding Conventions & Performance Patterns

> 기준: Google Go Style Guide + Effective Go + Uber Go Style Guide
> 아키텍처·계층 구조는 go-backend.md 참조
> 원칙: **무비용 최적화는 항상 적용. 복잡성 추가 최적화는 프로파일링 후에만.**

---

## I. Naming Rules

### 패키지 이름
- 소문자 한 단어. 언더스코어/mixedCaps 금지
- 의미 없는 이름 금지: `util`, `common`, `misc`, `helper`, `types`
- 패키지 이름이 접두사 역할 → 식별자에서 반복 금지
```go
// Good: package event → type Event struct{}  (event.Event)
// Bad: package event_handler / type EventEvent struct{}
```

### 변수 이름
- 스코프 크기에 비례: 1~7줄 `i,c,r` / 8~15줄 `count,client` / 15~25줄 `lineCount` / 25줄+ `inTransaction`
- 항상 `MixedCaps` 또는 `mixedCaps`. 언더스코어 절대 금지
- 타입 정보를 이름에 넣지 않음: `numUsers` → `users`, `nameString` → `name`

### 함수/메서드 이름
- 공개: PascalCase, 비공개: camelCase
- getter에 `Get` 접두사 금지: `func (u *User) Name() string` (Good) / `GetName()` (Bad)

### 생성자
- 패키지에 타입 여럿: `NewEvent(...)` / 핵심 타입 하나: `New()`

### 인터페이스
- 단일 메서드: 메서드명 + `-er` 접미사
- 소비자(consumer) 패키지에서 정의. 생산자에서 정의 금지
- 생성자에서 인터페이스 반환 금지 → 구체 타입 반환

### 상수 / Enum
- `PascalCase` 또는 `camelCase`. **SCREAMING_SNAKE_CASE 절대 금지**
```go
// string enum (DB 호환): typed const
type EventStatus string
const (
    EventStatusPending   EventStatus = "pending"
    EventStatusActive    EventStatus = "active"
    EventStatusClosed    EventStatus = "closed"
)
```

### 상태/타입 필드 리터럴 비교 금지
- typed const로 정의된 식별자를 문자열/숫자 리터럴로 비교 금지 → 정의된 const 값과 비교

### 약어(Acronym) 규칙
- 전체 대문자 또는 전체 소문자. 혼합 금지: `URL`/`url` (Good) / `Url` (Bad), `ID`/`id` (Good) / `Id` (Bad)

### 리시버 이름
- 타입의 1~2글자 약어. 모든 메서드에서 일관 사용. `this`/`self`/`me` 절대 금지

### 에러 변수 / 타입
- sentinel 에러: `Err` 접두사. 에러 문자열: 소문자 시작, 마침표 없음
```go
var ErrNotFound = errors.New("not found")
fmt.Errorf("failed to process event %q", eventID)  // 소문자, 마침표 없음
```

### 테스트 함수 이름
- 서브테스트 구분에 언더스코어 허용. 실패 메시지: `got X; want Y` 패턴

---

## II. Code Style

### import 그룹 및 순서
- 3그룹, 빈 줄로 구분: 표준 라이브러리 → 서드파티 → 프로젝트 내부
- `import .` (dot import) 절대 금지
- blank import(`_`)는 `main` 패키지 또는 테스트 파일에서만 허용

### 에러 처리
- error wrapping: `%w`는 포맷 문자열 **끝**에 배치 (내부). 시스템 경계에서 `%v`로 체인 끊기
- 에러 흐름은 들여쓰기, 정상 흐름은 들여쓰지 않음 (early return)
- sentinel 에러 비교: `errors.Is()` 사용. `==` 비교 금지
- 에러 무시 금지: `_ = doSomething()` 금지

### Context 사용
- 항상 첫 번째 파라미터. 구조체 필드에 저장 금지

### 구조체 초기화
- 외부 패키지 타입: 필드 이름 필수. 위치 기반 금지. 제로 값 명시 불필요

### 리시버 타입: 포인터 vs 값
| 포인터 `*T` 사용 | 값 `T` 사용 |
|-------------------|-------------|
| 메서드가 리시버를 변경 | 작고 불변인 구조체 |
| `sync.Mutex` 등 복사 불가 필드 포함 | map, channel, 함수 |
| 큰 구조체 (5+ 필드, 성능) | 기본 타입 (string, int) |
| 타입 내 모든 메서드 일관성 | 슬라이스 (재슬라이싱 없는 경우) |

- 한 타입 내에서 포인터/값 혼합 금지

### 기타
- Named Return: 같은 타입 여럿 반환할 때 의미 명확화용으로만
- 고루틴: 수명 주기 명확히, 동기 함수 선호, 채널 방향 명시
- defer: 리소스 정리에 적극 사용 (LIFO 순서)

---

## III. Data Structures & Performance Patterns

> 무비용 최적화는 항상 적용. 복잡성 추가 최적화는 프로파일링 후에만.

### Map vs Slice 판단 기준

| 상황 | 권장 | 이유 |
|------|------|------|
| key 기반 조회 | `map` | O(1) |
| 순회(iteration) 중심 | `slice` | 연속 메모리 |
| 5개 미만 소규모 집합 | `slice` | map 오버헤드가 더 큼 |
| 멤버십 확인 (set) | `map[K]bool` | 직관적 |
| 순서 보장 필요 | `slice` | map은 순서 미보장 |

### Pre-allocation (무비용 — 항상 적용)

| 상황 | 패턴 |
|------|------|
| 입력 크기를 아는 경우 | `make([]T, 0, len(input))` |
| 대략적 크기를 아는 경우 | `make([]T, 0, estimatedSize)` |
| 크기를 모르는 경우 | `var s []T` (런타임에 맡김) |
| map에 대략적 크기를 아는 경우 | `make(map[K]V, estimatedSize)` |

### Nil Slice vs Empty Slice
- nil slice (`var s []string`) → JSON null, 메모리 0. 기본 선택
- non-nil 빈 슬라이스 (`s := []string{}`) → JSON `[]` 필요 시

### 문자열 처리 (무비용 — 항상 적용)

| Bad | Good | 이유 |
|-----|------|------|
| `fmt.Sprintf("%d", n)` | `strconv.Itoa(n)` | reflection 오버헤드 제거 |
| `fmt.Sprintf("%s", s)` | `s` (직접 사용) | 불필요한 포맷팅 |
| 루프 내 `s += chunk` | `strings.Builder` | 매 연결마다 새 할당 방지 |

### sync 타입 복사 금지
- `sync.Mutex` 등 sync 타입은 반드시 포인터로 전달

---

## IV. Prohibited Patterns (종합)

| 금지 | 대안 |
|------|------|
| `import .` (dot import) | 명시적 `pkg.Name` |
| 라이브러리에서 blank import | `main` 또는 테스트에서만 |
| `util`, `common` 패키지 이름 | 도메인 특정 이름 |
| getter에 `Get` 접두사 | 메서드명 = 필드명 |
| 상수에 `SCREAMING_SNAKE_CASE` | `PascalCase` / `camelCase` |
| 리시버에 `this`, `self` | 타입의 1~2글자 약어 |
| 라이브러리 코드에서 `panic` | `error` 반환 |
| 구조체에 `context.Context` 저장 | 메서드 파라미터로 전달 |
| 보안 코드에 `math/rand` | `crypto/rand` 사용 |
| 에러에서 `==` 비교 | `errors.Is()` 사용 |
| 상태/타입 필드를 문자열 리터럴로 비교 | typed const 비교 |
| 에러 문자열 대문자/마침표 | 소문자, 마침표 없음 |

---

## V. Self-Verification Checklist

| # | 검사 항목 | 판정 |
|---|----------|------|
| 1 | 크기를 아는 slice/map에 pre-alloc 적용됨 | FAIL 시 수정 |
| 2 | 루프 내 문자열 연결에 `strings.Builder` 사용 | FAIL 시 수정 |
| 3 | 단순 타입 변환에 `strconv` 사용 (`fmt.Sprintf` 아님) | FAIL 시 수정 |
| 4 | goroutine 수명 주기 명확 (WaitGroup / context) | FAIL 시 수정 |
| 5 | sync 타입 복사 없음 | FAIL 시 수정 |
| 6 | 복잡성 추가 최적화에 벤치마크 근거 있음 | 근거 없으면 제거 |
