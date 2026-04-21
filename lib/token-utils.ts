import { getSupabaseAdmin } from '@/lib/supabase'

export async function consumeToken(checkToken: string, expectedTool: string) {
  const { data: tokenData, error } = await getSupabaseAdmin()
    .from('tokens')
    .select('*')
    .eq('token', checkToken)
    .single()

  if (error || !tokenData) {
    throw new Error('Invalid check token.')
  }

  if (tokenData.used) {
    throw new Error('This check token has already been used.')
  }

  if (tokenData.tool_type !== expectedTool) {
    throw new Error('Token is not valid for this tool.')
  }

  if (new Date(tokenData.expires_at) < new Date()) {
    throw new Error('Check token has expired.')
  }

  // Mark token as used
  const { error: updateError } = await getSupabaseAdmin()
    .from('tokens')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('token', checkToken)

  if (updateError) throw updateError

  return tokenData
}
