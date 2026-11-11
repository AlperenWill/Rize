import { lazy, Suspense } from 'react'
import { useGameStore } from './store/useGameStore'
import { isTouchDevice } from './lib/input'
import StartScreen from './components/ui/StartScreen'
import Compass from './components/ui/Compass'
import VirtualJoystick from './components/ui/VirtualJoystick'
import LookPad from './components/ui/LookPad'
import InteractButton from './components/ui/InteractButton'
import InfoCard from './components/ui/InfoCard'
import JournalPanel from './components/ui/JournalPanel'
import BadgeToast from './components/ui/BadgeToast'
import Certificate from './components/ui/Certificate'
import MuteButton from './components/ui/MuteButton'

const Experience = lazy(() => import('./components/scene/Experience'))
const touch = isTouchDevice()

export default function App() {
  const started = useGameStore((s) => s.started)
  const activeId = useGameStore((s) => s.activeId)
  const journalOpen = useGameStore((s) => s.journalOpen)
  const playing = started && !activeId && !journalOpen

  return (
    <div className="relative h-full w-full overflow-hidden bg-bg">
      <Suspense fallback={<div className="grid h-full place-items-center text-slate-400">Rize yükleniyor…</div>}>
        <Experience />
      </Suspense>

      {started && (
        <>
          {!activeId && (
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
          )}
          <Compass />
          <MuteButton />
          <JournalPanel />
          <InteractButton />
          <InfoCard />
          <BadgeToast />
          {touch && playing && (
            <>
              <LookPad />
              <VirtualJoystick />
            </>
          )}
        </>
      )}
      <Certificate />
      {!started && <StartScreen />}
    </div>
  )
}
