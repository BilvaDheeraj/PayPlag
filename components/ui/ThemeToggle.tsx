'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
    setTheme(saved)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      setTheme(newTheme)
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      
      const isDark = newTheme === 'dark'
      
      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: isDark
            ? '::view-transition-old(root)'
            : '::view-transition-new(root)',
        }
      )
    })
  }

  if (!mounted) return <div className="theme-toggle" />

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

