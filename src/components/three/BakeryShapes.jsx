import { RoundedBox } from '@react-three/drei'

/**
 * Reusable bakery treats built entirely from Three.js primitives (no asset
 * files). Each accepts the usual mesh/group props (position, scale, rotation),
 * so they can be scattered in the background scene or featured in the hero.
 */

export function Donut({ color = '#7a4a2b', glaze = '#e8702a', ...props }) {
  return (
    <group {...props}>
      <mesh>
        <torusGeometry args={[0.7, 0.32, 24, 48]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* glaze cap */}
      <mesh position={[0, 0.14, 0]} scale={[1, 0.7, 1]}>
        <torusGeometry args={[0.7, 0.3, 24, 48]} />
        <meshStandardMaterial color={glaze} roughness={0.25} metalness={0.1} />
      </mesh>
    </group>
  )
}

export function Cupcake({ cream = '#f7c0cb', ...props }) {
  return (
    <group {...props}>
      {/* wrapper */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.5, 0.36, 0.6, 24]} />
        <meshStandardMaterial color="#c98a3b" roughness={0.8} />
      </mesh>
      {/* swirl */}
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[0.56, 0.95, 24]} />
        <meshStandardMaterial color={cream} roughness={0.45} />
      </mesh>
      {/* cherry */}
      <mesh position={[0, 0.78, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#d6551a" roughness={0.3} />
      </mesh>
    </group>
  )
}

export function Macaron({ shell = '#9be7c4', ...props }) {
  return (
    <group {...props}>
      <mesh position={[0, 0.2, 0]} scale={[1, 0.5, 1]}>
        <sphereGeometry args={[0.6, 32, 24]} />
        <meshStandardMaterial color={shell} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.2, 0]} scale={[1, 0.5, 1]}>
        <sphereGeometry args={[0.6, 32, 24]} />
        <meshStandardMaterial color={shell} roughness={0.55} />
      </mesh>
      {/* filling */}
      <mesh>
        <cylinderGeometry args={[0.56, 0.56, 0.2, 32]} />
        <meshStandardMaterial color="#fff4e0" roughness={0.4} />
      </mesh>
    </group>
  )
}

export function Loaf({ color = '#b5773c', ...props }) {
  return (
    <group {...props}>
      <RoundedBox args={[1.5, 0.8, 0.85]} radius={0.32} smoothness={4}>
        <meshStandardMaterial color={color} roughness={0.7} />
      </RoundedBox>
    </group>
  )
}

export const BAKERY_SHAPES = [Donut, Cupcake, Macaron, Loaf]
