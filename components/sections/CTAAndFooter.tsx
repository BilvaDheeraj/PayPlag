'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { MagneticButton } from '@/components/ui/MagneticButton'

export function CTASection() {
  return (
    <section className="section" style={{
      background: 'var(--bg-secondary)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Radial glows */}
      <div style={{
        position: 'absolute', top: '50%', left: '25%',
        transform: 'translate(-50%, -50%)',
        width: '500px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(0,229,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '50%', right: '25%',
        transform: 'translate(50%, -50%)',
        width: '500px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(255,179,71,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
        <RevealOnScroll>
          <div className="badge" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
            Get Started in 60 Seconds
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}>
            Your Content.<br />
            <span className="gradient-text-cta">Verified. Trusted. Clean.</span>
          </h2>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '1.1rem',
            maxWidth: 500, margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}>
            Join 50,000+ students, researchers, and writers who trust Pay&Plag
            to keep their content authentic.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup">
              <MagneticButton className="btn-primary" id="cta-signup-final">
                🚀 Start Your First Check — ₹19
              </MagneticButton>
            </Link>
            <a href="#tools">
              <button className="btn-ghost">Explore Tools →</button>
            </a>
          </div>

          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔒 Secure payments · No subscriptions · Instant results
          </p>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-subtle)',
      padding: '3rem 2rem 2rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700,
              marginBottom: '0.75rem', color: 'var(--text-primary)',
            }}>
              Pay<span style={{ color: 'var(--accent-primary)' }}>&</span>Plag
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Check It. Pay It. Trust It.<br />
              The world&apos;s most honest content intelligence platform.
            </p>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              🇮🇳 Made in India · Global reach
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Tools
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/plagiarism', label: '🔍 Plagiarism Checker' },
                { href: '/ai-detector', label: '🤖 AI Detector' },
                { href: '/paraphraser', label: '✍️ Paraphraser' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/#how-it-works', label: 'How It Works' },
                { href: '/#pricing', label: 'Pricing' },
                { href: '/#faq', label: 'FAQ' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
                { href: '/refund', label: 'Refund Policy' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2025 Pay&Plag. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>🔒 PCI DSS Compliant</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>💳 Powered by Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
