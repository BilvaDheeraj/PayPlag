import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Standard client for browser-side auth and public data
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
