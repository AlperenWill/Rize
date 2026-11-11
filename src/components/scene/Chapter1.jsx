import { Detailed } from '@react-three/drei'
import Terrain, { Trees } from './Terrain'
import Castle, { CastleLow } from './Castle'
import Pier from './Pier'
import Hotspot from './Hotspot'
import { locationsOfChapter } from '../../lib/data'

// BÖLÜM 1: Rize Sahili ve Tarihi Kale
export default function Chapter1() {
  const locs = locationsOfChapter(1)
  const castlePos = locs.find((l) => l.id === 'rize-kalesi').position
  return (
    <>
      <Terrain />
      <Trees />
      <Detailed distances={[0, 55]}>
        <Castle position={castlePos} />
        <CastleLow position={castlePos} />
      </Detailed>
      <Pier />
      {locs.map((l) => (
        <Hotspot key={l.id} id={l.id} position={l.position} y={l.id === 'tarihi-iskele' ? 2.2 : 3} />
      ))}
    </>
  )
}
