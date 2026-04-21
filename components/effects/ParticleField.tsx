'use client'
import { useEffect, useRef } from 'react'

export function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animId: number
    let renderer: any

    const init = async () => {
      const THREE = await import('three')
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement)
      }

      const geometry = new THREE.BufferGeometry()
      const count = 1500
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      const material = new THREE.PointsMaterial({
        color: 0x00E5FF,
        size: 0.025,
        transparent: true,
        opacity: 0.5,
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)
      camera.position.z = 5

      const animate = () => {
        animId = requestAnimationFrame(animate)
        particles.rotation.x += 0.0002
        particles.rotation.y += 0.0003
        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        if (!mountRef.current) return
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', handleResize)

      return () => {
        cancelAnimationFrame(animId)
        window.removeEventListener('resize', handleResize)
        renderer.dispose()
        if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
          mountRef.current.removeChild(renderer.domElement)
        }
      }
    }

    const cleanup = init()
    return () => {
      cleanup.then(fn => fn && fn())
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  )
}
