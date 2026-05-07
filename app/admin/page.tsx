import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin-dashboard'
import type { Order, Product } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage products and orders',
}

// Define admin emails - in production, use proper role-based access
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(',') || []

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    redirect('/')
  }

  // Get all products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  // Get all orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*, product:products(*)')
    .order('created_at', { ascending: false })
    .limit(50)

  // Calculate stats
  const totalRevenue = orders
    ?.filter(o => o.status === 'paid')
    .reduce((sum, o) => sum + Number(o.amount), 0) || 0

  const totalOrders = orders?.filter(o => o.status === 'paid').length || 0

  return (
    <AdminDashboard 
      products={(products as Product[]) || []}
      orders={(orders as Order[]) || []}
      stats={{
        totalRevenue,
        totalOrders,
        totalProducts: products?.length || 0,
      }}
    />
  )
}
