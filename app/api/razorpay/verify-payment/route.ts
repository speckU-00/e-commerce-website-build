import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      dbOrderId 
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update order status
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', dbOrderId)
      .select('*, product:products(*)')
      .single()

    if (updateError) {
      console.error('Order update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    // Here you would typically:
    // 1. Send confirmation email with download link
    // 2. Generate download token/URL
    // 3. Send WhatsApp notification if mobile provided

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        productName: order.product?.name,
        amount: order.amount,
        email: order.email,
      },
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    )
  }
}
