import { useMemo } from 'react'
import * as THREE from 'three'
import StoneBox from './StoneBox'
import { makeStoneTexture } from '../../lib/textures'
import { BRIDGE } from '../../lib/world'

// Osmanlı dönemi kemer köprü: harçsız örülmüş taş kemer + yürüme yolu
export default function StoneBridge() {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: makeStoneTexture([168, 160, 146]), roughness: 1, flatShading: true }), [])
  const N = 12
  const segs = useMemo(() => {
    const L = BRIDGE.halfL, R = BRIDGE.rise
    const h = (z) => R * (1 - (z / L) ** 2)
    return Array.from({ length: N }, (_, i) => {
      const z0 = -L + (i / N) * 2 * L, z1 = -L + ((i + 1) / N) * 2 * L
      const zc = (z0 + z1) / 2
      const slope = (h(z1) - h(z0)) / (z1 - z0)
      return { z: zc, y: h(zc), len: ((z1 - z0) * 1.12) / Math.cos(Math.atan(slope)), rot: -Math.atan(slope) }
    })
  }, [])
  const archY = (BRIDGE.rise / 2.6)
  return (
    <group position={[BRIDGE.x, 0, BRIDGE.z]}>
      {segs.map((s, i) => (
        <group key={i} position={[0, s.y - 0.22, s.z]} rotation={[s.rot, 0, 0]}>
          <StoneBox size={[BRIDGE.halfW * 2 + 0.3, 0.44, s.len]} position={[0, 0, 0]} material={mat} />
          {[-1, 1].map((side) => (
            <StoneBox key={side} size={[0.32, 0.6, s.len]} position={[side * (BRIDGE.halfW + 0.02), 0.5, 0]} material={mat} />
          ))}
        </group>
      ))}
      {/* kemer halkaları */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (BRIDGE.halfW - 0.05), -0.05, 0]} rotation={[0, Math.PI / 2, 0]} scale={[1, archY, 1]} material={mat}>
          <torusGeometry args={[2.6, 0.3, 5, 14, Math.PI]} />
        </mesh>
      ))}
      {/* kıyı ayakları */}
      {[-1, 1].map((s) => (
        <StoneBox key={s} size={[BRIDGE.halfW * 2 + 0.3, 0.9, 1.6]} position={[0, 0.2, s * 3.4]} material={mat} />
      ))}
    </group>
  )
}
