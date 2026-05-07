export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  short_description: string | null
  price: number
  original_price: number | null
  image_url: string | null
  category: string | null
  features: string[]
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string | null
  product_id: string | null
  email: string
  mobile_number: string | null
  amount: number
  currency: string
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  razorpay_signature: string | null
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  download_url: string | null
  download_count: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface Profile {
  id: string
  email: string | null
  mobile_number: string | null
  created_at: string
}

export interface RazorpayOrder {
  id: string
  entity: string
  amount: number
  amount_paid: number
  amount_due: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}
