import Hills from './Hills'
import { Trees } from './Terrain'
import Stream from './Stream'
import StoneBridge from './StoneBridge'
import TeaField, { HeroTeaPlant } from './TeaField'
import Hotspot from './Hotspot'
import { locationsOfChapter } from '../../lib/data'

const region = [-30, 30, -30, 30]
const avoid = (x, z) => Math.abs(z + 4) < 6 || (z > 4 && z < 30 && Math.abs(x) < 30) || Math.hypot(x - 6, z + 4) < 6
const rim = [-60, 60, -60, 60]
const rimAvoid = (x, z) => Math.abs(x) < 32 && Math.abs(z) < 32

// BÖLÜM 2: Çay Bahçeleri (UNESCO teması)
export default function Chapter2() {
  const locs = locationsOfChapter(2)
  const plant = locs.find((l) => l.id === 'cay-bitkisi')
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[130, 130]} />
        <meshStandardMaterial color="#4f8a3a" roughness={1} />
      </mesh>
      {/* yürüyüş yolu */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0.02, 14]}>
        <planeGeometry args={[3, 32]} />
        <meshStandardMaterial color="#8a7556" roughness={1} />
      </mesh>
      <Hills seed={12} color="#3b7a35" />
      <Trees count={60} seed={4} region={rim} avoid={rimAvoid} crown="#2c6e3b" />
      <Trees count={14} seed={8} region={region} avoid={avoid} crown="#2c6e3b" />
      <Stream position={[0, 0.06, -4]} length={90} width={5.2} axis="x" />
      <StoneBridge />
      <TeaField />
      <HeroTeaPlant position={plant.position} />
      {locs.map((l) => (
        <Hotspot key={l.id} id={l.id} position={l.position} y={l.id === 'tas-kopru' ? 3 : 2.1} />
      ))}
    </>
  )
}
