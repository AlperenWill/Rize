import { useEffect } from 'react'
import { useGameStore } from '../../store/useGameStore'
import { chapters } from '../../lib/data'

// Yeni rozet animasyonu + bölüm tamamlandı bildirimi
export default function BadgeToast() {
  const badge = useGameStore((s) => s.badgeToast)
  const dismiss = useGameStore((s) => s.dismissBadge)
  const chapterDone = useGameStore((s) => s.chapterDone)
  const chapter = useGameStore((s) => s.chapter)
  useEffect(() => {
    if (!badge) return
    const t = setTimeout(dismiss, 3800)
    return () => clearTimeout(t)
  }, [badge, dismiss])
  if (!badge) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 z-50 flex justify-center px-4">
      <div className="animate-fade-in flex items-center gap-4 rounded-3xl border border-accent/40 bg-card/90 px-5 py-4 backdrop-blur-xl shadow-2xl shadow-accent/20">
        <div className="animate-badge-pop grid h-16 w-16 place-items-center rounded-full bg-accent/20 text-4xl ring-2 ring-accent">{badge.emoji}</div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Yeni Rozet!</p>
          <p className="text-lg font-extrabold">{badge.name}</p>
          <p className="text-xs text-slate-400">
            {chapterDone ? `🎉 Bölüm ${chapter}: ${chapters[chapter - 1].name} tamamlandı!` : badge.location}
          </p>
        </div>
      </div>
    </div>
  )
}
