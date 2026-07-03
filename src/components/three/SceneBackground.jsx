import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext.jsx'
import { BAKERY_SHAPES } from './BakeryShapes.jsx'
import CanvasErrorBoundary from './CanvasErrorBoundary.jsx'

/**
 * Site-wide ambient 3D layer: a fixed, non-interactive canvas of slowly
 * floating bakery primitives that sits behind every page (mounted once in
 * Layout). Replaces the old looping background video.
 *
 * Performance tiers (chosen from viewport + `prefers-reduced-motion`):
 *   - desktop : 7 shapes, DPR up to 1.5
 *   - mobile  : 4 shapes, DPR clamped to 1 so phones stay smooth
 *   - still   : no canvas at all — just the theme gradient
 *
 * A theme-aware gradient always paints underneath, so there is a proper
 * background before the canvas loads and if WebGL is unavailable.
 */
export default function SceneBackground() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const [tier, setTier] = useState('desktop') // 'desktop' | 'mobile' | 'still'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const update = () => {
      if (!motionOk.matches) setTier('still')
      else setTier(desktop.matches ? 'desktop' : 'mobile')
    }
    update()
    desktop.addEventListener('change', update)
    motionOk.addEventListener('change', update)
    return () => {
      desktop.removeEventListener('change', update)
      motionOk.removeEventListener('change', update)
    }
  }, [])

  // Soft fade-in once the layer is on screen.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  const count = tier === 'desktop' ? 7 : 4
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const Shape = BAKERY_SHAPES[i % BAKERY_SHAPES.length]
        return {
          id: i,
          Shape,
          position: [(Math.random() * 2 - 1) * 6.5, (Math.random() * 2 - 1) * 3.5, -2 - Math.random() * 4],
          scale: 0.45 + Math.random() * 0.65,
          rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
          speed: 1 + Math.random() * 1.5
        }
      }),
    [count]
  )

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-[1] overflow-hidden pointer-events-none"
      style={{ isolation: 'isolate' }}
    >
      {/* Theme-aware gradient base — always visible (before the canvas paints,
          in the 'still' tier, and as the WebGL-failure fallback). */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: dark
            ? 'linear-gradient(to bottom right, #0f1a14, #14261c, #0a140e)'
            : 'linear-gradient(to bottom right, #f0fdf4, #dcfce7, #bbf7d0)'
        }}
      />

      {tier !== 'still' && (
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-out"
          style={{ opacity: mounted ? 1 : 0 }}
        >
          <CanvasErrorBoundary fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 45 }}
              dpr={[1, tier === 'desktop' ? 1.5 : 1]}
              gl={{ antialias: tier === 'desktop', alpha: true }}
            >
              <ambientLight intensity={dark ? 0.45 : 0.85} />
              <directionalLight position={[5, 5, 5]} intensity={dark ? 0.8 : 1.1} />
              <pointLight position={[-5, -3, 2]} intensity={0.5} color="#e8702a" />
              {items.map(({ id, Shape, position, scale, rotation, speed }) => (
                <Float key={id} speed={speed} rotationIntensity={1} floatIntensity={1.6}>
                  <Shape position={position} scale={scale} rotation={rotation} />
                </Float>
              ))}
            </Canvas>
          </CanvasErrorBoundary>
        </div>
      )}

      {/* Readability overlay so page content stays legible over the shapes. */}
      <div className="absolute inset-0 bg-white/40 dark:bg-black/40" />
    </div>
  )
}
