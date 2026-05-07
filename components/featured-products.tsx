'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import type { Product } from '@/types'

interface FeaturedProductsProps {
  products: Product[]
  isLoading?: boolean
}

export function FeaturedProducts({ products, isLoading }: FeaturedProductsProps) {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Featured Products
            </h2>
            <p className="mt-2 text-muted-foreground">
              Our most popular digital products, handpicked for you
            </p>
          </div>
          <Link href="/products" className="shrink-0">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
        </div>

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured products available.</p>
          </div>
        )}
      </div>
    </section>
  )
}
