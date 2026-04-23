import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { consumeToken } from '@/lib/token-utils'

export async function POST(request: NextRequest) {
  try {
    const { text, checkToken } = await request.json()
    if (!text || !checkToken) return NextResponse.json({ error: 'Missing text or token' }, { status: 400 })

    const tokenData = await consumeToken(checkToken, 'ai_detector')

    const res = await fetch(`${process.env.INTERNAL_API_URL}/api/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(60000),
    })

    if (!res.ok) throw new Error(`AI backend error: ${await res.text()}`)
    const result = await res.json()

    // Save result to Supabase
    await getSupabaseAdmin().from('results').insert({
      user_id: tokenData.user_id,
      tool_type: 'ai_detector',
      status: 'completed',
      score: result.overallScore,
      result_json: result,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[ai-detect-api]', error)
    return NextResponse.json({ error: error.message || 'Detection failed' }, { status: 500 })
  }
}
