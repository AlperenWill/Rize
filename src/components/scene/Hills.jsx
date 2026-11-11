import { useMemo } from 'react'
import { mulberry32 } from '../../lib/world'

// Uzaktaki düşük poligonlu tepeler halkası (sahne sınırının dışında)
export default function Hills({ seed = 5, color = '#2f6b3a', radius = 78, count = 18, height = 16 }) {
  const hills = useMemo(() => {
    const r = mulberry32(seed)
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2
      const d = radius + r() * 14
      return { p: [Math.cos(a) * d, 0, Math.sin(a) * d], s: [16 + r() * 12, height * (0.6 + r() * 0.8), 16 + r() * 12] }
    })
  }, [seed, count, radius, height])
  return (
    <>
      {hills.map((h, i) => (
        <mesh key={i} position={h.p} scale={h.s}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={color} roughness={1} flatShading />
        </mesh>
      ))}
    </>
  )
}
