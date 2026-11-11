import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Sky } from '@react-three/drei'
import Player from './Player'
import Chapter1 from './Chapter1'
import Chapter2 from './Chapter2'
import Chapter3 from './Chapter3'
import { useGameStore } from '../../store/useGameStore'

// Her bölümün atmosferi
const MOODS = {
  1: { fog: '#a9c7d6', near: 35, far: 120, hemi: 1.6, sun: 2.6, sunColor: '#fff1d6', sky: [60, 40, -30] },
  2: { fog: '#bcd8c2', near: 30, far: 110, hemi: 1.5, sun: 2.3, sunColor: '#fff4dc', sky: [-40, 50, 30] },
  3: { fog: '#aab6ba', near: 8, far: 62, hemi: 1.35, sun: 1.2, sunColor: '#dfe8ee', sky: [20, 15, -50] },
}
const CHAPTERS = { 1: Chapter1, 2: Chapter2, 3: Chapter3 }

export default function Experience() {
  const chapter = useGameStore((s) => s.chapter)
  const m = MOODS[chapter]
  const Chapter = CHAPTERS[chapter]
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 70, near: 0.1, far: 220, position: [4, 1.7, 14] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.6 }}
    >
      <color attach="background" args={[m.fog]} />
      <fog attach="fog" args={[m.fog, m.near, m.far]} />
      <Sky distance={4000} sunPosition={m.sky} turbidity={chapter === 3 ? 12 : 6} rayleigh={chapter === 3 ? 0.6 : 1.4} />
      <hemisphereLight args={['#cfe6ff', '#4a6b44', m.hemi]} />
      <directionalLight position={[40, 50, -20]} intensity={m.sun} color={m.sunColor} />
      <AdaptiveDpr pixelated={false} />
      <Chapter key={chapter} />
      <Player />
    </Canvas>
  )
}
