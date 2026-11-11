import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { makeWaterTexture } from '../../lib/textures'

// Akan dere: kaydırılan doku ile hareket hissi. axis: 'x' (doğu-batı) veya 'z' (kuzey-güney)
export default function Stream({ position, length = 90, width = 5, axis = 'x', speed = 0.25 }) {
  const tex = useMemo(() => {
    const t = makeWaterTexture()
    t.repeat.set(length / 6, width / 6)
    return t
  }, [length, width])
  useFrame((_, dt) => { tex.offset.x -= dt * speed })
  return (
    <mesh rotation={[-Math.PI / 2, 0, axis === 'z' ? Math.PI / 2 : 0]} position={position}>
      <planeGeometry args={[length, width]} />
      <meshStandardMaterial map={tex} roughness={0.2} metalness={0.15} />
    </mesh>
  )
}
