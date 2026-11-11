import { BookmarkPlus } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { locationById } from '../../lib/data'

// Alttan yukarı kayan, yarı şeffaf bilgi kartı
export default function InfoCard() {
  const activeId = useGameStore((s) => s.activeId)
  const closeInfo = useGameStore((s) => s.closeInfo)
  const done = useGameStore((s) => s.discovered.includes(activeId))
  if (!activeId) return null
  const l = locationById[activeId]
  return (
    <div className="absolute inset-x-0 bottom-0 z-40 flex justify-center p-3 sm:p-6">
      <div key={activeId} className="animate-slide-up w-full max-w-2xl rounded-3xl border border-white/10 bg-card/80 p-5 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-accent/20 px-2.5 py-1 text-accent">{l.category}</span>
          <span className="text-slate-400">{l.era}</span>
        </div>
        <h2 className="mt-2 text-2xl font-extrabold">{l.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-200 sm:text-base">{l.description}</p>
        <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
          {l.facts.map((f) => (
            <li key={f} className="flex gap-2"><span className="text-accent">●</span>{f}</li>
          ))}
        </ul>
        <button onClick={closeInfo} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent py-3 font-bold text-white active:scale-95">
          <BookmarkPlus size={20} /> {done ? 'Tamam' : "Keşif Defteri'ne Kaydet"}
        </button>
      </div>
    </div>
  )
}
