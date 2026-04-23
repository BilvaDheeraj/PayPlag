import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-server'
import { consumeToken } from '@/lib/token-utils'

export async function POST(request: NextRequest) {
  try {
    const { text, mode, checkToken } = await request.json()
    if (!text || !checkToken) return NextResponse.json({ error: 'Missing text or token' }, { status: 400 })

    const tokenData = await consumeToken(checkToken, 'paraphraser')

    const res = await fetch(`${process.env.INTERNAL_API_URL}/api/paraphrase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mode: mode || 'standard' }),
      signal: AbortSignal.timeout(60000),
    })

    if (!res.ok) throw new Error(`AI backend error: ${await res.text()}`)
    const result = await res.json()

    // Save result to Supabase
    await getSupabaseAdmin().from('results').insert({
      user_id: tokenData.user_id,
      tool_type: 'paraphraser',
      status: 'completed',
      score: result.similarity,
      result_json: result,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('[paraphrase-api]', error)
    return NextResponse.json({ error: error.message || 'Paraphrase failed' }, { status: 500 })
  }
}
