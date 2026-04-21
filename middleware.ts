import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supabase browser client stores sessions in localStorage, NOT cookies.
// Server-side middleware cannot read localStorage, so we cannot block routes here.
// Each protected page handles its own auth guard via useAuth() hook client-side.
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
