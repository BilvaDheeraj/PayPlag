'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/shared/Header'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

const tools = [
  {
    id: 'plagiarism', icon: '🔍', title: 'Plagiarism Checker',
    desc: 'Check for copied content across 50B+ web pages.',
    href: '/plagiarism', color: 'var(--accent-primary)',
  },
  {
    id: 'ai-detector', icon: '🤖', title: 'AI Detector',
    desc: 'Detect AI-generated content with sentence-level accuracy.',
    href: '/ai-detector', color: 'var(--accent-secondary)',
  },
  {
    id: 'paraphraser', icon: '✍️', title: 'AI Paraphraser',
    desc: 'Rewrite text fluently while preserving meaning.',
    href: '/paraphraser', color: 'var(--accent-success)',
  },
]

interface CheckResult {
  id: string
  tool_type: string
  created_at: string
  status: string
  score?: number
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [recentChecks, setRecentChecks] = useState<CheckResult[]>([])
  const [loadingChecks, setLoadingChecks] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (user) fetchRecentChecks()
  }, [user])

  const fetchRecentChecks = async () => {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setRecentChecks(data || [])
    } catch (err) {
      console.error('Error fetching checks:', err)
    } finally {
      setLoadingChecks(false)
    }
  }

  if (loading || !user) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)',
      }}>
        <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    )
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <main style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        paddingTop: '90px',
        paddingBottom: '4rem',
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '3rem' }}
          >
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              marginBottom: '0.5rem',
            }}>
              {greeting()},{' '}
              <span className="gradient-text">
                {user.name?.split(' ')[0] || 'there'}
              </span>{' '}
              👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Choose a tool below to get started — ₹19 per check.
            </p>
          </motion.div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}>
            {tools.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={tool.href} style={{ textDecoration: 'none', display: 'block' }}>
                  <div
                    style={{
                      padding: '2rem',
                      background: 'var(--gradient-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{tool.icon}</div>
                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.3rem',
                      color: tool.color,
                      marginBottom: '0.5rem',
                    }}>
                      {tool.title}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {tool.desc}
                    </p>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.375rem 0.875rem',
                      background: `${tool.color}15`,
                      border: `1px solid ${tool.color}30`,
                      borderRadius: 'var(--radius-full)',
                      color: tool.color, fontWeight: 700,
                      fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                    }}>
                      ₹19 · Run Check →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '1rem',
            }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem' }}>
                Recent Checks
              </h2>
            </div>

            <div style={{
              background: 'var(--gradient-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}>
              {loadingChecks ? (
                <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>
              ) : recentChecks.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center' }}>No checks yet.</div>
              ) : (
                recentChecks.map((check, i) => {
                  const tool = tools.find(t => t.id === check.tool_type.replace('_', '-'))
                  return (
                    <div
                      key={check.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '1rem 1.5rem',
                        borderBottom: i < recentChecks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{tool?.icon || '📄'}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{tool?.title || check.tool_type}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(check.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(0,255,156,0.1)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-success)',
                      }}>
                        {check.status}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}
