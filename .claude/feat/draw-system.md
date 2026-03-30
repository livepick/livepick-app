# 추첨 시스템 (Draw System)

## 1. Overview

### 목표
파트너가 이벤트 참여자 중 당첨자를 추첨하는 독립 전체화면 페이지.
추첨 방식(게임 모드)이 지속 추가될 수 있는 플러그인 구조.

### 스코프
- **포함**: 추첨 페이지, 슬롯머신 모드, 하이라이트 순회 모드, 100명 mock 참여자, 추첨 완료 이벤트 예시
- **제외**: 실제 API 연동, 추첨 결과 서버 저장, 추가 게임 모드

### 모듈
- Frontend only (mock 데이터 기반)

---

## 2. Design Direction

### 톤: "Game Show"
- 라이브 방송 추첨의 긴장감 + 공정한 결과의 신뢰감
- 화면 공유에 적합한 시각적 임팩트
- 추첨 과정 자체가 엔터테인먼트

### 핵심 UI 순간
1. **모드 선택**: 차분한 선택 화면, 각 모드의 프리뷰/설명
2. **추첨 진행**: 전체화면 몰입, 긴장감 있는 애니메이션
3. **당첨 순간**: 네온 글로우 폭발, 당첨자 강조
4. **결과 화면**: 전체 당첨자 목록, 축하 분위기

### 상태 시각화
| 상태 | 표현 |
|------|------|
| 대기 (참여자 나열) | 기본 아바타 격자/리스트 |
| 추첨 중 | 하이라이트 이동 / 슬롯 스크롤 |
| 감속 중 | 속도 점차 감소, 긴장감 최고조 |
| 당첨 확정 | primary 글로우 폭발, 스케일 업 |
| 이미 당첨 | secondary 테두리, 반투명 처리 |

---

## 3. Technical Decisions

### 3.1 라우트 배치
`app/[locale]/partner/events/[id]/draw/page.tsx`
- `(main)/` 바깥 → Header/BottomNav 자동 제외
- 기존 `e/[id]`, `p/[id]` 독립 페이지 패턴과 동일

### 3.2 애니메이션
- CSS keyframes + requestAnimationFrame 조합
- 외부 라이브러리 없음 (프로젝트에 Framer Motion 등 미설치)
- `globals.css`에 추첨 전용 keyframes 추가

### 3.3 플러그인 구조
`as const` + typed registry 패턴 (프로젝트의 기존 상수 정의 패턴)
```ts
const DRAW_MODES = ['slot', 'highlight'] as const
type DrawModeId = (typeof DRAW_MODES)[number]
```
각 모드는 동일한 Props 인터페이스를 받는 독립 컴포넌트.
새 모드 추가 = 컴포넌트 파일 + registry 엔트리 1개.

### 3.4 상태 관리
로컬 useState (추첨은 일회성 UI 상태, Zustand 불필요)
```ts
const DRAW_PHASES = ['select', 'running', 'result'] as const
type DrawPhase = (typeof DRAW_PHASES)[number]
```

---

## 4. Frontend Design

### 4.1 타입 정의

```ts
// features/event/draw/types.ts

export const DRAW_MODES = ['slot', 'highlight'] as const
export type DrawModeId = (typeof DRAW_MODES)[number]

export const DRAW_PHASES = ['select', 'running', 'result'] as const
export type DrawPhase = (typeof DRAW_PHASES)[number]

export interface Participant {
  id: string
  nickname: string
  profileImage: string
}

export interface DrawModeProps {
  participants: Participant[]
  winnerCount: number
  onComplete: (winnerIds: string[]) => void
}

export interface DrawModeConfig {
  id: DrawModeId
  label: string
  description: string
  icon: string  // lucide icon name
}
```

Event 타입 확장:
```ts
// features/event/types.ts 수정
export interface Event {
  // ... 기존 필드
  winners?: string[]  // 당첨자 userId 배열 (추첨 완료 시)
}
```

### 4.2 컴포넌트 구조

```
app/[locale]/partner/events/[id]/draw/
  └── page.tsx                    # 추첨 페이지 (phase 관리)

features/event/draw/
  ├── types.ts                    # 타입, 상수
  ├── registry.ts                 # 모드 레지스트리
  ├── DrawModeSelector.tsx        # 모드 선택 UI
  ├── DrawResult.tsx              # 결과 화면
  ├── SlotMachineMode.tsx         # 슬롯머신 모드
  └── HighlightGridMode.tsx       # 하이라이트 순회 모드
```

### 4.3 페이지 흐름

```
[select]                    [running]                  [result]
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│ ← 이벤트 관리     │       │                  │       │                  │
│                  │       │   슬롯머신 or     │       │  🎉 추첨 완료!   │
│  추첨 방식 선택   │──────▶│   하이라이트 격자  │──────▶│                  │
│                  │       │                  │       │  당첨자 목록      │
│ [🎰 슬롯] [⚡격자]│       │   [STOP] 버튼    │       │                  │
│                  │       │                  │       │ [이벤트로 돌아가기]│
│  [추첨 시작]     │       │  라운드 1/3 진행  │       │                  │
└──────────────────┘       └──────────────────┘       └──────────────────┘
```

### 4.4 슬롯머신 모드 (SlotMachineMode)

**레이아웃**:
- 화면 중앙에 세로 슬롯 1열
- 참여자 아바타+닉네임이 세로로 빠르게 스크롤
- 가운데 포커스 영역 (네온 테두리)
- 위아래는 흐릿하게 fade

**동작**:
1. 자동 시작 → 빠른 속도로 스크롤
2. STOP 버튼 클릭 → 감속 (easeOutCubic)
3. 최종 정지 → 당첨자 확정 (글로우 연출)
4. winnerCount > 1이면 → 당첨자 제외 후 다음 라운드 자동 시작

**구현**: CSS transform translateY + requestAnimationFrame

### 4.5 하이라이트 순회 모드 (HighlightGridMode)

**레이아웃**:
- 10×10 아바타 격자 (100명)
- 하이라이트(네온 테두리 + 스케일업)가 랜덤 위치로 점프

**동작**:
1. 자동 시작 → 하이라이트가 빠르게 랜덤 이동 (50ms 간격)
2. STOP 버튼 클릭 → 점프 간격 점차 증가 (50ms → 500ms)
3. 최종 정지 → 당첨자 확정 (글로우 연출)
4. winnerCount > 1이면 → 당첨자 secondary 테두리 표시 + 다음 라운드

**구현**: setInterval + 간격 점진적 증가

### 4.6 결과 화면 (DrawResult)

- 당첨자 아바타 + 닉네임 목록
- 축하 텍스트
- "이벤트 관리로 돌아가기" 버튼

---

## 5. Mock 데이터

### 5.1 100명 참여자 생성
`mocks/participants.ts` — 추첨용 참여자 100명
닉네임은 한글 조합으로 자동 생성, 프로필 이미지는 기존 이미지 URL 순환 사용

### 5.2 추첨 완료 이벤트
기존 closed 이벤트 `e9` (설 특집 떡국 세트)에 `winners` 필드 추가:
```ts
winners: ['participant_3', 'participant_17', 'participant_42', 'participant_68', 'participant_91']
```

---

## 6. Implementation Plan

### 파일 순서

| 순서 | 파일 | 작업 |
|------|------|------|
| 1 | `features/event/types.ts` | Event에 `winners?: string[]` 추가 |
| 2 | `features/event/draw/types.ts` | 추첨 전용 타입 정의 |
| 3 | `mocks/participants.ts` | 100명 mock 참여자 생성 |
| 4 | `mocks/events.ts` | e9에 winners 추가 |
| 5 | `features/event/draw/registry.ts` | 모드 레지스트리 |
| 6 | `features/event/draw/DrawModeSelector.tsx` | 모드 선택 UI |
| 7 | `features/event/draw/SlotMachineMode.tsx` | 슬롯머신 구현 |
| 8 | `features/event/draw/HighlightGridMode.tsx` | 하이라이트 구현 |
| 9 | `features/event/draw/DrawResult.tsx` | 결과 화면 |
| 10 | `app/globals.css` | 추첨 keyframes 추가 |
| 11 | `app/[locale]/partner/events/[id]/draw/page.tsx` | 추첨 페이지 |
| 12 | `app/[locale]/(main)/partner/events/[id]/page.tsx` | "당첨자 추첨" 버튼 → draw 링크 연결 |

---

## 7. Edge Cases & 고려사항

| 케이스 | 처리 |
|--------|------|
| winnerCount > 참여자 수 | 추첨 시작 전 경고, 참여자 수만큼만 추첨 |
| 이미 추첨 완료된 이벤트 | draw 페이지 진입 시 결과 화면 바로 표시 |
| 파트너가 아닌 유저 접근 | 접근 불가 안내 + 돌아가기 |
| 브라우저 뒤로가기 | 추첨 중에는 확인 팝업 (추후) |
| winnerCount = 1 | 라운드 1회만 진행 |
