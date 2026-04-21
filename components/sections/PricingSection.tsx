'use client'
import Link from 'next/link'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { MagneticButton } from '@/components/ui/MagneticButton'

const checks = [
  { icon: '🔍', label: 'Plagiarism Check', price: '₹19 per check' },
  { icon: '🤖', label: 'AI Content Detector', price: '₹19 per check' },
  { icon: '✍️', label: 'AI Paraphraser', price: '₹19 per check' },
]

const payMethods = ['UPI', 'GPay', 'PhonePe', 'Paytm', 'Visa/MC', 'Net Banking', 'Wallets']

export function PricingSection() {
  return (
    <section id="pricing" className="section" style={{ background: 'var(--bg-primary)' }}>
      <div className="container">
        <RevealOnScroll>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              Transparent Pricing
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Simple. <span className="gradient-text-cta">Honest.</span> ₹19.
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div style={{
            maxWidth: 580, margin: '0 auto',
            background: 'var(--gradient-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-float)',
            position: 'relative',
          }}>
            {/* Glow top */}
            <div style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: '80%', height: 1,
              background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)',
            }} />

            <div style={{ padding: '3rem 2.5rem' }}>
              {/* Headline */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '4rem', fontWeight: 900,
                  color: 'var(--accent-secondary)',
                  lineHeight: 1,
                }}>
                  ₹19
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.4rem' }}>
                  Every check · Every time · No subscriptions
                </div>
              </div>

              {/* Checks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {checks.map(check => (
                  <div key={check.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.875rem 1.25rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span>{check.icon}</span>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {check.label}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontWeight: 700,
                      color: 'var(--accent-success)', fontSize: '0.9rem',
                    }}>
                      {check.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pay methods */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textAlign: 'center' }}>
                  Pay via:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                  {payMethods.map(m => (
                    <span key={m} style={{
                      padding: '0.25rem 0.75rem',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem', fontWeight: 500,
                      color: 'var(--text-secondary)',
                    }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* No hidden fees callouts */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem',
                marginBottom: '2rem',
              }}>
                {[
                  '✓ No monthly fees',
                  '✓ No credit card required',
                  '✓ No account to try',
                  '✓ Instant results',
                ].map(p => (
                  <div key={p} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {p}
                  </div>
                ))}
              </div>

              <Link href="/signup" style={{ display: 'block' }}>
                <MagneticButton className="btn-primary btn-full" id="pricing-cta">
                  Start Checking →
                </MagneticButton>
              </Link>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
