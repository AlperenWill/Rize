import { useLayoutEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { makeWoodTexture } from '../../lib/textures'

const START_X = 21
const LENGTH = 13
const Z = 3

// Tarihi İskele — InstancedMesh ile tahta ve kazıklar (az draw call)
export default function Pier() {
  const planks = useRef()
  const posts = useRef()
  const tex = useMemo(() => {
    const t = makeWoodTexture()
    return t
  }, [])
  const plankCount = Math.floor(LENGTH / 0.42)
  const postCount = 2 * 8

  useLayoutEffect(() => {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const s = new THREE.Vector3(1, 1, 1)
    for (let i = 0; i < plankCount; i++) {
      const x = START_X + 0.21 + i * 0.42
      m.compose(new THREE.Vector3(x, 0.55, Z), q, s)
      planks.current.setMatrixAt(i, m)
    }
    planks.current.instanceMatrix.needsUpdate = true
    let k = 0
    for (let i = 0; i < 8; i++) {
      for (const side of [-1, 1]) {
        const x = START_X + 0.4 + i * (LENGTH / 7.2)
        m.compose(new THREE.Vector3(x, -0.4, Z + side * 1.35), q, s)
        posts.current.setMatrixAt(k++, m)
      }
    }
    posts.current.instanceMatrix.needsUpdate = true
  }, [plankCount])

  return (
    <group>
      <instancedMesh ref={planks} args={[null, null, plankCount]}>
        <boxGeometry args={[0.38, 0.14, 2.9]} />
        <meshStandardMaterial map={tex} roughness={0.9} flatShading />
      </instancedMesh>
      <instancedMesh ref={posts} args={[null, null, postCount]}>
        <cylinderGeometry args={[0.14, 0.17, 2.4, 6]} />
        <meshStandardMaterial color="#4a3320" roughness={1} flatShading />
      </instancedMesh>
      {/* Bağlama babaları */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[START_X + 3 + i * 4.5, 0.85, Z + (i % 2 ? -1.15 : 1.15)]}>
          <cylinderGeometry args={[0.1, 0.13, 0.5, 6]} />
          <meshStandardMaterial color="#2c2d30" flatShading />
        </mesh>
      ))}
      {/* Fener direği */}
      <mesh position={[START_X + LENGTH - 0.3, 1.9, Z]}>
        <cylinderGeometry args={[0.06, 0.08, 2.6, 6]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[START_X + LENGTH - 0.3, 3.3, Z]}>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshBasicMaterial color="#ffd48a" />
      </mesh>
    </group>
  )
}
