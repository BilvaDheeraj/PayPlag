'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { ParticleField } from '@/components/effects/ParticleField'
import { MagneticButton } from '@/components/ui/MagneticButton'
import Link from 'next/link'

const stats = [
  { value: 12, suffix: 'M+', label: 'Checks Done' },
  { value: 99.2, suffix: '%', label: 'Accuracy' },
  { value: 40, suffix: '+', label: 'Languages' },
  { value: 19, prefix: '₹', suffix: '', label: 'Flat, No Hidden Fees' },
]

function StatsBar() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })
  return (
    <div ref={ref} style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '2px',
      marginTop: '5rem',
      borderTop: '1px solid var(--border-subtle)',
      paddingTop: '2.5rem',
      width: '100%',
      maxWidth: 800,
      margin: '5rem auto 0',
    }}>
      {stats.map((stat, i) => (
        <div key={stat.label} style={{ textAlign: 'center', padding: '0 1rem' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            lineHeight: 1,
          }}>
            {stat.prefix}
            {inView ? (
              <CountUp
                end={stat.value}
                duration={2}
                delay={i * 0.15}
                decimals={stat.value % 1 !== 0 ? 1 : 0}
              />
            ) : '0'}
            {stat.suffix}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.4rem',
            fontWeight: 500,
          }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}

export function HeroSection() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const words = [
    { text: "The World's", highlight: false },
    { text: "Most Trusted", highlight: false },
    { text: "Content Intelligence", highlight: true },
    { text: "Platform", highlight: false },
  ]

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--gradient-hero)',
      paddingTop: '70px',
    }}>
      {/* Grid background */}
      <div className="grid-bg" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
      {/* Particle field */}
      <ParticleField />

      {/* Radial glow */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px', height: '600px',
        background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.08) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Content */}
      <motion.div
        style={{ y, opacity, position: 'relative', zIndex: 2, width: '100%' }}
      >
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          {/* Badge */}
          <motion.div
            className="badge"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="badge-dot" />
            ₹19 per use · No subscriptions · Instant results
          </motion.div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.1em',
          }}>
            {words.map((word, i) => (
              <motion.span
                key={word.text}
                initial={{ opacity: 0, y: 60, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  delay: 0.4 + i * 0.12,
                  duration: 0.8,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                style={{ display: 'block' }}
              >
                {word.highlight ? (
                  <span
                    className="gradient-text shimmer"
                    style={{
                      background: 'linear-gradient(90deg, #00E5FF, #00FF9C, #00E5FF)',
                      backgroundSize: '200% auto',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {word.text}
                  </span>
                ) : word.text}
              </motion.span>
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'var(--text-secondary)',
              maxWidth: 560,
              lineHeight: 1.6,
            }}
          >
            Plagiarism. AI Detection. Paraphrasing.
            <br />
            <strong style={{ color: 'var(--text-primary)' }}>Check once. Pay ₹19. Trust the result.</strong>
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Link href="/signup">
              <MagneticButton className="btn-primary">
                Check Your Text Now
                <span>→</span>
              </MagneticButton>
            </Link>
            <a href="#how-it-works">
              <button className="btn-ghost">See How It Works ↓</button>
            </a>
          </motion.div>

          {/* Stats */}
          <StatsBar />
        </div>
      </motion.div>

      {/* Scroll chevron */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          position: 'absolute', bottom: '2rem',
          left: '50%', transform: 'translateX(-50%)',
          zIndex: 2, animation: 'bounce-chevron 2s ease-in-out infinite',
          color: 'var(--text-muted)', fontSize: '1.5rem',
        }}
      >
        ⌄
      </motion.div>
    </section>
  )
}
