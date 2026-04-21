'use client'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

const trustStats = [
  { value: 99.2, suffix: '%', label: 'AI Detection Accuracy', color: 'var(--accent-primary)' },
  { value: 1, prefix: '<', suffix: '%', label: 'False Positive Rate', color: 'var(--accent-success)' },
  { value: 40, suffix: '+', label: 'Languages Supported', color: 'var(--accent-secondary)' },
  { value: 19, prefix: '₹', suffix: '', label: 'Flat Per Check', color: 'var(--accent-warning)' },
]

export function TrustProof() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })

  return (
    <section className="section" style={{ background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(0,229,255,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="container" style={{ position: 'relative' }}>
        <RevealOnScroll>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              Industry-Leading Accuracy
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Numbers That <span className="gradient-text">Speak</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: 500, margin: '1rem auto 0' }}>
              Trusted by 50,000+ students, writers, and researchers worldwide.
            </p>
          </div>
        </RevealOnScroll>

        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4rem',
          }}
        >
          {trustStats.map((stat, i) => (
            <RevealOnScroll key={stat.label} delay={i * 0.1}>
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1.5rem',
                background: 'var(--gradient-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(ellipse at center top, ${stat.color}08 0%, transparent 60%)`,
                }} />
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: 900,
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                  position: 'relative',
                }}>
                  {stat.prefix}
                  {inView ? <CountUp end={stat.value} duration={2} delay={i * 0.15} decimals={stat.value % 1 !== 0 ? 1 : 0} /> : 0}
                  {stat.suffix}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, position: 'relative' }}>
                  {stat.label}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Trust badges */}
        <RevealOnScroll>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexWrap: 'wrap', gap: '1.5rem',
            padding: '2rem',
            background: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Trusted by researchers at:
            </span>
            {['🎓 IIT Delhi', '🏛️ BITS Pilani', '📚 DU', '🔬 AIIMS', '🌐 50K+ users'].map(inst => (
              <span key={inst} style={{
                padding: '0.375rem 1rem',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
              }}>
                {inst}
              </span>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
