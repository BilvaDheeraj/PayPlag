'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/shared/Header'
import { PaymentModal } from '@/components/payment/PaymentModal'
import { ScoreRing } from '@/components/tools/ScoreRing'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface PlagMatch {
  sentence: string
  sources: { url: string; title: string; similarity: number }[]
}

interface PlagResult {
  overallScore: number
  wordCount: number
  plagiarizedWords: number
  uniqueScore: number
  matches: PlagMatch[]
}

export default function PlagiarismPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [text, setText] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [checkToken, setCheckToken] = useState<string | null>(null)
  const [result, setResult] = useState<PlagResult | null>(null)
  const [checking, setChecking] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setText(val)
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0)
  }

  const handleCheck = () => {
    if (!user) { router.push('/login?redirect=/plagiarism'); return }
    if (wordCount < 20) { toast.error('Please enter at least 20 words.'); return }
    if (wordCount > 10000) { toast.error('Maximum 10,000 words allowed.'); return }
    setShowPayment(true)
  }

  const onPaymentSuccess = (token: string) => {
    setCheckToken(token)
    setShowPayment(false)
    runCheck(token)
  }

  const runCheck = async (token: string) => {
    setChecking(true)
    setResult(null)
    try {
      const res = await fetch('/api/tools/plagiarism', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, checkToken: token }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult(data)
      toast.success('Plagiarism check complete!')
    } catch (err: any) {
      toast.error(err.message || 'Check failed. Please try again.')
    } finally {
      setChecking(false)
    }
  }

  return (
    <>
      <Header />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' } }} />

      {showPayment && (
        <PaymentModal
          toolType="plagiarism"
          toolName="Plagiarism Check"
          onSuccess={onPaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}

      <main style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        paddingTop: '90px', paddingBottom: '4rem',
      }}>
        <div className="container" style={{ maxWidth: 900 }}>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>🔍</span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                Plagiarism Checker
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Scan your text against 50B+ web pages. Get source links and similarity percentages.
              <strong style={{ color: 'var(--accent-primary)' }}> ₹19 per check.</strong>
            </p>
          </motion.div>

          {/* Input area */}
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
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '0.75rem',
            }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Input Text
              </label>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                color: wordCount > 9000 ? 'var(--accent-danger)' : 'var(--text-muted)',
              }}>
                {wordCount.toLocaleString()} / 10,000 words
              </span>
            </div>
            <textarea
              id="plagiarism-input"
              className="input textarea"
              placeholder="Paste or type your text here (minimum 20 words)..."
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
                id="plagiarism-check-btn"
                className="btn-primary"
                onClick={handleCheck}
                disabled={checking || wordCount < 20}
                style={{ minWidth: 140 }}
              >
                {checking ? (
                  <><span className="loading-spinner" /> Scanning...</>
                ) : (
                  <>Check for ₹19 →</>
                )}
              </button>
            </div>
          </motion.div>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {/* Score overview */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem',
                  marginBottom: '1.5rem',
                  display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap',
                }}>
                  <ScoreRing
                    score={result.overallScore}
                    label="Plagiarism %"
                    color={result.overallScore > 30 ? 'var(--accent-danger)' : 'var(--accent-success)'}
                    size={140}
                  />
                  <ScoreRing
                    score={result.uniqueScore}
                    label="Unique %"
                    color="var(--accent-success)"
                    size={140}
                  />
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Total Words</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-primary)' }}>{result.wordCount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Plagiarized Words</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--accent-danger)' }}>{result.plagiarizedWords.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Matches */}
                {result.matches.length > 0 && (
                  <div style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                  }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                        Matched Sources ({result.matches.length})
                      </h2>
                    </div>
                    {result.matches.map((match, i) => (
                      <div key={i} style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: i < result.matches.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      }}>
                        <div style={{
                          padding: '0.625rem 0.875rem',
                          background: 'rgba(255,68,102,0.08)',
                          borderLeft: '3px solid var(--accent-danger)',
                          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                          fontSize: '0.875rem',
                          color: 'var(--text-secondary)',
                          fontStyle: 'italic',
                          marginBottom: '0.75rem',
                          lineHeight: 1.5,
                        }}>
                          &ldquo;{match.sentence}&rdquo;
                        </div>
                        {match.sources.map((s, j) => (
                          <div key={j} style={{
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            marginTop: '0.5rem', paddingLeft: '0.25rem',
                          }}>
                            <span style={{
                              padding: '0.2rem 0.625rem',
                              background: 'rgba(255,68,102,0.12)',
                              border: '1px solid rgba(255,68,102,0.3)',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem', fontWeight: 700,
                              color: 'var(--accent-danger)',
                              fontFamily: 'var(--font-mono)',
                              flexShrink: 0,
                            }}>
                              {s.similarity}%
                            </span>
                            <a href={s.url} target="_blank" rel="noopener noreferrer"
                              style={{
                                fontSize: '0.8rem', color: 'var(--accent-primary)',
                                textDecoration: 'none', overflow: 'hidden',
                                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              }}>
                              {s.title || s.url}
                            </a>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state */}
          {!result && !checking && (
            <div className="result-area">
              <div style={{ fontSize: '3rem' }}>🔍</div>
              <p>Your plagiarism report will appear here</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter text above and pay ₹19 to run a check</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
