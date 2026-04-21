'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { href: '/#tools', label: 'Tools' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
]

export function Header() {
  const { user, logout, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isDashboard = pathname.startsWith('/dashboard') ||
    pathname.startsWith('/plagiarism') ||
    pathname.startsWith('/ai-detector') ||
    pathname.startsWith('/paraphraser') ||
    pathname.startsWith('/history') ||
    pathname.startsWith('/settings')

  const dashLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/history', label: 'History' },
    { href: '/settings', label: 'Settings' },
  ]

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 1000,
      padding: '0 2rem',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32,
          background: 'var(--gradient-accent)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', fontWeight: 700, color: '#000',
          fontFamily: 'var(--font-mono)',
        }}>
          P
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.25rem',
          color: 'var(--text-primary)',
        }}>
          Pay<span style={{ color: 'var(--accent-primary)' }}>&</span>Plag
        </span>
      </Link>

      {/* Nav Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
        {(isDashboard ? dashLinks : navLinks).map(link => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: pathname === link.href ? 'var(--accent-primary)' : 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = pathname === link.href ? 'var(--accent-primary)' : 'var(--text-secondary)')}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ThemeToggle />

        {!loading && (
          <>
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem', fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--gradient-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 700, color: '#000',
                  }}>
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  {user.name?.split(' ')[0] || 'Account'}
                  <span>▾</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        minWidth: '180px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-float)',
                        zIndex: 100,
                      }}
                    >
                      {[
                        { href: '/dashboard', label: '📊 Dashboard' },
                        { href: '/history', label: '📄 History' },
                        { href: '/settings', label: '⚙️ Settings' },
                      ].map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setUserMenuOpen(false)}
                          style={{
                            display: 'block',
                            padding: '0.75rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--text-secondary)',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'var(--bg-tertiary)'
                            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'transparent'
                            ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid var(--border-subtle)' }} />
                      <button
                        onClick={async () => { setUserMenuOpen(false); await logout(); router.push('/') }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '0.75rem 1rem',
                          fontSize: '0.875rem',
                          color: 'var(--accent-danger)',
                          cursor: 'pointer',
                          background: 'none', border: 'none',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-tertiary)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                      >
                        🚪 Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/login" className="btn-ghost btn-sm">Sign In</Link>
                <Link href="/signup" className="btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </header>
  )
}
