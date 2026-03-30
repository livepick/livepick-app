/**
 * useNavigationHistory
 *
 * 앱 내부 네비게이션 히스토리를 sessionStorage로 추적하여
 * 뒤로갈 곳이 있는지(canGoBack) 정확하게 판별한다.
 *
 * 동작 원리:
 * - NavigationTracker (providers.tsx에 배치)가 pathname 변경마다 depth를 증가
 * - 개별 페이지에서 useNavigationHistory()로 canGoBack/goBack 사용
 * - 직접 URL 접근 → depth=1 (첫 진입) → canGoBack=false
 * - 앱 내부 이동 후 → depth>1 → canGoBack=true
 * - 세션 종료 시 자동 초기화 (sessionStorage 특성)
 *
 * Usage:
 *   // providers.tsx (앱 루트)
 *   <NavigationTracker />
 *
 *   // 개별 페이지
 *   const { canGoBack, goBack } = useNavigationHistory()
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const STORAGE_KEY = 'livepick:nav-depth'

function getDepth(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(sessionStorage.getItem(STORAGE_KEY) ?? '0', 10)
}

function setDepth(depth: number) {
  sessionStorage.setItem(STORAGE_KEY, String(Math.max(0, depth)))
}

/**
 * NavigationTracker
 *
 * 앱 루트(providers.tsx)에 한 번 배치.
 * pathname 변경마다 sessionStorage depth를 증가시킨다.
 * 렌더 출력 없음(null).
 */
export function NavigationTracker() {
  const pathname = usePathname()
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (prevPathRef.current === null) {
      setDepth(1)
      prevPathRef.current = pathname
      return
    }

    if (prevPathRef.current !== pathname) {
      setDepth(getDepth() + 1)
      prevPathRef.current = pathname
    }
  }, [pathname])

  return null
}

/**
 * useNavigationHistory
 *
 * 개별 페이지에서 호출. 뒤로갈 곳이 있는지 판별 + goBack 제공.
 */
export function useNavigationHistory() {
  const router = useRouter()
  const [canGoBack] = useState(() => getDepth() > 1)

  const goBack = () => {
    const current = getDepth()
    setDepth(Math.max(0, current - 2))
    router.back()
  }

  return { canGoBack, goBack }
}
