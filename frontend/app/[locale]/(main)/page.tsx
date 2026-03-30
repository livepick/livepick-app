'use client'

import { Container } from '@/components/layout/Container'
import { PartnerCard } from '@/features/partner/components/PartnerCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { usePartners } from '@/features/partner/hooks'

export default function HomePage() {
  const { data: partners, isLoading } = usePartners()

  return (
    <Container className="flex flex-col gap-6 lg:gap-8">
      <section className="relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10">
          <h1 className="font-headline text-4xl md:text-6xl font-black italic tracking-tighter text-on-background uppercase mb-2 leading-[0.9]">
            VIBE <span className="text-primary">CHECK</span>
          </h1>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-4">
            {['Recommended', 'Popular', 'New', 'Trending'].map(
              (tab, index) => (
                <button
                  key={tab}
                  className={
                    index === 0
                      ? 'px-8 py-3 rounded-full bg-secondary text-on-secondary font-bold text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(162,243,31,0.2)] whitespace-nowrap'
                      : 'px-8 py-3 rounded-full bg-surface-container-high text-on-surface hover:text-secondary border border-outline-variant/20 font-bold text-sm tracking-widest uppercase transition-all whitespace-nowrap'
                  }
                >
                  {tab}
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
            ))
          : partners?.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
      </section>
    </Container>
  )
}
