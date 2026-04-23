import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Create/update profile after OAuth or email confirmation
      const name = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User'
      
      // Use admin client or standard client to upsert profile
      // Standard client should work if RLS allows or if we just want to ensure it exists
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: name,
        email: data.user.email,
        role: 'user',
      })
      
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error('Auth callback error:', error)
    }
  } else {
    console.warn('No code provided in auth callback')
  }

  // Error: redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}

