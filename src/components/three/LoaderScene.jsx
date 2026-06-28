import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTheme } from '../../context/ThemeContext.jsx'

/**
 * 3D port of the CookingScene: a chef leaning over a steaming soup pot, dipping
 * the spoon in and lifting it to taste. Same palette and motion arc as the SVG
 * (spoon dwells in the pot, swings up to the mouth, holds, swings back). Built
 * from Three.js primitives — no asset files. Non-interactive.
 */

const COL = {
  skin: '#f0c498',
  white: '#ffffff',
  trim: '#e3d9c8',
  potDark: '#6f4422',
  potRim: '#8c5524',
  soup: '#e8702a',
  steam: '#f3ddb3',
  button: '#d6551a',
  bubbleA: '#e9c485',
  bubbleB: '#cc8a3a',
  spoon: '#dfe3e6',
  face: '#5c391f'
}

const lerp = (a, b, t) => a + (b - a) * t
const smooth = (t) => t * t * (3 - 2 * t)

// Arm pivots at the shoulder; spoon dips in the pot then retracts up to taste.
const DIP_ANGLE = -2.53
const TASTE_ANGLE = 0.726

function Pot() {
  return (
    <group position={[-0.6, -1.15, 0]}>
      <mesh>
        <cylinderGeometry args={[0.8, 0.62, 1.0, 32]} />
        <meshStandardMaterial color={COL.potDark} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.14, 32]} />
        <meshStandardMaterial color={COL.potRim} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.06, 32]} />
        <meshStandardMaterial color={COL.soup} roughness={0.3} />
      </mesh>
      <mesh position={[0.84, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.13, 0.05, 12, 20, Math.PI]} />
        <meshStandardMaterial color={COL.potDark} />
      </mesh>
      <mesh position={[-0.84, 0.25, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.13, 0.05, 12, 20, Math.PI]} />
        <meshStandardMaterial color={COL.potDark} />
      </mesh>
    </group>
  )
}

function Bubbles() {
  const refs = [useRef(), useRef(), useRef()]
  useFrame(({ clock }) => {
    refs.forEach((r, i) => {
      if (r.current) {
        const s = 0.06 + Math.abs(Math.sin(clock.elapsedTime * 2 + i)) * 0.05
        r.current.scale.setScalar(s)
      }
    })
  })
  const pos = [
    [-0.18, 0, -0.05],
    [0, 0, 0.08],
    [0.16, 0, -0.02]
  ]
  return (
    <group position={[-0.6, -0.62, 0]}>
      {pos.map((p, i) => (
        <mesh key={i} ref={refs[i]} position={p}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={i % 2 ? COL.bubbleB : COL.bubbleA} roughness={0.4} />
        </mesh>
      ))}
    </group>
  )
}

function Steam() {
  const refs = [useRef(), useRef(), useRef()]
  useFrame(({ clock }) => {
    refs.forEach((r, i) => {
      if (!r.current) return
      const t = (clock.elapsedTime * 0.5 + i * 0.33) % 1
      r.current.position.y = -0.55 + t * 1.05
      r.current.position.x = -0.6 + (i - 1) * 0.2 + Math.sin(t * 6 + i) * 0.08
      r.current.scale.setScalar(0.1 + t * 0.13)
      r.current.material.opacity = Math.sin(t * Math.PI) * 0.6
    })
  })
  return (
    <>
      {refs.map((r, i) => (
        <mesh key={i} ref={r}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color={COL.steam} transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </>
  )
}

function Chef() {
  return (
    <group position={[0.9, -0.3, 0]} rotation={[0, 0, 0.1]}>
      {/* torso */}
      <mesh position={[0, 0.05, 0]}>
        <capsuleGeometry args={[0.45, 0.6, 8, 16]} />
        <meshStandardMaterial color={COL.white} roughness={0.8} />
      </mesh>
      {/* button placket */}
      {[0.25, 0.0, -0.25].map((y) => (
        <mesh key={y} position={[0, y, 0.42]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial color={COL.button} />
        </mesh>
      ))}
      {/* head */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color={COL.skin} roughness={0.6} />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.13, 1.02, 0.37]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={COL.face} />
      </mesh>
      <mesh position={[0.13, 1.02, 0.37]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={COL.face} />
      </mesh>
      {/* mouth (slightly open, tasting) */}
      <mesh position={[0, 0.85, 0.38]} scale={[1.4, 1, 0.6]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color={COL.face} />
      </mesh>
      {/* hat brim + puff */}
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.14, 24]} />
        <meshStandardMaterial color={COL.white} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.6, 0]} scale={[1, 0.8, 1]}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshStandardMaterial color={COL.white} roughness={0.8} />
      </mesh>
    </group>
  )
}

function ArmSpoon() {
  const arm = useRef()
  useFrame(({ clock }) => {
    if (!arm.current) return
    const period = 3.2
    const tt = (clock.elapsedTime % period) / period
    let k
    if (tt < 0.1) k = 0
    else if (tt < 0.45) k = smooth((tt - 0.1) / 0.35)
    else if (tt < 0.6) k = 1
    else if (tt < 0.95) k = 1 - smooth((tt - 0.6) / 0.35)
    else k = 0
    arm.current.rotation.z = lerp(DIP_ANGLE, TASTE_ANGLE, k)
    arm.current.scale.x = lerp(1, 0.6, k) // elbow retract so the spoon reaches the mouth
  })
  return (
    <group ref={arm} position={[0.45, 0.1, 0.25]}>
      {/* shoulder joint */}
      <mesh>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={COL.white} roughness={0.8} />
      </mesh>
      {/* sleeve */}
      <mesh position={[0.7, 0, 0]}>
        <boxGeometry args={[1.4, 0.2, 0.2]} />
        <meshStandardMaterial color={COL.white} roughness={0.8} />
      </mesh>
      {/* hand */}
      <mesh position={[1.4, 0, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={COL.skin} roughness={0.6} />
      </mesh>
      {/* spoon handle */}
      <mesh position={[1.62, 0, 0]}>
        <boxGeometry args={[0.35, 0.05, 0.05]} />
        <meshStandardMaterial color={COL.spoon} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* spoon bowl */}
      <mesh position={[1.85, 0, 0]} scale={[1, 0.5, 1.2]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color={COL.spoon} metalness={0.3} roughness={0.4} />
      </mesh>
    </group>
  )
}

function Scene() {
  const group = useRef()
  useFrame(({ clock }) => {
    if (group.current) group.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.06
  })
  return (
    <group ref={group}>
      <Pot />
      <Bubbles />
      <Steam />
      <Chef />
      <ArmSpoon />
    </group>
  )
}

export default function LoaderScene() {
  const { theme } = useTheme()
  const dark = theme === 'dark'

  return (
    <div aria-hidden className="h-48 w-48 sm:h-56 sm:w-56 pointer-events-none">
      <Canvas camera={{ position: [0, 0.2, 6], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={dark ? 0.55 : 0.95} />
        <directionalLight position={[4, 6, 5]} intensity={1.1} />
        <pointLight position={[-4, 1, 3]} intensity={0.5} color={COL.soup} />
        <Scene />
      </Canvas>
    </div>
  )
}
