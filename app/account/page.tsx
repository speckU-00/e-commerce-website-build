import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AccountDashboard } from '@/components/account-dashboard'
import type { Order } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account',
  description: 'View your purchases and account settings',
}

export default async function AccountPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }

  // Get user's orders
  const { data: orders } = await supabase
    .from('orders')
    .select('*, product:products(*)')
    .or(`user_id.eq.${user.id},email.eq.${user.email}`)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })

  return (
    <AccountDashboard 
      user={user} 
      orders={(orders as Order[]) || []} 
    />
  )
}
