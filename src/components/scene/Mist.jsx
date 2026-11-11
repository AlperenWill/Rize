import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { makeMistTexture, } from '../../lib/textures'
import { mulberry32 } from '../../lib/world'

// Vadiyi saran yavaş akan sis katmanları
export default function Mist({ count = 14 }) {
  const tex = useMemo(() => makeMistTexture(), [])
  const items = useMemo(() => {
    const r = mulberry32(17)
    return Array.from({ length: count }, () => ({
      p: [-30 + r() * 50, 1 + r() * 9, -30 + r() * 55],
      s: 14 + r() * 18,
      sp: 0.1 + r() * 0.25,
    }))
  }, [count])
  const refs = useRef([])
  useFrame((_, dt) => {
    refs.current.forEach((m, i) => {
      if (!m) return
      m.position.x += items[i].sp * dt
      if (m.position.x > 30) m.position.x = -34
    })
  })
  return (
    <>
      {items.map((it, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)} position={it.p} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[it.s, it.s]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} opacity={0.8} />
        </mesh>
      ))}
    </>
  )
}
