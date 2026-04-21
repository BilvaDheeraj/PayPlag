'use client'
import { motion } from 'framer-motion'

interface ScoreRingProps {
  score: number
  label: string
  color: string
  size?: number
}

export function ScoreRing({ score, label, color, size = 120 }: ScoreRingProps) {
  const r = (size / 2) - 8
  const circumference = 2 * Math.PI * r
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="score-ring-wrapper">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth="8"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text
          x={size / 2} y={size / 2}
          textAnchor="middle" dy="0.35em"
          fill="var(--text-primary)"
          fontSize={size * 0.18}
          fontFamily="var(--font-mono)"
          fontWeight="600"
        >
          {score}%
        </text>
      </svg>
      <span className="score-label">{label}</span>
    </div>
  )
}
