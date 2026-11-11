import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, Sky } from '@react-three/drei'
import Player from './Player'
import Chapter1 from './Chapter1'

const FOG = '#a9c7d6'

export default function Experience() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 70, near: 0.1, far: 220, position: [4, 1.7, 14] }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      performance={{ min: 0.6 }}
    >
      <color attach="background" args={[FOG]} />
      <fog attach="fog" args={[FOG, 35, 120]} />
      <Sky distance={4000} sunPosition={[60, 40, -30]} turbidity={6} rayleigh={1.4} />
      <hemisphereLight args={['#cfe6ff', '#4a6b44', 1.6]} />
      <directionalLight position={[40, 50, -20]} intensity={2.6} color="#fff1d6" />
      <AdaptiveDpr pixelated={false} />
      <Chapter1 />
      <Player />
    </Canvas>
  )
}
