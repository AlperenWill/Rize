import { useRef, useState } from 'react'
import { input } from '../../lib/input'

const R = 52

// Mobil sanal joystick (sol alt)
export default function VirtualJoystick() {
  const base = useRef()
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const pid = useRef(null)

  const update = (e) => {
    const r = base.current.getBoundingClientRect()
    let dx = e.clientX - (r.left + r.width / 2)
    let dy = e.clientY - (r.top + r.height / 2)
    const d = Math.hypot(dx, dy)
    if (d > R) { dx = (dx / d) * R; dy = (dy / d) * R }
    setKnob({ x: dx, y: dy })
    const dead = 0.12
    const nx = dx / R, ny = -dy / R
    input.joystick.x = Math.abs(nx) < dead ? 0 : nx
    input.joystick.y = Math.abs(ny) < dead ? 0 : ny
  }
  const end = () => {
    pid.current = null
    setKnob({ x: 0, y: 0 })
    input.joystick.x = input.joystick.y = 0
  }

  return (
    <div
      ref={base}
      className="absolute bottom-8 left-6 z-30 h-32 w-32 rounded-full border border-white/20 bg-card/50 backdrop-blur-sm"
      style={{ touchAction: 'none' }}
      onPointerDown={(e) => { pid.current = e.pointerId; e.currentTarget.setPointerCapture(e.pointerId); update(e) }}
      onPointerMove={(e) => pid.current === e.pointerId && update(e)}
      onPointerUp={end}
      onPointerCancel={end}
    >
      <div
        className="absolute left-1/2 top-1/2 h-14 w-14 rounded-full bg-accent/80 shadow-lg"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  )
}
