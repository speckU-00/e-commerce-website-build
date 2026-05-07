import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/hero'
import { FeaturedProducts } from '@/components/featured-products'
import { TrustBadges } from '@/components/trust-badges'
import { CategorySection } from '@/components/category-section'
import type { Product } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <>
      <Hero />
      <FeaturedProducts products={(featuredProducts as Product[]) || []} />
      <CategorySection />
      <TrustBadges />
    </>
  )
}
