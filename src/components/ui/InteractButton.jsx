import { Search } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { locationById } from '../../lib/data'

export default function InteractButton() {
  const nearbyId = useGameStore((s) => s.nearbyId)
  const activeId = useGameStore((s) => s.activeId)
  const inspect = useGameStore((s) => s.inspect)
  if (!nearbyId || activeId) return null
  return (
    <div className="absolute bottom-28 left-1/2 z-30 -translate-x-1/2 text-center animate-fade-in">
      <button
        onClick={() => { document.exitPointerLock?.(); inspect(nearbyId) }}
        className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-bold text-white shadow-xl shadow-accent/30 active:scale-95"
      >
        <Search size={20} /> İncele
      </button>
      <p className="mt-2 text-xs font-medium text-white/90 drop-shadow">{locationById[nearbyId].name} <span className="hidden md:inline">· E</span></p>
    </div>
  )
}
