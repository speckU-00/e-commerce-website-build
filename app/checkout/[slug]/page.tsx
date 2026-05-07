import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CheckoutForm } from '@/components/checkout-form'
import type { Product } from '@/types'
import type { Metadata } from 'next'

interface CheckoutPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('name')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  return {
    title: product ? `Checkout - ${product.name}` : 'Checkout',
    description: 'Complete your purchase securely with Razorpay',
  }
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) {
    notFound()
  }

  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <CheckoutForm 
      product={product as Product} 
      userEmail={user?.email}
      userMobile={user?.user_metadata?.mobile_number}
    />
  )
}
