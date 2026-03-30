export const PARTNER_CATEGORIES = [
  'food',
  'game',
  'beauty',
  'tech',
  'music',
  'fitness',
  'lifestyle',
  'art',
] as const

export type PartnerCategory = (typeof PARTNER_CATEGORIES)[number]

export interface Partner {
  id: string
  userId: string
  channelName: string
  channelUrl: string
  category: PartnerCategory
  bio: string
  profileImage: string
  coverImage: string
  followerCount: number
  activeEventCount: number
  createdAt: string
}
