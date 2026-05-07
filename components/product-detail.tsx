'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Check, 
  Shield, 
  Download, 
  Clock, 
  Tag,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ProductCard } from '@/components/product-card'
import { fbEvents } from '@/components/meta-pixel'
import type { Product } from '@/types'

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const features = Array.isArray(product.features) 
    ? product.features 
    : typeof product.features === 'string' 
      ? JSON.parse(product.features) 
      : []

  // Track page view
  useEffect(() => {
    fbEvents.viewContent({
      content_name: product.name,
      content_category: product.category || 'Uncategorized',
      value: product.price,
      currency: 'INR',
    })
  }, [product])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/products" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" />
          Products
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Tag className="h-16 w-16 text-muted-foreground/50" />
              </div>
            )}
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              {discount > 0 && (
                <Badge variant="destructive" className="text-sm">
                  {discount}% OFF
                </Badge>
              )}
              {product.category && (
                <Badge variant="secondary" className="text-sm">
                  {product.category}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-balance">
            {product.name}
          </h1>

          {product.short_description && (
            <p className="mt-4 text-lg text-muted-foreground">
              {product.short_description}
            </p>
          )}

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-bold">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xl text-muted-foreground line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
            {discount > 0 && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                Save ₹{(product.original_price! - product.price).toLocaleString('en-IN')}
              </Badge>
            )}
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                What&apos;s Included
              </h3>
              <ul className="space-y-3">
                {features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Buy Button */}
          <div className="mt-8 space-y-4">
            <Link href={`/checkout/${product.slug}`} className="block">
              <Button size="lg" className="w-full text-base">
                Buy Now - ₹{product.price.toLocaleString('en-IN')}
              </Button>
            </Link>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                Description
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <ProductCard 
                key={relatedProduct.id} 
                product={relatedProduct} 
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
