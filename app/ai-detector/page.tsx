'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/shared/Header'
import { PaymentModal } from '@/components/payment/PaymentModal'
import { ScoreRing } from '@/components/tools/ScoreRing'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface SentenceResult {
  sentence: string
  score: number
  label: 'AI' | 'Human'
}

interface AIDetectResult {
  overallScore: number
  label: 'AI Generated' | 'Likely AI' | 'Mixed' | 'Likely Human' | 'Human Written'
  sentences: SentenceResult[]
  wordCount: number
}

export default function AIDetectorPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [text, setText] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [result, setResult] = useState<AIDetectResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setText(val)
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0)
  }

  const handleCheck = () => {
    if (!user) { router.push('/login?redirect=/ai-detector'); return }
    if (wordCount < 20) { toast.error('Please enter at least 20 words.'); return }
    if (wordCount > 10000) { toast.error('Maximum 10,000 words allowed.'); return }
    setShowPayment(true)
  }

  const onPaymentSuccess = (token: string) => {
    setShowPayment(false)
    runCheck(token)
  }

  const runCheck = async (token: string) => {
    setChecking(true)
    setResult(null)
    try {
      const res = await fetch('/api/tools/ai-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, checkToken: token }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult(data)
      toast.success('AI detection complete!')
    } catch (err: any) {
      toast.error(err.message || 'Detection failed. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  const getLabelColor = (label: string) => {
    if (label.includes('AI')) return 'var(--accent-danger)'
    if (label.includes('Mixed')) return 'var(--accent-secondary)'
    return 'var(--accent-success)'
  }

  const getScoreColor = (score: number) => {
    if (score > 70) return 'var(--accent-danger)'
    if (score > 40) return 'var(--accent-secondary)'
    return 'var(--accent-success)'
  }

  return (
    <>
      <Header />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' } }} />

      {showPayment && (
        <PaymentModal
          toolType="ai-detect"
          toolName="AI Detector"
          onSuccess={onPaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '90px', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>🤖</span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                AI Content Detector
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Detect AI-generated content with sentence-level accuracy using our advanced model.
              <strong style={{ color: 'var(--accent-secondary)' }}> ₹19 per check.</strong>
            </p>
          </motion.div>

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Input Text
              </label>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: wordCount > 9000 ? 'var(--accent-danger)' : 'var(--text-muted)' }}>
                {wordCount.toLocaleString()} / 10,000 words
              </span>
            </div>
            <textarea
              id="ai-detect-input"
              className="input textarea"
              placeholder="Paste text to detect if it was written by AI..."
              value={text}
              onChange={handleTextChange}
              style={{ minHeight: 260, fontSize: '0.9rem', lineHeight: 1.7 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.75rem' }}>
              {text && (
                <button className="btn-ghost btn-sm" onClick={() => { setText(''); setWordCount(0); setResult(null) }}>
                  Clear
                </button>
              )}
              <button
                id="ai-detect-btn"
                className="btn-primary"
                onClick={handleCheck}
                disabled={checking || wordCount < 20}
                style={{ minWidth: 160, background: 'linear-gradient(135deg, #FFB347, #FF6B6B)' }}
              >
                {checking ? (
                  <><span className="loading-spinner" /> Analyzing...</>
                ) : (
                  <>Detect AI for ₹19 →</>
                )}
              </button>
            </div>
          </motion.div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Score overview */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: `1px solid ${getLabelColor(result.label)}30`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  marginBottom: '1.5rem',
                  display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap',
                }}>
                  <ScoreRing
                    score={result.overallScore}
                    label="AI Probability"
                    color={getScoreColor(result.overallScore)}
                    size={140}
                  />
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verdict</div>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 1.25rem',
                        background: `${getLabelColor(result.label)}15`,
                        border: `1px solid ${getLabelColor(result.label)}40`,
                        borderRadius: 'var(--radius-full)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: getLabelColor(result.label),
                      }}>
                        {result.label === 'AI Generated' || result.label === 'Likely AI' ? '🤖' : result.label === 'Mixed' ? '⚡' : '✍️'}
                        {result.label}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Words Analyzed</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.25rem' }}>{result.wordCount.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sentence-level breakdown */}
                {result.sentences && result.sentences.length > 0 && (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                  }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                        Sentence Analysis ({result.sentences.length} sentences)
                      </h2>
                    </div>
                    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {result.sentences.map((s, i) => (
                        <div key={i} style={{
                          padding: '0.875rem 1rem',
                          background: s.label === 'AI'
                            ? 'rgba(255,68,102,0.06)'
                            : 'rgba(0,255,156,0.04)',
                          border: `1px solid ${s.label === 'AI' ? 'rgba(255,68,102,0.2)' : 'rgba(0,255,156,0.15)'}`,
                          borderLeft: `3px solid ${s.label === 'AI' ? 'var(--accent-danger)' : 'var(--accent-success)'}`,
                          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
                        }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
                            {s.sentence}
                          </span>
                          <div style={{
                            flexShrink: 0,
                            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem',
                          }}>
                            <span style={{
                              padding: '0.15rem 0.5rem',
                              background: s.label === 'AI' ? 'rgba(255,68,102,0.15)' : 'rgba(0,255,156,0.15)',
                              border: `1px solid ${s.label === 'AI' ? 'rgba(255,68,102,0.35)' : 'rgba(0,255,156,0.35)'}`,
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.7rem', fontWeight: 700,
                              color: s.label === 'AI' ? 'var(--accent-danger)' : 'var(--accent-success)',
                              fontFamily: 'var(--font-mono)',
                            }}>
                              {s.label}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                              {s.score}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!result && !checking && (
            <div className="result-area">
              <div style={{ fontSize: '3rem' }}>🤖</div>
              <p>Your AI detection report will appear here</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter text above and pay ₹19 to analyze</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
