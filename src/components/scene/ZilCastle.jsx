import { useMemo } from 'react'
import * as THREE from 'three'
import StoneBox from './StoneBox'
import { makeStoneTexture } from '../../lib/textures'
import { ZIL } from '../../lib/world'

const CLIFF_H = 13

// Zilkale: kayalık üzerinde 14. yüzyıl kalesi (duvarlar + iki kule)
export default function ZilCastle() {
  const wall = useMemo(() => new THREE.MeshStandardMaterial({ map: makeStoneTexture([160, 154, 140]), roughness: 1, flatShading: true }), [])
  const rock = useMemo(() => new THREE.MeshStandardMaterial({ color: '#6f7377', roughness: 1, flatShading: true }), [])
  const N = 7
  return (
    <group position={[ZIL.x, 0, ZIL.z]}>
      {/* kayalık */}
      <mesh position={[0, CLIFF_H / 2, 0]} material={rock}>
        <cylinderGeometry args={[5.6, 8.6, CLIFF_H, 7]} />
      </mesh>
      <mesh position={[4, 3.5, 3]} scale={[4, 4, 4]} material={rock}>
        <dodecahedronGeometry args={[1, 0]} />
      </mesh>
      {/* çevre duvarı (bir parçası yıkık) */}
      <group position={[0, CLIFF_H, 0]}>
        {Array.from({ length: N }).map((_, i) => {
          if (i === 5) return null
          const a = (i / N) * Math.PI * 2
          const R = 4.4
          const len = 2 * R * Math.sin(Math.PI / N) + 0.2
          return (
            <StoneBox
              key={i}
              size={[len, i === 2 ? 2.2 : 3.2, 0.9]}
              position={[Math.cos(a) * R, (i === 2 ? 1.1 : 1.6), Math.sin(a) * R]}
              rotation={[0, -a - Math.PI / 2 + Math.PI / N, 0]}
              material={wall}
            />
          )
        })}
        {/* ana kule */}
        <mesh position={[-1, 4, -1.5]} material={wall}>
          <cylinderGeometry args={[1.7, 2, 8, 8]} />
        </mesh>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          if (i === 3) return null
          const a = (i / 8) * Math.PI * 2
          return (
            <mesh key={i} position={[-1 + Math.cos(a) * 1.6, 8.35, -1.5 + Math.sin(a) * 1.6]} rotation={[0, -a, 0]} material={wall}>
              <boxGeometry args={[0.5, 0.7, 0.85]} />
            </mesh>
          )
        })}
        {/* küçük kule */}
        <mesh position={[3, 2.2, 1.6]} material={wall}>
          <cylinderGeometry args={[1.1, 1.3, 4.4, 7]} />
        </mesh>
      </group>
    </group>
  )
}

// Uzaktan görünüm için basit (LOD) kale
export function ZilCastleLow() {
  return (
    <group position={[ZIL.x, 0, ZIL.z]}>
      <mesh position={[0, CLIFF_H / 2, 0]}>
        <cylinderGeometry args={[5.6, 8.6, CLIFF_H, 5]} />
        <meshStandardMaterial color="#6f7377" flatShading />
      </mesh>
      <mesh position={[0, CLIFF_H + 3, 0]}>
        <cylinderGeometry args={[4.4, 4.4, 6, 6]} />
        <meshStandardMaterial color="#a39d8d" flatShading />
      </mesh>
    </group>
  )
}
