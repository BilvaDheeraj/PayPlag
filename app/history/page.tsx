'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/shared/Header'
import { supabase } from '@/lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

interface CheckResult {
  id: string
  tool_type: string
  created_at: string
  status: string
  score?: number
  result_json?: any
}

const toolMeta: Record<string, { icon: string; label: string; color: string }> = {
  plagiarism: { icon: '🔍', label: 'Plagiarism Check', color: 'var(--accent-primary)' },
  'ai-detect': { icon: '🤖', label: 'AI Detector', color: 'var(--accent-secondary)' },
  ai_detector: { icon: '🤖', label: 'AI Detector', color: 'var(--accent-secondary)' },
  paraphraser: { icon: '✍️', label: 'AI Paraphraser', color: 'var(--accent-success)' },
}

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [results, setResults] = useState<CheckResult[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/login?redirect=/history')
  }, [user, loading, router])

  useEffect(() => {
    if (user) fetchHistory()
  }, [user])

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      setResults(data || [])
    } catch (e) {
      toast.error('Could not load history.')
    } finally {
      setFetching(false)
    }
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      </div>
    )
  }

  return (
    <>
      <Header />
      <Toaster position="top-right" />
      <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '90px', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '0.5rem' }}>
              📄 Check History
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              All your past plagiarism, AI detection, and paraphrasing checks.
            </p>
          </motion.div>

          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}>
            {fetching ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="loading-spinner" style={{ width: 32, height: 32, borderWidth: 2, margin: '0 auto' }} />
              </div>
            ) : results.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No checks yet. Run your first check!</p>
              </div>
            ) : (
              <>
                {/* Table Header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  padding: '0.875rem 1.5rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  fontSize: '0.75rem', fontWeight: 600,
                  color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  <span>Tool</span>
                  <span>Date</span>
                  <span>Score</span>
                  <span>Status</span>
                </div>
                {results.map((r, i) => {
                  const meta = toolMeta[r.tool_type] || { icon: '📄', label: r.tool_type, color: 'var(--text-primary)' }
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      style={{
                        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        padding: '1rem 1.5rem', alignItems: 'center',
                        borderBottom: i < results.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'var(--bg-tertiary)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{meta.icon}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: meta.color }}>{meta.label}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: meta.color }}>
                        {r.score != null ? `${r.score}%` : '—'}
                      </span>
                      <span style={{
                        display: 'inline-block', padding: '0.2rem 0.625rem',
                        background: r.status === 'completed' ? 'rgba(0,255,156,0.1)' : 'rgba(255,179,71,0.1)',
                        border: `1px solid ${r.status === 'completed' ? 'rgba(0,255,156,0.3)' : 'rgba(255,179,71,0.3)'}`,
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.7rem', fontWeight: 600,
                        color: r.status === 'completed' ? 'var(--accent-success)' : 'var(--accent-secondary)',
                        textTransform: 'capitalize',
                      }}>
                        {r.status}
                      </span>
                    </motion.div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
