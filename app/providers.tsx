'use client'
import { useEffect } from 'react'

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: any
    let gsap: any
    let ScrollTrigger: any

    const init = async () => {
      const LenisModule = await import('lenis')
      const gsapModule = await import('gsap')
      const STModule = await import('gsap/ScrollTrigger')

      gsap = gsapModule.gsap
      ScrollTrigger = STModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      lenis = new LenisModule.default({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time: number) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)
    }

    init()

    return () => {
      if (lenis) lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
