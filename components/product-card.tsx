'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/products/${product.slug}`}>
        <Card className="group overflow-hidden border-border/50 bg-card hover:border-border transition-all duration-300 hover:shadow-lg">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <Tag className="h-12 w-12 text-muted-foreground/50" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {discount > 0 && (
                <Badge variant="destructive" className="text-xs font-medium">
                  {discount}% OFF
                </Badge>
              )}
              {product.category && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {product.category}
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary/80 transition-colors">
              {product.name}
            </h3>
            
            {product.short_description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.short_description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.original_price && product.original_price > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.original_price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-muted rounded w-20 animate-pulse" />
          <div className="h-4 w-4 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
