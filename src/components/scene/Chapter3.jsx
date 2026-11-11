import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Detailed } from '@react-three/drei'
import { Trees } from './Terrain'
import Stream from './Stream'
import ZilCastle, { ZilCastleLow } from './ZilCastle'
import Mist from './Mist'
import Hotspot from './Hotspot'
import { locationsOfChapter } from '../../lib/data'
import { mulberry32 } from '../../lib/world'

const region = [-32, 6, -34, 28]
const avoid = (x, z) => Math.hypot(x + 16, z + 16) < 11 || Math.hypot(x + 4, z - 20) < 5 || Math.hypot(x - 6, z - 6) < 4
const rocksArea = { minZ: -34, maxZ: 28 }

// Dere kenarı kayaları ve vadi yamaçları
function Rocks() {
  const ref = useRef()
  const n = 60
  useLayoutEffect(() => {
    const r = mulberry32(2)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    for (let i = 0; i < n; i++) {
      const s = 0.3 + r() * 0.8
      const x = r() < 0.5 ? 8.3 + r() * 0.8 : 13.7 + r() * 0.8
      const z = rocksArea.minZ + r() * (rocksArea.maxZ - rocksArea.minZ)
      q.setFromEuler(new THREE.Euler(r() * 3, r() * 3, r() * 3))
      m.compose(new THREE.Vector3(x, s * 0.3, z), q, new THREE.Vector3(s * 1.2, s * 0.8, s))
      ref.current.setMatrixAt(i, m)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <instancedMesh ref={ref} args={[null, null, n]} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#7c8083" flatShading roughness={1} />
    </instancedMesh>
  )
}

function Cliffs() {
  const list = useMemo(() => {
    const r = mulberry32(44)
    const out = []
    for (let i = 0; i < 12; i++) out.push({ p: [20 + r() * 8, 0, -40 + i * 7 + r() * 3], s: [10 + r() * 6, 22 + r() * 16, 10 + r() * 6] })
    for (let i = 0; i < 9; i++) out.push({ p: [-44 - r() * 6, 0, -40 + i * 9], s: [12 + r() * 6, 20 + r() * 14, 12 + r() * 6] })
    for (let i = 0; i < 8; i++) out.push({ p: [-40 + i * 11, 0, -52 - r() * 5], s: [12, 20 + r() * 14, 12] })
    return out
  }, [])
  return (
    <>
      {list.map((c, i) => (
        <mesh key={i} position={c.p} scale={c.s}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={i % 2 ? '#585e62' : '#4b5156'} roughness={1} flatShading />
        </mesh>
      ))}
    </>
  )
}

// BÖLÜM 3: Zilkale ve Doğa (Fırtına Vadisi)
export default function Chapter3() {
  const locs = locationsOfChapter(3)
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-10, 0, -5]}>
        <planeGeometry args={[110, 120]} />
        <meshStandardMaterial color="#58704a" roughness={1} />
      </mesh>
      <Cliffs />
      <Trees count={50} seed={61} region={region} avoid={avoid} crown="#24563a" />
      <Stream position={[11, 0.05, -3]} length={70} width={5} axis="z" speed={0.45} />
      <Rocks />
      <Detailed distances={[0, 50]}>
        <ZilCastle />
        <ZilCastleLow />
      </Detailed>
      <Mist />
      {locs.map((l) => (
        <Hotspot key={l.id} id={l.id} position={l.position} y={l.id === 'zilkale-duvarlari' ? 17.5 : 2} />
      ))}
    </>
  )
}
