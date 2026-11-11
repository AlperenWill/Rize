import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { input, playerState } from '../../lib/input'
import { useGameStore } from '../../store/useGameStore'
import { locationById, locationsOfChapter } from '../../lib/data'
import { START, EYE_HEIGHT, resolvePosition } from '../../lib/world'

const WALK = 4.2
const RUN = 7
const MOUSE_SENS = 0.0022
const TOUCH_SENS = 0.0042
const PITCH_LIMIT = 1.2

const angleDelta = (a, b) => {
  let d = b - a
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return d
}

// Birinci şahıs gözlemci: WASD + fare / sanal joystick + dokunmatik bakış, sinematik mod
export default function Player() {
  const { camera, gl } = useThree()
  const yaw = useRef(START.yaw)
  const pitch = useRef(0)
  const pos = useRef({ x: START.x, z: START.z, y: EYE_HEIGHT })
  const bob = useRef(0)
  const lastProx = useRef(0)

  // Klavye + fare
  useEffect(() => {
    const keyMap = { KeyW: 'w', ArrowUp: 'w', KeyA: 'a', ArrowLeft: 'a', KeyS: 's', ArrowDown: 's', KeyD: 'd', ArrowRight: 'd', ShiftLeft: 'shift' }
    const down = (e) => {
      const k = keyMap[e.code]
      if (k) input.keys[k] = true
      if (e.code === 'KeyE') {
        const { nearbyId, activeId, inspect } = useGameStore.getState()
        if (nearbyId && !activeId) {
          document.exitPointerLock?.()
          inspect(nearbyId)
        }
      }
      if (e.code === 'KeyJ') {
        document.exitPointerLock?.()
        useGameStore.getState().toggleJournal()
      }
    }
    const up = (e) => {
      const k = keyMap[e.code]
      if (k) input.keys[k] = false
    }
    const move = (e) => {
      if (document.pointerLockElement === gl.domElement) {
        input.lookDelta.x += e.movementX
        input.lookDelta.y += e.movementY
      }
    }
    const click = () => {
      const s = useGameStore.getState()
      if (s.started && !s.activeId && !s.journalOpen && !s.showCertificate && !('ontouchstart' in window)) {
        gl.domElement.requestPointerLock?.()
      }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    document.addEventListener('mousemove', move)
    gl.domElement.addEventListener('click', click)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      document.removeEventListener('mousemove', move)
      gl.domElement.removeEventListener('click', click)
    }
  }, [gl])

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05)
    const { activeId, started, chapter } = useGameStore.getState()
    const lookSens = 'ontouchstart' in window ? TOUCH_SENS : MOUSE_SENS

    if (activeId) {
      // Sinematik mod: en iyi açıya yumuşakça süz
      const loc = locationById[activeId]
      const [cx, cy, cz] = loc.camera.position
      const [lx, ly, lz] = loc.camera.lookAt
      const k = 1 - Math.pow(0.0015, dt)
      pos.current.x += (cx - pos.current.x) * k
      pos.current.z += (cz - pos.current.z) * k
      pos.current.y += (cy - pos.current.y) * k
      const dx = lx - pos.current.x, dy = ly - pos.current.y, dz = lz - pos.current.z
      const ty = Math.atan2(-dx, -dz)
      const tp = Math.atan2(dy, Math.hypot(dx, dz))
      yaw.current += angleDelta(yaw.current, ty) * k
      pitch.current += (tp - pitch.current) * k
      input.lookDelta.x = input.lookDelta.y = 0
    } else if (started) {
      // Bakış
      yaw.current -= input.lookDelta.x * lookSens
      pitch.current -= input.lookDelta.y * lookSens
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current))
      input.lookDelta.x = input.lookDelta.y = 0

      // Hareket
      let mx = input.joystick.x + (input.keys.d ? 1 : 0) - (input.keys.a ? 1 : 0)
      let mz = input.joystick.y + (input.keys.w ? 1 : 0) - (input.keys.s ? 1 : 0)
      const len = Math.hypot(mx, mz)
      if (len > 1) { mx /= len; mz /= len }
      const speed = (input.keys.shift ? RUN : WALK) * dt
      const sin = Math.sin(yaw.current), cos = Math.cos(yaw.current)
      // ileri = (-sin, -cos), sağ = (cos, -sin)
      const nx = pos.current.x + (-sin * mz + cos * mx) * speed
      const nz = pos.current.z + (-cos * mz - sin * mx) * speed
      const [rx, rz] = resolvePosition(nx, nz)
      pos.current.x = rx
      pos.current.z = rz
      // hafif yürüme sallanması
      const moving = Math.min(len, 1)
      bob.current += dt * 9 * moving
      pos.current.y += (EYE_HEIGHT + Math.sin(bob.current) * 0.035 * moving - pos.current.y) * 0.2
    }

    camera.position.set(pos.current.x, pos.current.y, pos.current.z)
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')
    playerState.yaw = yaw.current
    playerState.x = pos.current.x
    playerState.z = pos.current.z

    // Yakınlık denetimi (≈8 Hz)
    lastProx.current += dt
    if (lastProx.current > 0.12) {
      lastProx.current = 0
      let best = null
      let bestD = Infinity
      for (const l of locationsOfChapter(chapter)) {
        const d = Math.hypot(l.position[0] - pos.current.x, l.position[2] - pos.current.z)
        if (d < (l.interactRadius ?? 8) && d < bestD) { best = l.id; bestD = d }
      }
      useGameStore.getState().setNearby(activeId ? null : best)
    }
  })

  return null
}
