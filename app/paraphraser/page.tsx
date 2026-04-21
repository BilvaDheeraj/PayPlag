'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Header } from '@/components/shared/Header'
import { PaymentModal } from '@/components/payment/PaymentModal'
import { motion, AnimatePresence } from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const MODES = [
  { id: 'standard', label: 'Standard', desc: 'Natural rewrite' },
  { id: 'fluent', label: 'Fluent', desc: 'Smooth and clear' },
  { id: 'academic', label: 'Academic', desc: 'Formal tone' },
  { id: 'simple', label: 'Simple', desc: 'Easy to read' },
  { id: 'creative', label: 'Creative', desc: 'Expressive style' },
]

export default function ParaphraserPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [text, setText] = useState('')
  const [mode, setMode] = useState('standard')
  const [showPayment, setShowPayment] = useState(false)
  const [result, setResult] = useState<{ original: string; rewritten: string; similarity: number } | null>(null)
  const [paraphrasing, setParaphrasing] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setText(val)
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0)
  }

  const handleCheck = () => {
    if (!user) { router.push('/login?redirect=/paraphraser'); return }
    if (wordCount < 10) { toast.error('Please enter at least 10 words.'); return }
    setShowPayment(true)
  }

  const onPaymentSuccess = async (token: string) => {
    setShowPayment(false)
    setParaphrasing(true)
    setResult(null)
    try {
      const res = await fetch('/api/tools/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode, checkToken: token }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setResult(data)
      toast.success('Paraphrasing complete!')
    } catch (err: any) {
      toast.error(err.message || 'Paraphrasing failed.')
    } finally {
      setParaphrasing(false)
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.rewritten)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success('Copied to clipboard!')
    }
  }

  return (
    <>
      <Header />
      <Toaster position="top-right" toastOptions={{ style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' } }} />
      {showPayment && (
        <PaymentModal toolType="paraphraser" toolName="AI Paraphraser" onSuccess={onPaymentSuccess} onCancel={() => setShowPayment(false)} />
      )}
      <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingTop: '90px', paddingBottom: '4rem' }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '2rem' }}>✍️</span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
                AI Paraphraser
              </h1>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Rewrite in 5 modes while preserving original meaning.
              <strong style={{ color: 'var(--accent-success)' }}> ₹19 per paraphrase.</strong>
            </p>
          </motion.div>

          {/* Mode selector */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {MODES.map(m => (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${mode === m.id ? 'var(--accent-success)' : 'var(--border-default)'}`,
                background: mode === m.id ? 'rgba(0,255,156,0.1)' : 'var(--bg-tertiary)',
                color: mode === m.id ? 'var(--accent-success)' : 'var(--text-secondary)',
                fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {m.label}
                <span style={{ fontSize: '0.7rem', marginLeft: '0.3rem', opacity: 0.7 }}>· {m.desc}</span>
              </button>
            ))}
          </div>

          {/* Two-column input/output */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Input */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Original Text
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {wordCount} words
                </span>
              </div>
              <textarea id="paraphraser-input" className="input textarea" placeholder="Paste your text here..." value={text} onChange={handleTextChange} style={{ minHeight: 300, fontSize: '0.9rem', lineHeight: 1.7 }} />
            </div>

            {/* Output */}
            <div style={{ background: 'var(--bg-card)', border: `1px solid ${result ? 'rgba(0,255,156,0.3)' : 'var(--border-default)'}`, borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Paraphrased Text
                </label>
                {result && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {result.similarity}% preserved
                  </span>
                )}
              </div>
              <div style={{
                minHeight: 300, padding: '0.75rem', borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)',
                fontSize: '0.9rem', lineHeight: 1.7, color: result ? 'var(--text-primary)' : 'var(--text-muted)',
                fontStyle: result ? 'normal' : 'italic', whiteSpace: 'pre-wrap',
              }}>
                {paraphrasing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '100%' }}>
                    <span className="loading-spinner" />
                    Paraphrasing with AI...
                  </div>
                ) : result ? result.rewritten : 'Paraphrased text will appear here...'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            {result && (
              <button id="copy-result-btn" className="btn-secondary" onClick={handleCopy}>
                {copied ? '✓ Copied!' : '📋 Copy Result'}
              </button>
            )}
            <button
              id="paraphrase-btn"
              className="btn-primary"
              onClick={handleCheck}
              disabled={paraphrasing || wordCount < 10}
              style={{ background: 'linear-gradient(135deg, #00FF9C40, #00E5FF40)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)' }}
            >
              {paraphrasing ? <><span className="loading-spinner" /> Rewriting...</> : <>Paraphrase for ₹19 →</>}
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
