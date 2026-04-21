'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/shared/Header'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=/settings')
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.uid, full_name: name, email: user.email, role: user.role || 'user' })
      if (error) throw error
      toast.success('Profile updated!')
    } catch (err: any) {
      toast.error(err.message || 'Update failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) throw error
      toast.success('Password reset email sent!')
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email.')
    }
  }

  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '90px', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '0.5rem' }}>
              ⚙️ Settings
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Manage your account details and preferences.
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--gradient-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 700, color: '#000',
                  fontFamily: 'var(--font-mono)',
                }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name || 'User'}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{user.email}</div>
                  <div style={{
                    display: 'inline-block', marginTop: '0.25rem',
                    padding: '0.15rem 0.5rem',
                    background: 'rgba(0,229,255,0.1)',
                    border: '1px solid rgba(0,229,255,0.25)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.7rem', fontWeight: 600, color: 'var(--accent-primary)',
                    textTransform: 'capitalize',
                  }}>
                    {user.role || 'user'}
                  </div>
                </div>
              </div>

              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
                Profile Information
              </h2>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Full Name
                  </label>
                  <input
                    id="settings-name"
                    type="text"
                    className="input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input"
                    value={email}
                    disabled
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Email cannot be changed here.</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button id="save-profile-btn" type="submit" className="btn-primary" disabled={saving}>
                    {saving ? <><span className="loading-spinner" /> Saving...</> : 'Save Changes →'}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Security Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                Security
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                We'll send a password reset link to your email.
              </p>
              <button
                id="change-password-btn"
                className="btn-ghost"
                onClick={handleChangePassword}
                style={{ fontSize: '0.875rem' }}
              >
                🔑 Send Password Reset Email
              </button>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: 'rgba(255,68,102,0.04)',
                border: '1px solid rgba(255,68,102,0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--accent-danger)' }}>
                Danger Zone
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                Once you delete your account, all data is permanently removed.
              </p>
              <button
                className="btn-ghost btn-sm"
                style={{ borderColor: 'rgba(255,68,102,0.4)', color: 'var(--accent-danger)' }}
                onClick={() => toast.error('Please contact support to delete your account.')}
              >
                🗑️ Delete Account
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  )
}
