import { useMemo } from 'react'
import * as THREE from 'three'
import StoneBox from './StoneBox'
import { makeStoneTexture } from '../../lib/textures'
import { mulberry32 } from '../../lib/world'

// Rize Kalesi — Bizans dönemi kalıntıları (düşük poligonlu, prosedürel)
export default function Castle({ position = [-11, 0, -9] }) {
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ map: makeStoneTexture(), roughness: 0.95, flatShading: true }), [])
  const matDark = useMemo(() => new THREE.MeshStandardMaterial({ map: makeStoneTexture([124, 119, 108]), roughness: 1, flatShading: true }), [])
  const rubble = useMemo(() => {
    const r = mulberry32(11)
    return Array.from({ length: 14 }, () => {
      const a = r() * Math.PI * 2
      const d = 4.6 + r() * 2.4
      const s = 0.25 + r() * 0.55
      return { p: [Math.cos(a) * d, s / 2, Math.sin(a) * d], s: [s * 1.3, s, s], rot: [r(), r() * 3, r()] }
    })
  }, [])

  const T = 1 // duvar kalınlığı
  return (
    <group position={position}>
      {/* Ön duvar — kapı boşluğu */}
      <StoneBox size={[3.2, 4, T]} position={[-2.4, 2, 3.5]} material={mat} />
      <StoneBox size={[3.2, 2.6, T]} position={[2.4, 1.3, 3.5]} material={mat} />
      <StoneBox size={[2, 0.9, T]} position={[0, 4.35, 3.5]} material={matDark} />
      {/* Arka duvar */}
      <StoneBox size={[8, 4.6, T]} position={[0, 2.3, -3.5]} material={mat} />
      {/* Sol duvar (kırık) */}
      <StoneBox size={[T, 3.4, 4.2]} position={[-4, 1.7, 1.2]} material={mat} />
      <StoneBox size={[T, 2, 3]} position={[-4, 1, -1.9]} material={matDark} />
      {/* Sağ duvar (yıkık) */}
      <StoneBox size={[T, 2, 4]} position={[4, 1, -1.2]} material={mat} />
      <StoneBox size={[T, 0.8, 2.4]} position={[4, 0.4, 2.2]} material={matDark} />

      {/* Yuvarlak gözetleme kulesi */}
      <mesh position={[-4, 3.6, -3.5]} material={mat}>
        <cylinderGeometry args={[1.7, 1.9, 7.2, 8]} />
      </mesh>
      {Array.from({ length: 8 }).map((_, i) => {
        if (i === 2 || i === 5) return null // kırık siperlikler
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} position={[-4 + Math.cos(a) * 1.55, 7.55, -3.5 + Math.sin(a) * 1.55]} rotation={[0, -a, 0]} material={matDark}>
            <boxGeometry args={[0.5, 0.7, 0.8]} />
          </mesh>
        )
      })}
      {/* Kule penceresi */}
      <mesh position={[-4 + 1.62, 5.2, -3.5]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 0.9]} />
        <meshBasicMaterial color="#05060a" />
      </mesh>

      {/* Duvar üstü siperlikleri (arka duvar) */}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) =>
        i === 3 ? null : <StoneBox key={x} size={[0.8, 0.7, T]} position={[x, 4.95, -3.5]} material={matDark} />,
      )}

      {/* Moloz parçaları */}
      {rubble.map((r, i) => (
        <mesh key={i} position={r.p} rotation={r.rot} scale={r.s} material={matDark}>
          <dodecahedronGeometry args={[1, 0]} />
        </mesh>
      ))}

      {/* İç zemin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[3.6, 8]} />
        <meshStandardMaterial color="#6e6a5e" roughness={1} flatShading />
      </mesh>
    </group>
  )
}
