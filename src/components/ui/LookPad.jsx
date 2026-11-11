import { useRef } from 'react'
import { input } from '../../lib/input'

// Ekranın sağ tarafında sürükleyerek bakma (dokunmatik)
export default function LookPad() {
  const last = useRef(null)
  const pid = useRef(null)
  return (
    <div
      className="absolute inset-y-0 right-0 z-10 w-3/5"
      style={{ touchAction: 'none' }}
      onPointerDown={(e) => { pid.current = e.pointerId; last.current = [e.clientX, e.clientY]; e.currentTarget.setPointerCapture(e.pointerId) }}
      onPointerMove={(e) => {
        if (pid.current !== e.pointerId || !last.current) return
        input.lookDelta.x += e.clientX - last.current[0]
        input.lookDelta.y += e.clientY - last.current[1]
        last.current = [e.clientX, e.clientY]
      }}
      onPointerUp={() => { pid.current = null; last.current = null }}
      onPointerCancel={() => { pid.current = null; last.current = null }}
    />
  )
}
