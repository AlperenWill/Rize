import { useMemo } from 'react'
import * as THREE from 'three'

// Boyutuna göre doku tekrarı ayarlanan kutu: taş örgüsü her yüzde aynı ölçekte görünür.
export default function StoneBox({ size, position, rotation, material, tile = 2 }) {
  const geo = useMemo(() => {
    const [w, h, d] = size
    const g = new THREE.BoxGeometry(w, h, d)
    const uv = g.attributes.uv
    const faces = [
      [d, h], [d, h], // +x, -x
      [w, d], [w, d], // +y, -y
      [w, h], [w, h], // +z, -z
    ]
    faces.forEach(([a, b], f) => {
      for (let i = 0; i < 4; i++) {
        const idx = f * 4 + i
        uv.setXY(idx, (uv.getX(idx) * a) / tile, (uv.getY(idx) * b) / tile)
      }
    })
    return g
  }, [size, tile])
  return <mesh geometry={geo} material={material} position={position} rotation={rotation} />
}
