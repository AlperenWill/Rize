import { Award } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { locations } from '../../lib/data'

// Tüm bölümler bitince "Rize Mirası Elçisi" sertifikası
export default function Certificate() {
  const show = useGameStore((s) => s.showCertificate)
  const close = useGameStore((s) => s.closeCertificate)
  if (!show) return null
  return (
    <div className="absolute inset-0 z-[60] grid place-items-center overflow-y-auto bg-bg/95 p-5 animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border-2 border-accent/60 bg-card p-8 text-center shadow-2xl">
        <Award size={56} className="mx-auto text-accent animate-badge-pop" />
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">Sertifika</p>
        <h1 className="mt-2 text-3xl font-extrabold">Rize Mirası Elçisi</h1>
        <p className="mt-4 text-slate-300">
          Rize'nin {locations.length} tarihi ve kültürel değerini keşfettin. Öğrendiklerini arkadaşlarına ve ailene anlat!
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-3xl">
          {locations.map((l) => <span key={l.id} title={l.badge.name}>{l.badge.emoji}</span>)}
        </div>
        <button onClick={close} className="mt-7 w-full rounded-2xl bg-accent py-3 font-bold text-white active:scale-95">Devam Et</button>
      </div>
    </div>
  )
}
