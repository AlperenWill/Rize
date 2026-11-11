import Terrain, { Trees } from './Terrain'
import Castle from './Castle'
import Pier from './Pier'
import Hotspot from './Hotspot'
import { locationsOfChapter } from '../../lib/data'

// BÖLÜM 1: Rize Sahili ve Tarihi Kale
export default function Chapter1() {
  const locs = locationsOfChapter(1)
  return (
    <>
      <Terrain />
      <Trees />
      <Castle position={locs.find((l) => l.id === 'rize-kalesi').position} />
      <Pier />
      {locs.map((l) => (
        <Hotspot key={l.id} id={l.id} position={l.position} y={l.id === 'tarihi-iskele' ? 2.2 : 3} />
      ))}
    </>
  )
}
