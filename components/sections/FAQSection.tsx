'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

const faqs = [
  {
    q: 'Do I need to create an account?',
    a: 'You can view the landing page without an account, but to run checks and store results, a free account is required. Sign up takes 15 seconds via Google or email.',
  },
  {
    q: 'Is ₹19 really all I pay?',
    a: 'Yes. ₹19 per check, period. No monthly subscription, no hidden fees, no GST surprise. Each tool — Plagiarism, AI Detector, and Paraphraser — costs ₹19 per use.',
  },
  {
    q: 'How accurate is the AI detector?',
    a: 'Our 3-layer engine (Perplexity + Burstiness + Semantic) achieves 99.2% accuracy on our internal benchmark, with a false-positive rate under 1%. We continuously retrain to catch new AI models.',
  },
  {
    q: 'What file types are supported?',
    a: 'You can paste text directly, or upload PDF, DOCX, or TXT files up to 10,000 words. We also support direct URL scanning for public web pages.',
  },
  {
    q: 'How does the payment work?',
    a: 'We use Razorpay — India\'s most trusted payment gateway. You can pay via UPI (GPay, PhonePe, Paytm), debit/credit card, or net banking. Your payment is PCI DSS secured.',
  },
  {
    q: 'Can I re-use the same check token?',
    a: 'No. Each ₹19 payment grants a single one-time-use check token. Once a check is completed, the token expires. This ensures fair usage and prevents sharing.',
  },
  {
    q: 'How long are results stored?',
    a: 'Your check results are stored in your account dashboard for 90 days. You can download them as PDF or JSON at any time within that window.',
  },
  {
    q: 'Do you support languages other than English?',
    a: 'Yes! Plagiarism checking supports 40+ languages. The AI Paraphraser supports English, Hindi, Spanish, French, German, Portuguese, and more via our multilingual model.',
  },
]

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        background: 'var(--gradient-card)',
        border: `1px solid ${open ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '1.25rem 1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer',
          gap: '1rem',
        }}
        aria-expanded={open}
        id={`faq-${index}`}
      >
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.4 }}>
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: 'var(--accent-primary)', flexShrink: 0, fontSize: '1.2rem' }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 1.5rem 1.25rem',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1rem',
            }}>
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  return (
    <section id="faq" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <RevealOnScroll>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              Got Questions?
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div style={{
          maxWidth: 720, margin: '0 auto',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
        }}>
          {faqs.map((faq, i) => (
            <RevealOnScroll key={i} delay={i * 0.04}>
              <FAQItem faq={faq} index={i} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
