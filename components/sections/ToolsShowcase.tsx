'use client'
import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

const tools = [
  {
    id: 'plagiarism',
    icon: '🔍',
    title: 'Plagiarism Checker',
    color: 'var(--accent-primary)',
    glow: 'var(--glow-cyan)',
    desc: 'Check if your text exists anywhere online. Web crawl across 50B+ indexed pages.',
    features: ['Exact match + paraphrased detection', 'Source links with similarity %', 'PDF, DOCX, TXT support'],
    href: '/plagiarism',
  },
  {
    id: 'ai-detector',
    icon: '🤖',
    title: 'AI Content Detector',
    color: 'var(--accent-secondary)',
    glow: 'var(--glow-amber)',
    desc: 'Detect ChatGPT, GPT-4, Claude, Gemini, Llama & more with sentence-level precision.',
    features: ['3-layer detection engine', 'Sentence-level highlighting', '99.2% accuracy · <1% false positives'],
    href: '/ai-detector',
  },
  {
    id: 'paraphraser',
    icon: '✍️',
    title: 'AI Paraphraser',
    color: 'var(--accent-success)',
    glow: 'var(--glow-jade)',
    desc: 'Rewrite text in 5 modes: Standard, Fluent, Academic, Simple, Creative.',
    features: ['Preserves meaning (90%+ similarity)', '40+ languages supported', 'Before/After side-by-side view'],
    href: '/paraphraser',
  },
]

export function ToolsShowcase() {
  return (
    <section id="tools" className="section" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container">
        <RevealOnScroll>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="badge" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
              Three Powerful Tools
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              marginBottom: '1rem',
            }}>
              Everything You Need to<br />
              <span className="gradient-text">Trust Your Content</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 560, margin: '0 auto' }}>
              One platform. Three tools. ₹19 each. No account required to try.
            </p>
          </div>
        </RevealOnScroll>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}>
          {tools.map((tool, i) => (
            <RevealOnScroll key={tool.id} delay={i * 0.12} direction="up">
              <ToolCard tool={tool} />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

function ToolCard({ tool }: { tool: typeof tools[0] }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const handleMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15
      card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-4px)`
    }
    const handleLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)'
    }
    card.addEventListener('mousemove', handleMove)
    card.addEventListener('mouseleave', handleLeave)
    return () => {
      card.removeEventListener('mousemove', handleMove)
      card.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <div
      ref={cardRef}
      style={{
        background: 'var(--gradient-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        transformStyle: 'preserve-3d',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.boxShadow = `${tool.glow}`
        el.style.borderColor = tool.color
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.boxShadow = 'none'
        el.style.borderColor = 'var(--border-subtle)'
      }}
    >
      {/* Price badge */}
      <div style={{
        position: 'absolute', top: '1.25rem', right: '1.25rem',
        padding: '0.25rem 0.75rem',
        background: 'rgba(0,0,0,0.4)',
        border: `1px solid ${tool.color}40`,
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 700,
        fontFamily: 'var(--font-mono)',
        color: tool.color,
      }}>
        ₹19/check
      </div>

      {/* Icon */}
      <div style={{
        fontSize: '2.5rem',
        marginBottom: '1rem',
        filter: 'drop-shadow(0 0 12px currentColor)',
      }}>
        {tool.icon}
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.4rem',
        marginBottom: '0.75rem',
        color: tool.color,
      }}>
        {tool.title}
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        {tool.desc}
      </p>

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
        {tool.features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: tool.color, flexShrink: 0 }}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <Link href={tool.href} style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.625rem 1.5rem',
        background: `${tool.color}15`,
        border: `1px solid ${tool.color}40`,
        borderRadius: 'var(--radius-full)',
        color: tool.color,
        fontSize: '0.875rem',
        fontWeight: 600,
        transition: 'all 0.2s',
        textDecoration: 'none',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = `${tool.color}25`
          ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${tool.color}40`
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = `${tool.color}15`
          ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}
      >
        Start Checking →
      </Link>
    </div>
  )
}
