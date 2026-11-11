import { useMemo, useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { makeCobbleTexture } from '../../lib/textures'
import { mulberry32 } from '../../lib/world'

// Zemin: çimen, taş meydan, kumsal, deniz, uzak yeşil tepeler
export default function Terrain() {
  const cobble = useMemo(() => {
    const t = makeCobbleTexture()
    t.repeat.set(10, 3)
    return t
  }, [])
  const sea = useRef()

  useFrame(({ clock }) => {
    sea.current.position.y = -0.3 + Math.sin(clock.elapsedTime * 0.8) * 0.06
  })

  const hills = useMemo(() => {
    const r = mulberry32(5)
    const list = []
    for (let i = 0; i < 16; i++) {
      list.push({ p: [-60 + i * 7.5 + r() * 4, 0, -48 - r() * 12], s: [14 + r() * 10, 7 + r() * 8, 14 + r() * 10], c: i % 3 })
    }
    for (let i = 0; i < 8; i++) {
      list.push({ p: [-50 - r() * 8, 0, -36 + i * 9], s: [12 + r() * 8, 6 + r() * 7, 12 + r() * 8], c: i % 3 })
    }
    return list
  }, [])
  const greens = ['#2f6b3a', '#285c33', '#3a7a42']

  return (
    <group>
      {/* çimen */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-18.5, 0, -2]}>
        <planeGeometry args={[83, 110]} />
        <meshStandardMaterial color="#3d7a45" roughness={1} />
      </mesh>
      {/* taş meydan ve iskele yolu */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.02, 5]}>
        <planeGeometry args={[26, 8]} />
        <meshStandardMaterial map={cobble} roughness={1} />
      </mesh>
      {/* kumsal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20.5, 0.015, -2]}>
        <planeGeometry args={[5, 60]} />
        <meshStandardMaterial color="#cdbb8f" roughness={1} />
      </mesh>
      {/* deniz */}
      <mesh ref={sea} rotation={[-Math.PI / 2, 0, 0]} position={[85, -0.3, 0]}>
        <planeGeometry args={[130, 220]} />
        <meshStandardMaterial color="#1d5f86" roughness={0.25} metalness={0.2} />
      </mesh>
      {/* düşük poligonlu tepeler */}
      {hills.map((h, i) => (
        <mesh key={i} position={h.p} scale={h.s}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={greens[h.c]} roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// Çam ağaçları — iki InstancedMesh (gövde + taç). region: [minX, maxX, minZ, maxZ]
const ch1Avoid = (x, z) =>
  (z > -1 && x > -4) || Math.hypot(x + 11, z + 9) < 9 || Math.hypot(x - 4, z - 14) < 6 || Math.hypot(x + 5, z - 4) < 7 || (x > -2 && z > -2)

export function Trees({ count = 46, seed = 99, region = [-34, 16, -30, 22], avoid = ch1Avoid, crown = '#2f7a43' }) {
  const trunks = useRef()
  const crowns = useRef()
  useLayoutEffect(() => {
    const r = mulberry32(seed)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    let n = 0
    let guard = 0
    while (n < count && guard++ < count * 60) {
      const x = region[0] + r() * (region[1] - region[0])
      const z = region[2] + r() * (region[3] - region[2])
      if (avoid(x, z)) continue
      const s = 0.8 + r() * 0.9
      m.compose(new THREE.Vector3(x, 0.9 * s, z), q, new THREE.Vector3(s, s, s))
      trunks.current.setMatrixAt(n, m)
      m.compose(new THREE.Vector3(x, 3.1 * s, z), q, new THREE.Vector3(s, s, s))
      crowns.current.setMatrixAt(n, m)
      n++
    }
    trunks.current.count = n
    crowns.current.count = n
    trunks.current.instanceMatrix.needsUpdate = true
    crowns.current.instanceMatrix.needsUpdate = true
  }, [count, seed, region, avoid])
  return (
    <>
      <instancedMesh ref={trunks} args={[null, null, count]} frustumCulled={false}>
        <cylinderGeometry args={[0.18, 0.26, 1.8, 5]} />
        <meshStandardMaterial color="#5a3d26" flatShading />
      </instancedMesh>
      <instancedMesh ref={crowns} args={[null, null, count]} frustumCulled={false}>
        <coneGeometry args={[1.3, 4, 6]} />
        <meshStandardMaterial color={crown} flatShading />
      </instancedMesh>
    </>
  )
}
