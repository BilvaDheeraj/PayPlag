import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { getSupabaseAdmin } from '@/lib/supabase'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { toolType, userId } = body

    if (!['plagiarism', 'ai_detector', 'paraphraser'].includes(toolType)) {
      return NextResponse.json({ error: 'Invalid tool type' }, { status: 400 })
    }

    const PRICE_PAISE = 1900 // ₹19 in paise

    const order = await razorpay.orders.create({
      amount: PRICE_PAISE,
      currency: 'INR',
      receipt: `pp_${Date.now()}`,
      notes: { toolType, userId },
    })

    // Store pending order in Supabase
    const { error: dbError } = await getSupabaseAdmin()
      .from('orders')
      .insert({
        id: order.id,
        user_id: userId || null,
        tool_type: toolType,
        amount: PRICE_PAISE,
        currency: 'INR',
        status: 'pending',
        created_at: new Date().toISOString(),
      })

    if (dbError) throw dbError

    return NextResponse.json({
      orderId: order.id,
      amount: PRICE_PAISE,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error('[create-order]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
