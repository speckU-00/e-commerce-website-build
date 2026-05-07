'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Check, 
  Loader2,
  Tag,
  Mail,
  Phone
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { fbEvents } from '@/components/meta-pixel'
import type { Product, RazorpayPaymentResponse } from '@/types'

interface CheckoutFormProps {
  product: Product
  userEmail?: string
  userMobile?: string
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayPaymentResponse) => void
  prefill: {
    email: string
    contact?: string
  }
  theme: {
    color: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

interface RazorpayInstance {
  open: () => void
}

export function CheckoutForm({ product, userEmail, userMobile }: CheckoutFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [formData, setFormData] = useState({
    email: userEmail || '',
    mobile: userMobile || '',
  })

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  const features = Array.isArray(product.features) 
    ? product.features 
    : typeof product.features === 'string' 
      ? JSON.parse(product.features) 
      : []

  // Track initiate checkout
  useEffect(() => {
    fbEvents.initiateCheckout({
      value: product.price,
      currency: 'INR',
    })
  }, [product.price])

  const handlePayment = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address')
      return
    }

    if (!razorpayLoaded) {
      toast.error('Payment system is loading. Please try again.')
      return
    }

    setIsLoading(true)

    try {
      // Create order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          email: formData.email,
          mobileNumber: formData.mobile,
        }),
      })

      const orderData = await orderResponse.json()

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      // Initialize Razorpay
      const options: RazorpayOptions = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'AbuDigital Store',
        description: product.name,
        order_id: orderData.orderId,
        handler: async (response: RazorpayPaymentResponse) => {
          try {
            // Verify payment
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                dbOrderId: orderData.dbOrderId,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (!verifyResponse.ok) {
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            // Track purchase
            fbEvents.purchase({
              value: product.price,
              currency: 'INR',
              content_name: product.name,
            })

            toast.success('Payment successful!')
            router.push(`/confirmation/${orderData.dbOrderId}`)
          } catch (error) {
            console.error('Verification error:', error)
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        prefill: {
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#0a0a0a',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error instanceof Error ? error.message : 'Payment failed')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link 
          href={`/products/${product.slug}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to product
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Checkout Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Complete Your Purchase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-9"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Download link will be sent to this email
                  </p>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="pl-9"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    For order updates via WhatsApp
                  </p>
                </div>

                <Separator />

                {/* Payment Button */}
                <Button 
                  onClick={handlePayment} 
                  className="w-full h-12 text-base"
                  disabled={isLoading || !razorpayLoaded}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Pay ₹{product.price.toLocaleString('en-IN')}
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    <span>256-bit SSL</span>
                  </div>
                </div>

                {/* Razorpay Badge */}
                <div className="flex justify-center">
                  <img
                    src="https://razorpay.com/build/browser/static/razorpay-logo.5cdb58df.svg"
                    alt="Razorpay"
                    className="h-6 opacity-60 dark:invert"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-border/50 sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Preview */}
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Tag className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                    {product.category && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.category}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Features */}
                {features.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Includes:</h4>
                    <ul className="space-y-2">
                      {features.slice(0, 4).map((feature: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  {product.original_price && product.original_price > product.price && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Original Price</span>
                      <span className="line-through text-muted-foreground">
                        ₹{product.original_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount ({discount}%)</span>
                      <span className="text-green-600">
                        -₹{(product.original_price! - product.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{product.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
