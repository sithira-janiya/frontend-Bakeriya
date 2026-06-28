import { Canvas } from '@react-three/fiber'
import { Float, PresentationControls, ContactShadows } from '@react-three/drei'
import { useTheme } from '../../context/ThemeContext.jsx'
import { Donut, Cupcake, Macaron } from './BakeryShapes.jsx'

/**
 * Interactive 3D hero centerpiece for the Home page. Drag to tip the treats
 * (PresentationControls); they idle-float otherwise. Self-contained — drop it
 * in a sized container.
 */
export default function HeroScene() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <ambientLight intensity={dark ? 0.5 : 0.9} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} castShadow />
      <pointLight position={[-4, -2, 3]} intensity={0.6} color="#e8702a" />

      <PresentationControls
        global
        snap
        polar={[-0.3, 0.3]}
        azimuth={[-0.7, 0.7]}
        config={{ mass: 1, tension: 200, friction: 26 }}
      >
        <Float speed={2} rotationIntensity={1.1} floatIntensity={1.8}>
          <Cupcake position={[-1.7, 0.1, 0]} scale={0.85} rotation={[0.1, 0.3, 0]} />
          <Donut position={[1.4, 0.5, -0.3]} scale={1} rotation={[0.4, 0, 0.2]} />
          <Macaron position={[0.2, -1.1, 0.6]} scale={0.9} rotation={[0.2, 0.4, 0]} />
        </Float>
      </PresentationControls>

      <ContactShadows position={[0, -2, 0]} opacity={dark ? 0.25 : 0.35} blur={2.6} scale={11} far={4} />
    </Canvas>
  )
}
