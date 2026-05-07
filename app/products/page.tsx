import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductsGrid } from '@/components/products-grid'
import { ProductFilters } from '@/components/product-filters'
import type { Product } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our collection of premium digital products including courses, templates, e-books, and more.',
}

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  // Apply category filter
  if (params.category) {
    query = query.eq('category', params.category)
  }

  // Apply search filter
  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`)
  }

  // Apply sorting
  switch (params.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
  }

  const { data: products } = await query

  // Get unique categories for filter
  const { data: allProducts } = await supabase
    .from('products')
    .select('category')
    .eq('is_active', true)

  const categories = [...new Set(allProducts?.map(p => p.category).filter(Boolean))] as string[]

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          {params.category ? params.category : 'All Products'}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {params.search
            ? `Search results for "${params.search}"`
            : 'Discover premium digital products to level up your skills'}
        </p>
      </div>

      {/* Filters */}
      <ProductFilters 
        categories={categories} 
        currentCategory={params.category}
        currentSort={params.sort}
        searchQuery={params.search}
      />

      {/* Products Grid */}
      <Suspense fallback={<ProductsGridSkeleton />}>
        <ProductsGrid products={(products as Product[]) || []} />
      </Suspense>
    </div>
  )
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="aspect-[4/3] bg-muted animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-6 bg-muted rounded w-20 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
