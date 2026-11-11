import { useEffect, useRef } from 'react'
import { playerState, isTouchDevice } from '../../lib/input'

// Sol altta basit yön göstergesi (K: Kuzey, D: Doğu = deniz, G: Güney, B: Batı)
export default function Compass() {
  const dial = useRef()
  useEffect(() => {
    let raf
    const tick = () => {
      if (dial.current) dial.current.style.transform = `rotate(${(playerState.yaw * 180) / Math.PI}deg)`
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])
  const pos = isTouchDevice() ? 'top-4 left-4' : 'bottom-4 left-4'
  const L = 'absolute text-[11px] font-bold'
  return (
    <div className={`pointer-events-none absolute ${pos} z-20 grid h-20 w-20 place-items-center rounded-full border border-white/15 bg-card/70 backdrop-blur-md`}>
      <div ref={dial} className="absolute inset-0">
        <span className={`${L} left-1/2 top-1 -translate-x-1/2 text-accent`}>K</span>
        <span className={`${L} right-1.5 top-1/2 -translate-y-1/2 text-slate-300`}>D</span>
        <span className={`${L} bottom-1 left-1/2 -translate-x-1/2 text-slate-300`}>G</span>
        <span className={`${L} left-1.5 top-1/2 -translate-y-1/2 text-slate-300`}>B</span>
      </div>
      <div className="h-0 w-0 border-x-[5px] border-b-[12px] border-x-transparent border-b-white" />
    </div>
  )
}
