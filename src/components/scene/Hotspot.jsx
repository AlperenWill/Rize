import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../../store/useGameStore'

// Nefes alan kırmızı daire — önemli nesnelerin işareti
export default function Hotspot({ id, position, y = 2.4 }) {
  const group = useRef()
  const ring = useRef()
  const core = useRef()
  const discovered = useGameStore((s) => s.discovered.includes(id))
  const active = useGameStore((s) => s.activeId === id)

  useFrame(({ camera, clock }) => {
    if (!group.current) return
    const t = clock.elapsedTime
    group.current.quaternion.copy(camera.quaternion) // her zaman kameraya dönük
    const breath = (Math.sin(t * 2.4) + 1) / 2
    ring.current.scale.setScalar(1 + breath * 0.9)
    ring.current.material.opacity = 0.65 * (1 - breath)
    core.current.scale.setScalar(0.9 + breath * 0.15)
  })

  if (active) return null
  const color = discovered ? '#3fbf7f' : '#F04448'

  return (
    <group position={[position[0], y, position[2]]}>
      <group ref={group}>
        <mesh ref={core} renderOrder={20}>
          <circleGeometry args={[0.38, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.92} depthTest={false} depthWrite={false} />
        </mesh>
        <mesh ref={ring} renderOrder={19}>
          <ringGeometry args={[0.5, 0.62, 32]} />
          <meshBasicMaterial color={color} transparent depthTest={false} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}
