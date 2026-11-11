import { Volume2, VolumeX } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { setMuted } from '../../lib/audio'

export default function MuteButton() {
  const muted = useGameStore((s) => s.muted)
  const toggle = useGameStore((s) => s.toggleMute)
  return (
    <button
      onClick={() => { setMuted(!muted); toggle() }}
      className="absolute right-4 top-16 z-40 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-card/80 backdrop-blur-md active:scale-95"
      aria-label="Sesi aç/kapat"
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  )
}
