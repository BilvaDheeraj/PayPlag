'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/shared/Header'
import toast, { Toaster } from 'react-hot-toast'

export default function SignUpPage() {
  const { signUpWithEmail, signInWithGoogle, error, clearError, loading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.')
      return
    }
    setSubmitting(true)
    clearError()
    try {
      const { needsConfirmation } = await signUpWithEmail(email, password, name)
      if (needsConfirmation) {
        // Supabase email confirmation required
        setConfirmationSent(true)
        toast.success('Check your email to confirm your account!')
      } else {
        // Email confirmation disabled — logged in immediately
        toast.success('Account created! Welcome aboard 🎉')
        router.push('/dashboard')
      }
    } catch (err: any) {
      toast.error(err.message || 'Sign up failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    clearError()
    try {
      await signInWithGoogle()
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed.')
    }
  }

  return (
    <>
      <Header />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' } }} />
      <main style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '6rem 1.5rem 2rem',
        background: 'var(--gradient-hero)',
        position: 'relative',
      }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              width: '100%', maxWidth: 440,
              boxShadow: 'var(--shadow-float)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
              background: 'linear-gradient(90deg, transparent, var(--accent-secondary), transparent)',
            }} />

            <AnimatePresence mode="wait">
              {confirmationSent ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ textAlign: 'center', padding: '1rem 0' }}
                >
                  <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>📬</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                    Check your email!
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.<br />
                    Click it to activate your account, then sign in.
                  </p>
                  <Link href="/login">
                    <button className="btn-primary btn-full">
                      Go to Sign In →
                    </button>
                  </Link>
                  <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Didn't receive it? Check spam or{' '}
                    <button
                      onClick={() => setConfirmationSent(false)}
                      style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      try again
                    </button>
                  </p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                      Create Account
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Start checking for free — ₹19 only when you check
                    </p>
                  </div>

                  {/* Google */}
                  <button
                    id="google-signup-btn"
                    onClick={handleGoogle}
                    style={{
                      width: '100%', padding: '0.875rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontWeight: 600, fontSize: '0.9rem',
                      cursor: 'pointer', marginBottom: '1.5rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem',
                    color: 'var(--text-muted)', fontSize: '0.8rem',
                  }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                    or register with email
                    <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                  </div>

                  <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                        Full Name
                      </label>
                      <input id="signup-name" type="text" required className="input" placeholder="John Doe"
                        value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                        Email
                      </label>
                      <input id="signup-email" type="email" required className="input" placeholder="you@example.com"
                        value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                        Password <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(min 8 chars)</span>
                      </label>
                      <input id="signup-password" type="password" required minLength={8} className="input" placeholder="••••••••"
                        value={password} onChange={e => setPassword(e.target.value)} />
                    </div>

                    {error && (
                      <div style={{
                        padding: '0.75rem', background: 'rgba(255,68,102,0.1)',
                        border: '1px solid rgba(255,68,102,0.3)',
                        borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--accent-danger)',
                      }}>
                        {error}
                      </div>
                    )}

                    <button id="signup-submit-btn" type="submit" className="btn-primary btn-full" disabled={submitting || loading}>
                      {submitting ? <span className="loading-spinner" /> : 'Create Account →'}
                    </button>

                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                      By signing up, you agree to our{' '}
                      <Link href="/terms" style={{ color: 'var(--accent-primary)' }}>Terms</Link>{' & '}
                      <Link href="/privacy" style={{ color: 'var(--accent-primary)' }}>Privacy Policy</Link>.
                    </p>
                  </form>

                  <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Sign in</Link>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </>
  )
}
