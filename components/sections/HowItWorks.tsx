'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'

const steps = [
  {
    num: '01',
    icon: '📝',
    title: 'Paste or Upload Your Text',
    desc: 'Drop your document, paste text, or import from URL. Supports PDF, DOCX, TXT up to 10,000 words.',
    color: '#00E5FF',
    shadowColor: 'rgba(0,229,255,0.35)',
    accentBg: 'rgba(0,229,255,0.07)',
    tag: 'Input',
    demo: (
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
        padding: '0.75rem 1rem',
        border: '1px solid rgba(0,229,255,0.2)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.82rem',
        color: 'rgba(0,229,255,0.7)',
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
      }}>
        <TypeAnimation
          sequence={[
            'Paste your text here...',
            1200,
            'The increasing use of AI in education...',
            2000,
            'Academic integrity is fundamental to...',
            2000,
          ]}
          wrapper="span"
          speed={55}
          repeat={Infinity}
        />
      </div>
    ),
  },
  {
    num: '02',
    icon: '🎯',
    title: 'Choose Your Check',
    desc: 'Select from three powerful tools: Plagiarism Checker, AI Detector, or AI Paraphraser.',
    color: '#FFB347',
    shadowColor: 'rgba(255,179,71,0.35)',
    accentBg: 'rgba(255,179,71,0.07)',
    tag: 'Select Tool',
    demo: (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { label: '🔍 Plagiarism', active: true },
          { label: '🤖 AI Detect', active: false },
          { label: '✍️ Paraphrase', active: false },
        ].map(t => (
          <div key={t.label} style={{
            padding: '0.4rem 0.875rem',
            borderRadius: 999,
            fontSize: '0.75rem',
            fontWeight: 600,
            background: t.active ? 'rgba(255,179,71,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${t.active ? 'rgba(255,179,71,0.6)' : 'rgba(255,255,255,0.1)'}`,
            color: t.active ? '#FFB347' : 'rgba(255,255,255,0.4)',
          }}>
            {t.label}
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '03',
    icon: '💳',
    title: 'Pay ₹19 via UPI / Card',
    desc: 'Instant, secure payment via Razorpay. UPI, GPay, PhonePe, Paytm, Cards, Net Banking.',
    color: '#00FF9C',
    shadowColor: 'rgba(0,255,156,0.35)',
    accentBg: 'rgba(0,255,156,0.07)',
    tag: 'Pay',
    demo: (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {['UPI', 'GPay', 'PhonePe', 'Paytm', 'Card'].map(p => (
          <span key={p} style={{
            padding: '0.3rem 0.75rem',
            background: 'rgba(0,255,156,0.1)',
            border: '1px solid rgba(0,255,156,0.25)',
            borderRadius: 999,
            fontSize: '0.72rem',
            fontWeight: 600,
            color: '#00FF9C',
          }}>
            {p}
          </span>
        ))}
      </div>
    ),
  },
  {
    num: '04',
    icon: '📊',
    title: 'Get Results Instantly',
    desc: 'Detailed reports with highlighted sentences, source links, and confidence scores in seconds.',
    color: '#FF6B9D',
    shadowColor: 'rgba(255,107,157,0.35)',
    accentBg: 'rgba(255,107,157,0.07)',
    tag: 'Results',
    demo: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>AI Probability</span>
          <span style={{ color: '#FF6B9D', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>78%</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '78%' }}
            viewport={{ once: false }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            style={{ height: '100%', background: '#FF6B9D', borderRadius: 3 }}
          />
        </div>
        <div style={{ fontSize: '0.72rem', color: 'rgba(255,107,157,0.7)', fontWeight: 600 }}>
          ⚠️ Likely AI Generated
        </div>
      </div>
    ),
  },
]

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, margin: '-80px 0px -80px 0px' })

  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Step card */}
      <motion.div
        initial={{
          opacity: 0,
          x: isLeft ? -80 : 80,
          y: 40,
          scale: 0.93,
        }}
        animate={inView ? {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        } : {
          opacity: 0,
          x: isLeft ? -80 : 80,
          y: 40,
          scale: 0.93,
        }}
        transition={{
          duration: 0.75,
          ease: [0.34, 1.2, 0.64, 1],
          delay: 0.05,
        }}
        style={{
          width: '44%',
          background: `var(--bg-card)`,
          border: `1px solid ${step.color}30`,
          borderRadius: 24,
          padding: '2rem 2rem 1.75rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: inView
            ? `0 0 60px ${step.shadowColor}, 0 20px 60px rgba(0,0,0,0.5)`
            : '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'box-shadow 0.6s ease',
        }}
      >
        {/* Background step number watermark */}
        <div style={{
          position: 'absolute',
          top: -16,
          right: isLeft ? -8 : 'auto',
          left: isLeft ? 'auto' : -8,
          fontFamily: 'var(--font-mono)',
          fontSize: '7rem',
          fontWeight: 900,
          color: `${step.color}08`,
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          {step.num}
        </div>

        {/* Top row: icon + tag + step num */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Glowing icon box */}
            <motion.div
              animate={inView ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: `${step.color}18`,
                border: `1px solid ${step.color}35`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: inView ? `0 0 20px ${step.color}25` : 'none',
                transition: 'box-shadow 0.5s ease',
                flexShrink: 0,
              }}
            >
              {step.icon}
            </motion.div>

            {/* Tag */}
            <div style={{
              padding: '0.2rem 0.75rem',
              background: `${step.color}12`,
              border: `1px solid ${step.color}30`,
              borderRadius: 999,
              fontSize: '0.7rem',
              fontWeight: 700,
              color: step.color,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontFamily: 'var(--font-mono)',
            }}>
              {step.tag}
            </div>
          </div>

          {/* Large step number */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '2.25rem',
            fontWeight: 900,
            color: step.color,
            lineHeight: 1,
            opacity: 0.8,
          }}>
            {step.num}
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.625rem',
          lineHeight: 1.25,
        }}>
          {step.title}
        </h3>

        {/* Desc */}
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
          lineHeight: 1.65,
          marginBottom: '1.25rem',
        }}>
          {step.desc}
        </p>

        {/* Demo widget */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          {step.demo}
        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: isLeft ? 0 : 'auto',
            right: isLeft ? 'auto' : 0,
            width: '60%',
            height: 2,
            background: `linear-gradient(${isLeft ? '90deg' : '270deg'}, ${step.color}, transparent)`,
            transformOrigin: isLeft ? 'left' : 'right',
          }}
        />
      </motion.div>

      {/* Center connector dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.15, type: 'spring', stiffness: 300 }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: `var(--bg-primary)`,
          border: `2px solid ${step.color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1rem',
          boxShadow: inView ? `0 0 24px ${step.shadowColor}, 0 0 50px ${step.shadowColor}` : 'none',
          transition: 'box-shadow 0.5s ease',
          zIndex: 10,
        }}
      >
        {step.icon}
      </motion.div>
    </div>
  )
}

export function HowItWorks() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // The vertical progress line fills as you scroll through the section
  const lineHeight = useTransform(scrollYProgress, [0.05, 0.9], ['0%', '100%'])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      style={{
        background: 'var(--bg-primary)',
        padding: '8rem 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial glow background */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px', height: '700px',
        background: 'radial-gradient(ellipse, rgba(0,229,255,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.375rem 0.875rem',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-default)',
            borderRadius: 999,
            fontSize: '0.8rem', fontWeight: 500,
            color: 'var(--text-secondary)',
            marginBottom: '1rem',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#00FF9C',
              boxShadow: '0 0 8px #00FF9C',
              animation: 'badge-pulse 2s ease-in-out infinite',
            }} />
            Simple 4-Step Process
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}>
            How It{' '}
            <span style={{
              background: 'var(--gradient-text-hero)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Works
            </span>
          </h2>
        </motion.div>

        {/* Steps container with center timeline */}
        <div style={{ position: 'relative' }}>
          {/* Static timeline track */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            transform: 'translateX(-50%)',
            width: 2,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 2,
          }} />

          {/* Animated fill line */}
          <motion.div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              transform: 'translateX(-50%)',
              width: 2,
              borderRadius: 2,
              background: 'var(--gradient-text-hero)',
              height: lineHeight,
              originY: 0,
            }}
          />

          {/* Steps */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4rem',
          }}>
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <p style={{ color: 'rgba(160,160,180,0.7)', fontSize: '0.9rem' }}>
            Ready to try it yourself?
          </p>
            <a
            href="/signup"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.875rem 2.25rem',
              background: 'var(--gradient-cta)',
              borderRadius: 999,
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 0 40px rgba(255,179,71,0.3)',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.02)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 60px rgba(255,179,71,0.5)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)'
              ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(255,179,71,0.3)'
            }}
          >
            Start Your First Check — ₹19 →
          </a>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .step-card-wrapper { justify-content: center !important; }
          .step-card-wrapper > div:first-child { width: 90% !important; }
        }
        .step-visible { opacity: 1 !important; transform: translateY(0) !important; }
        .step-hidden { opacity: 0; transform: translateY(50px); }
      ` }} />
    </section>
  )
}
