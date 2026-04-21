'use client'
import { useState } from 'react'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

const features = [
  {
    tool: 'Plagiarism Checker',
    icon: '🔍',
    color: 'var(--accent-primary)',
    tagline: 'Find every stolen word.',
    bullets: [
      'Web crawl across 50B+ indexed web pages',
      'Detects exact matches AND paraphrased copies',
      'Ignores citations and bibliographies automatically',
      'Shows similarity % per source with clickable links',
      'Supports PDF, DOCX, TXT upload up to 10,000 words',
      'Real-time scanning in under 30 seconds',
    ],
  },
  {
    tool: 'AI Content Detector',
    icon: '🤖',
    color: 'var(--accent-secondary)',
    tagline: 'Know if it was written by a human.',
    bullets: [
      'Detects GPT-3.5, GPT-4, GPT-4o, Claude, Gemini, Llama, Mistral',
      'Sentence-level highlighting — which sentences are AI',
      'Perplexity + Burstiness + Semantic analysis (3-layer)',
      'Confidence score 0–100% with explanation',
      'Calibrated for academic writing — low false positives',
      'Processes up to 10,000 words per check',
    ],
  },
  {
    tool: 'AI Paraphraser',
    icon: '✍️',
    color: 'var(--accent-success)',
    tagline: 'Rewrite without losing meaning.',
    bullets: [
      '5 modes: Standard, Fluent, Academic, Simple, Creative',
      'Preserves original meaning (semantic similarity >90%)',
      'Multi-language: English, Hindi, Spanish, French, German+',
      'Before/After side-by-side comparison view',
      'One-click copy + download as DOCX/PDF',
      'Powered by Claude Sonnet — state-of-the-art quality',
    ],
  },
]

export function FeatureDeepDives() {
  const [activeFeature, setActiveFeature] = useState(0)
  const active = features[activeFeature]

  return (
    <section className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <RevealOnScroll>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              Deep Feature Breakdown
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Built for <span className="gradient-text">Precision</span>
            </h2>
          </div>
        </RevealOnScroll>

        {/* Tool selector tabs */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
          {features.map((f, i) => (
            <button
              key={f.tool}
              onClick={() => setActiveFeature(i)}
              style={{
                padding: '0.625rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                border: `1px solid ${activeFeature === i ? f.color : 'var(--border-default)'}`,
                background: activeFeature === i ? `${f.color}15` : 'var(--bg-tertiary)',
                color: activeFeature === i ? f.color : 'var(--text-secondary)',
                fontWeight: 600, fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
            >
              {f.icon} {f.tool}
            </button>
          ))}
        </div>

        {/* Feature panel */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center',
        }}>
          {/* Illustration */}
          <RevealOnScroll direction="right">
            <div style={{
              background: 'var(--gradient-card)',
              border: `1px solid ${active.color}30`,
              borderRadius: 'var(--radius-xl)',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: `0 0 60px ${active.color}15`,
              minHeight: 320,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '1rem',
            }}>
              <div style={{ fontSize: '5rem', lineHeight: 1, filter: `drop-shadow(0 0 20px ${active.color}40)` }}>
                {active.icon}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)', fontSize: '1.75rem',
                color: active.color,
              }}>
                {active.tool}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                {active.tagline}
              </p>
              <div style={{
                padding: '0.5rem 1.5rem',
                background: `${active.color}15`,
                border: `1px solid ${active.color}30`,
                borderRadius: 'var(--radius-full)',
                color: active.color, fontWeight: 700,
                fontFamily: 'var(--font-mono)', fontSize: '1.1rem',
              }}>
                ₹19 per check
              </div>
            </div>
          </RevealOnScroll>

          {/* Bullets */}
          <RevealOnScroll direction="left">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {active.bullets.map((bullet, i) => (
                <li
                  key={bullet}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
                    padding: '1rem 1.25rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${active.color}40`
                    ;(e.currentTarget as HTMLElement).style.background = `${active.color}05`
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'
                    ;(e.currentTarget as HTMLElement).style.background = 'var(--bg-card)'
                  }}
                >
                  <span style={{
                    color: active.color, fontWeight: 700, fontSize: '1rem', flexShrink: 0, marginTop: 1,
                  }}>
                    ✓
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .feature-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
