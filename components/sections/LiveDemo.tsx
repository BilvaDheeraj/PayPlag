'use client'
import { useState, useEffect, useRef } from 'react'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { ScoreRing } from '@/components/tools/ScoreRing'
import Link from 'next/link'

const demoText = [
  { text: 'The increasing use of AI in education has raised serious concerns.', ai: true },
  { text: 'Students must develop critical thinking skills through original work.', ai: false },
  { text: 'Artificial intelligence tools can generate human-like text instantly.', ai: true },
  { text: 'Academic integrity remains the foundation of quality education.', ai: false },
]

export function LiveDemo() {
  const [scanning, setScanning] = useState(false)
  const [done, setDone] = useState(false)
  const [score, setScore] = useState(0)
  const [highlightedIdx, setHighlightedIdx] = useState(-1)
  const [started, setStarted] = useState(false)
  const [ref, setRef] = useState<Element | null>(null)

  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        setStarted(true)
        runDemo()
      }
    }, { threshold: 0.4 })
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref, started])

  const runDemo = () => {
    setScanning(true)
    setScore(0)
    setHighlightedIdx(-1)
    setDone(false)

    let idx = 0
    const interval = setInterval(() => {
      setHighlightedIdx(idx)
      setScore(prev => Math.min(prev + 18, 78))
      idx++
      if (idx >= demoText.length) {
        clearInterval(interval)
        setTimeout(() => {
          setScanning(false)
          setDone(true)
        }, 800)
      }
    }, 900)
  }

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <RevealOnScroll>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              Live Demo
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              See It In <span className="gradient-text">Action</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div ref={el => setRef(el)} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-float)',
          maxWidth: 860, margin: '0 auto',
        }}>
          {/* Browser chrome */}
          <div style={{
            background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '0.875rem 1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
              <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
            ))}
            <div style={{
              flex: 1, marginLeft: '0.5rem',
              background: 'var(--bg-primary)',
              borderRadius: 6, padding: '0.25rem 0.75rem',
              fontSize: '0.75rem', color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              payplag.in/ai-detector
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {/* Left: text scan */}
            <div style={{
              padding: '2rem',
              borderRight: '1px solid var(--border-subtle)',
            }}>
              <div style={{
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem',
              }}>
                Input Text
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {demoText.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5,
                      transition: 'all 0.4s ease',
                      background: highlightedIdx >= i
                        ? (line.ai ? 'rgba(255, 68, 102, 0.12)' : 'rgba(0, 255, 156, 0.08)')
                        : 'var(--bg-tertiary)',
                      borderLeft: highlightedIdx >= i
                        ? `3px solid ${line.ai ? 'var(--accent-danger)' : 'var(--accent-success)'}`
                        : '3px solid transparent',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: result */}
            <div style={{
              padding: '2rem',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: '1.5rem', textAlign: 'center',
            }}>
              <ScoreRing
                score={score}
                label="AI Probability"
                color={score > 50 ? 'var(--accent-danger)' : 'var(--accent-success)'}
              />

              {done && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,68,102,0.1)',
                    border: '1px solid rgba(255,68,102,0.3)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-danger)',
                  }}>
                    ⚠️ Likely AI Generated
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    2 of 4 sentences flagged
                  </div>
                  <Link href="/signup" style={{
                    display: 'inline-block', marginTop: '0.5rem',
                    padding: '0.625rem 1.25rem',
                    background: 'var(--gradient-cta)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem', fontWeight: 700, color: 'white',
                    textDecoration: 'none',
                  }}>
                    Try It for ₹19 →
                  </Link>
                </div>
              )}

              {scanning && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.8rem', color: 'var(--text-muted)',
                }}>
                  <span className="loading-spinner" />
                  Analyzing...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
