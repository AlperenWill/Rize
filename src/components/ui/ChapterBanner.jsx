import { ArrowRight, X } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { chapters } from '../../lib/data'

// Bölüm bitince bir sonraki bölüme geçiş daveti
export default function ChapterBanner() {
  const { chapterDone, chapter, activeId, goChapter, dismissChapter, badgeToast } = useGameStore()
  const next = chapters[chapter] // chapters[chapter] = sonraki bölüm
  if (!chapterDone || activeId || badgeToast || !next) return null
  return (
    <div className="absolute inset-x-0 bottom-8 z-40 flex justify-center px-4 animate-slide-up">
      <div className="flex items-center gap-3 rounded-3xl border border-accent/40 bg-card/90 p-4 backdrop-blur-xl shadow-2xl">
        <div>
          <p className="text-xs font-semibold text-accent">Bölüm {chapter} tamamlandı 🎉</p>
          <p className="text-sm font-bold">Sırada: {next.name}</p>
        </div>
        <button onClick={() => goChapter(next.id)} className="flex items-center gap-1 rounded-2xl bg-accent px-4 py-2.5 text-sm font-bold active:scale-95">
          Git <ArrowRight size={16} />
        </button>
        <button onClick={dismissChapter} className="rounded-full p-1.5 text-slate-400 hover:bg-white/10"><X size={16} /></button>
      </div>
    </div>
  )
}
