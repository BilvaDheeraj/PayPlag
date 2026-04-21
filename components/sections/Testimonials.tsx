'use client'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

const testimonials = [
  {
    text: 'Submitted my thesis knowing it was clean. The AI detector caught sections I didn\'t even realize were flagged. Worth every rupee.',
    author: 'Priya Sharma',
    role: 'PhD Scholar · IIT Delhi',
    avatar: 'PS',
  },
  {
    text: '₹19 is literally nothing compared to the peace of mind. Faster than Turnitin, cheaper than everything else.',
    author: 'Rahul Mehta',
    role: 'Content Writer · Bangalore',
    avatar: 'RM',
  },
  {
    text: 'The paraphraser actually rewrites properly — not just shuffles synonyms. Academic mode is incredible.',
    author: 'Dr. Ananya Singh',
    role: 'Associate Professor · Mumbai',
    avatar: 'AS',
  },
  {
    text: 'I run 50+ checks a month for my agency. The pay-per-use model saves me so much vs Copyleaks or Originality.',
    author: 'Karan Joshi',
    role: 'Agency Owner · Delhi',
    avatar: 'KJ',
  },
  {
    text: 'Detected my student submissions were AI-generated within seconds. The sentence-level breakdown is gold.',
    author: 'Prof. Suresh Reddy',
    role: 'HOD Computer Science · BITS',
    avatar: 'SR',
  },
  {
    text: 'Super clean UX. No BS. Paste → Pay → Result. That\'s it. Genuinely best tool in this space.',
    author: 'Sneha Kapoor',
    role: 'Freelance Blogger',
    avatar: 'SK',
  },
]

const colors = [
  'var(--accent-primary)', 'var(--accent-secondary)',
  'var(--accent-success)', 'var(--accent-warning)',
  'var(--accent-primary)', 'var(--accent-secondary)',
]

export function Testimonials() {
  const half = Math.ceil(testimonials.length / 2)
  const row1 = testimonials.slice(0, half)
  const row2 = testimonials.slice(half)

  return (
    <section className="section" style={{ background: 'var(--bg-primary)', overflow: 'hidden' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <RevealOnScroll>
          <div className="badge" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            What Users Are Saying
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Loved by <span className="gradient-text">50,000+</span> Users
          </h2>
        </RevealOnScroll>
      </div>

      {/* Marquee row 1 */}
      <div style={{ overflow: 'hidden', marginBottom: '1.25rem' }}>
        <div style={{
          display: 'flex', gap: '1.25rem',
          animation: 'marquee 30s linear infinite',
          width: 'max-content',
        }}>
          {[...row1, ...row1].map((t, i) => (
            <TestimonialCard key={i} t={t} color={colors[i % colors.length]} />
          ))}
        </div>
      </div>

      {/* Marquee row 2 — reverse */}
      <div style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'flex', gap: '1.25rem',
          animation: 'marquee-reverse 35s linear infinite',
          width: 'max-content',
        }}>
          {[...row2, ...row2].map((t, i) => (
            <TestimonialCard key={i} t={t} color={colors[(i + 3) % colors.length]} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ t, color }: { t: typeof testimonials[0]; color: string }) {
  return (
    <div style={{
      minWidth: 320, maxWidth: 360,
      background: 'var(--gradient-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      flexShrink: 0,
    }}>
      <p style={{
        color: 'var(--text-secondary)', fontSize: '0.875rem',
        lineHeight: 1.7, marginBottom: '1.25rem',
        fontStyle: 'italic',
      }}>
        &ldquo;{t.text}&rdquo;
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: `${color}20`,
          border: `1px solid ${color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 800, color,
          fontFamily: 'var(--font-mono)',
          flexShrink: 0,
        }}>
          {t.avatar}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t.author}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
        </div>
        <div style={{ marginLeft: 'auto', color: '#FFB347', fontSize: '0.7rem' }}>★★★★★</div>
      </div>
    </div>
  )
}
