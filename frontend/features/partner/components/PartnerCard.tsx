'use client'

import { useRouter } from 'next/navigation'
import type { Partner } from '../types'

interface PartnerCardProps {
  partner: Partner
}

function formatFollowerCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(0)}K`
  }
  return String(count)
}

export function PartnerCard({ partner }: PartnerCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/p/${partner.id}`)
  }

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group relative flex flex-col bg-surface-container-low rounded-xl overflow-hidden transition-all hover:-translate-y-2"
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={partner.profileImage}
          alt={partner.channelName}
          loading="lazy"
        />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <span className="text-[10px] font-black text-tertiary tracking-widest uppercase opacity-80">
          {partner.category}
        </span>
        <h3 className="font-headline font-bold text-lg leading-tight group-hover:text-primary transition-colors">
          {partner.channelName}
        </h3>
        <div className="flex justify-between items-center mt-2 opacity-60">
          <span className="text-xs font-medium">
            {formatFollowerCount(partner.followerCount)} Fans
          </span>
          <span className="text-xs font-bold text-secondary">
            {partner.activeEventCount > 0
              ? `${partner.activeEventCount} ACTIVE`
              : 'NO EVENTS'}
          </span>
        </div>
      </div>
    </div>
  )
}
