import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'
import { mulberry32 } from '../../lib/world'

// Çay sıraları — tek InstancedMesh ile ~650 çalı (az draw call)
const rowsSouth = [6, 9.2, 12.4, 15.6, 18.8, 22, 25.2, 28]
const rowsNorth = [-10, -13.2, -16.4, -19.6, -22.8, -26]

export default function TeaField() {
  const ref = useRef()
  const count = 700
  useLayoutEffect(() => {
    const r = mulberry32(31)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const col = new THREE.Color()
    let n = 0
    for (const z of [...rowsSouth, ...rowsNorth]) {
      for (let x = -29; x <= 29; x += 1.15) {
        if (x > 4 && x < 8) continue // yürüyüş yolu
        if (Math.hypot(x + 8, z - 10) < 3.2) continue // incelenecek çay bitkisi
        if (n >= count) break
        const s = 0.8 + r() * 0.3
        m.compose(new THREE.Vector3(x + (r() - 0.5) * 0.15, 0.35 * s, z + (r() - 0.5) * 0.2), q, new THREE.Vector3(1.0 * s, 0.7 * s, 0.9 * s))
        ref.current.setMatrixAt(n, m)
        col.setHSL(0.3 + r() * 0.03, 0.55, 0.26 + r() * 0.07)
        ref.current.setColorAt(n, col)
        n++
      }
    }
    ref.current.count = n
    ref.current.instanceMatrix.needsUpdate = true
    ref.current.instanceColor.needsUpdate = true
  }, [])
  return (
    <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}>
      <icosahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial flatShading roughness={1} />
    </instancedMesh>
  )
}

// Incelenecek çay bitkisi: büyük çalı, açık yeşil körpe sürgünler ve hasır sepet
export function HeroTeaPlant({ position }) {
  const tips = [[0.7, 1.05, 0.2], [-0.4, 1.2, 0.5], [0.1, 1.3, -0.6], [-0.8, 1.0, -0.2], [0.5, 1.15, -0.5]]
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} scale={[1.4, 0.9, 1.3]}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#2a6b2c" flatShading roughness={1} />
      </mesh>
      {tips.map((t, i) => (
        <mesh key={i} position={t} scale={0.24}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#9be05d" flatShading emissive="#3b6a1c" emissiveIntensity={0.4} />
        </mesh>
      ))}
      <mesh position={[1.9, 0.38, 0.6]}>
        <cylinderGeometry args={[0.5, 0.36, 0.76, 10, 1, true]} />
        <meshStandardMaterial color="#b98a4e" side={2} flatShading />
      </mesh>
      <mesh position={[1.9, 0.62, 0.6]}>
        <sphereGeometry args={[0.42, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5ea030" flatShading />
      </mesh>
    </group>
  )
}
