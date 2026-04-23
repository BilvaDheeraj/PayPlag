import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Update order status in Supabase
    const { data: orderData, error: fetchError } = await getSupabaseAdmin()
      .from('orders')
      .select('*')
      .eq('id', razorpay_order_id)
      .single()

    if (fetchError || !orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const { error: updateError } = await getSupabaseAdmin()
      .from('orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', razorpay_order_id)

    if (updateError) throw updateError

    // Create single-use check token
    const checkToken = uuidv4()
    const { error: tokenError } = await getSupabaseAdmin()
      .from('tokens')
      .insert({
        token: checkToken,
        order_id: razorpay_order_id,
        user_id: orderData.user_id,
        tool_type: orderData.tool_type,
        used: false,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      })

    if (tokenError) throw tokenError

    return NextResponse.json({ checkToken, toolType: orderData.tool_type })
  } catch (error: any) {
    console.error('[verify-payment]', error)
    return NextResponse.json(
      { error: error.message || 'Verification failed' },
      { status: 500 }
    )
  }
}
