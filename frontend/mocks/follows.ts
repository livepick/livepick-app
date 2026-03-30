import type { Follow } from '@/features/follow/types'

export const MOCK_FOLLOWS: Follow[] = [
  { id: 'f1', userId: 'u1', partnerId: 'p1', createdAt: '2025-06-01T00:00:00Z' },
  { id: 'f2', userId: 'u1', partnerId: 'p3', createdAt: '2025-07-15T00:00:00Z' },
  { id: 'f3', userId: 'u1', partnerId: 'p5', createdAt: '2025-08-20T00:00:00Z' },
  { id: 'f4', userId: 'u3', partnerId: 'p1', createdAt: '2025-09-01T00:00:00Z' },
  { id: 'f5', userId: 'u3', partnerId: 'p2', createdAt: '2025-09-15T00:00:00Z' },
  { id: 'f6', userId: 'u4', partnerId: 'p7', createdAt: '2025-10-01T00:00:00Z' },
  { id: 'f7', userId: 'u2', partnerId: 'p2', createdAt: '2025-07-01T00:00:00Z' },
  { id: 'f8', userId: 'u2', partnerId: 'p4', createdAt: '2025-08-10T00:00:00Z' },
  { id: 'f9', userId: 'u2', partnerId: 'p6', createdAt: '2025-09-05T00:00:00Z' },
  { id: 'f10', userId: 'u2', partnerId: 'p7', createdAt: '2025-09-20T00:00:00Z' },
  { id: 'f11', userId: 'u2', partnerId: 'p8', createdAt: '2025-10-15T00:00:00Z' },
]
