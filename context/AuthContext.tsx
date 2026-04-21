'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: any
  loading: boolean
  error: string | null
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ needsConfirmation: boolean }>
  signInWithEmail: (email: string, pass: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)  // Starts true until first auth check
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Listen for all auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await syncUser(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const syncUser = async (supabaseUser: User) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single()

      setUser({
        uid: supabaseUser.id,
        email: supabaseUser.email,
        name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        role: profile?.role || 'user',
        avatar: supabaseUser.user_metadata?.avatar_url || null,
        ...profile,
      })
    } catch {
      // Profile row doesn't exist yet — use basic metadata
      setUser({
        uid: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
        role: 'user',
        avatar: supabaseUser.user_metadata?.avatar_url || null,
      })
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => setError(null)

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setError(null)
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { data: { full_name: name } },
    })
    if (err) { setError(err.message); throw err }

    // If session returned immediately, email confirmation is disabled → create profile
    if (data.user && data.session) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: name,
        email,
        role: 'user',
      })
      return { needsConfirmation: false }
    }

    // No session → confirmation email required
    return { needsConfirmation: true }
  }

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null)
    const { error: err } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (err) { setError(err.message); throw err }
    // onAuthStateChange will fire and set the user automatically
  }

  const signInWithGoogle = async () => {
    setError(null)
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    })
    if (err) { setError(err.message); throw err }
  }

  const logout = async () => {
    setUser(null)
    setLoading(false)
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, signUpWithEmail, signInWithEmail, signInWithGoogle, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
