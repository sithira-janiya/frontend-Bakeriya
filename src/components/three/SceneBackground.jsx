import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext.jsx'
import { BAKERY_SHAPES } from './BakeryShapes.jsx'

/**
 * Site-wide ambient 3D layer: a fixed, non-interactive canvas of slowly
 * floating bakery primitives that sits behind every page (mounted once in
 * Layout). Theme-aware lighting; clamped DPR to stay light on mobile.
 */
export default function SceneBackground() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  const items = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
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
    []
  )

  return (
    <div aria-hidden className="fixed inset-0 -z-[1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
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
    </div>
  )
}
