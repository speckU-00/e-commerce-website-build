import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  CheckCircle, 
  Download, 
  Mail, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

interface ConfirmationPageProps {
  params: Promise<{ orderId: string }>
}

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been confirmed. Thank you for your purchase!',
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, product:products(*)')
    .eq('id', orderId)
    .eq('status', 'paid')
    .single()

  if (!order) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight">
          Thank You for Your Purchase!
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your order has been confirmed and is being processed.
        </p>

        {/* Order Details Card */}
        <Card className="mt-8 text-left border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Order ID:</span>
              <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                {order.id.slice(0, 8).toUpperCase()}
              </code>
            </div>

            <Separator />

            {/* Product Info */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{order.product?.name}</h3>
                <p className="text-sm text-muted-foreground">{order.product?.category}</p>
              </div>
              <div className="text-right">
                <span className="font-semibold">
                  ₹{Number(order.amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <Separator />

            {/* Email Notification */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Download link sent to:</p>
                <p className="text-muted-foreground">{order.email}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Check your inbox (and spam folder) for the download instructions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/products">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/account">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2">
              <Download className="h-4 w-4" />
              View My Purchases
            </Button>
          </Link>
        </div>

        {/* Support Info */}
        <p className="mt-8 text-sm text-muted-foreground">
          Having issues? Contact us at{' '}
          <a href="mailto:support@abudigital.store" className="text-primary hover:underline">
            support@abudigital.store
          </a>
        </p>
      </div>
    </div>
  )
}
