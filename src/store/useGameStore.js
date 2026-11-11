import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { locations, locationsOfChapter } from '../lib/data'

export const useGameStore = create(
  persist(
    (set, get) => ({
      // kalıcı
      discovered: [],
      certificateSeen: false,

      // geçici
      started: false,
      chapter: 1,
      nearbyId: null,
      activeId: null, // incelenen nesne (cinematic)
      journalOpen: false,
      badgeToast: null,
      chapterDone: false,
      showCertificate: false,
      muted: false,
      fading: false,

      start: () => set({ started: true }),
      dismissChapter: () => set({ chapterDone: false }),
      goChapter: (n) => {
        if (get().fading || n === get().chapter) return
        set({ fading: true, chapterDone: false, journalOpen: false })
        setTimeout(() => set({ chapter: n, nearbyId: null }), 500)
        setTimeout(() => set({ fading: false }), 900)
      },
      setNearby: (id) => set((s) => (s.nearbyId === id ? s : { nearbyId: id })),
      inspect: (id) => set({ activeId: id, journalOpen: false }),
      toggleJournal: () => set((s) => ({ journalOpen: !s.journalOpen })),
      closeJournal: () => set({ journalOpen: false }),
      toggleMute: () => set((s) => ({ muted: !s.muted })),
      dismissBadge: () => set({ badgeToast: null }),
      closeCertificate: () => set({ showCertificate: false, certificateSeen: true }),
      resetProgress: () => set({ discovered: [], certificateSeen: false, chapterDone: false }),

      // Bilgi kartı kapanınca keşfi kaydet
      closeInfo: () => {
        const { activeId, discovered, chapter } = get()
        if (!activeId) return
        const loc = locations.find((l) => l.id === activeId)
        const isNew = !discovered.includes(activeId)
        const next = isNew ? [...discovered, activeId] : discovered
        const chapterComplete = locationsOfChapter(chapter).every((l) => next.includes(l.id))
        const all = locations.every((l) => next.includes(l.id))
        set({
          activeId: null,
          discovered: next,
          badgeToast: isNew ? loc.badge && { ...loc.badge, location: loc.name } : null,
          chapterDone: isNew && chapterComplete,
          showCertificate: isNew && all,
        })
      },
    }),
    {
      name: 'rize-mirasi-v1',
      partialize: (s) => ({ discovered: s.discovered, certificateSeen: s.certificateSeen }),
    },
  ),
)
