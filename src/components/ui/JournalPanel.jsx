import { BookOpen, X, Lock, Trash2 } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { chapters, locations } from '../../lib/data'

// Sağ üstte sabit düğme + tıklanınca açılan yan menü
export default function JournalPanel() {
  const { discovered, journalOpen, toggleJournal, closeJournal, resetProgress, chapter, goChapter } = useGameStore()
  const pct = Math.round((discovered.length / locations.length) * 100)
  return (
    <>
      <button
        onClick={() => { document.exitPointerLock?.(); toggleJournal() }}
        className="absolute right-4 top-4 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-card/80 px-4 py-2.5 text-sm font-bold backdrop-blur-md active:scale-95"
        aria-label="Keşif Defteri"
      >
        <BookOpen size={18} className="text-accent" /> {discovered.length}/{locations.length}
      </button>

      {journalOpen && <div className="absolute inset-0 z-40 bg-black/40" onClick={closeJournal} />}
      <aside
        className={`absolute right-0 top-0 z-50 h-full w-[88%] max-w-sm overflow-y-auto border-l border-white/10 bg-card p-5 shadow-2xl transition-transform duration-300 ${journalOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-extrabold"><BookOpen className="text-accent" /> Keşif Defteri</h2>
          <button onClick={closeJournal} className="rounded-full p-2 hover:bg-white/10"><X size={20} /></button>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-accent transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1 text-xs text-slate-400">%{pct} tamamlandı</p>

        {chapters.map((c) => (
          <section key={c.id} className="mt-6">
            <h3 className="text-sm font-bold text-slate-200">Bölüm {c.id}: {c.name}</h3>
            {c.id !== chapter ? (
              <button onClick={() => goChapter(c.id)} className="mt-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent active:scale-95">Bu bölüme git →</button>
            ) : (
              <p className="text-xs text-slate-500">Şu an buradasın · {c.subtitle}</p>
            )}
            <ul className="mt-2 space-y-2">
              {locations.filter((l) => l.chapter === c.id).map((l) => {
                const got = discovered.includes(l.id)
                return (
                  <li key={l.id} className={`flex items-center gap-3 rounded-2xl p-3 ${got ? 'bg-accent/10 ring-1 ring-accent/40' : 'bg-white/5'}`}>
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-black/30 text-2xl">
                      {got ? l.badge.emoji : <Lock size={18} className="text-slate-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{got ? l.badge.name : '???'}</p>
                      <p className="truncate text-xs text-slate-400">{got ? l.name : 'Henüz keşfedilmedi'}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
        <button onClick={() => confirm('Tüm ilerleme silinsin mi?') && resetProgress()} className="mt-8 flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300">
          <Trash2 size={14} /> İlerlemeyi sıfırla
        </button>
      </aside>
    </>
  )
}
