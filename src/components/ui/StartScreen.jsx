import { Compass, Gamepad2, Smartphone } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { startAmbience } from '../../lib/audio'
import { isTouchDevice } from '../../lib/input'

export default function StartScreen() {
  const start = useGameStore((s) => s.start)
  const touch = isTouchDevice()
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm p-5 animate-fade-in">
      <div className="max-w-md w-full rounded-3xl bg-card p-7 border border-white/10 shadow-2xl text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent/15 text-accent">
          <Compass size={30} />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Rize Mirası Keşfi</h1>
        <p className="mt-2 text-sm text-slate-300">
          Rize'nin tarihi ve kültürel hazinelerini bul, incele ve Keşif Defteri'ne kaydet. Hepsini toplayınca
          <b className="text-white"> Rize Mirası Elçisi</b> olacaksın!
        </p>
        <div className="mt-5 rounded-2xl bg-white/5 p-4 text-left text-sm text-slate-300 space-y-2">
          {touch ? (
            <>
              <p className="flex gap-2"><Smartphone size={18} className="shrink-0 text-accent" /> Sol alttaki joystick ile yürü.</p>
              <p className="flex gap-2"><Gamepad2 size={18} className="shrink-0 text-accent" /> Ekranın sağında parmağını sürükleyerek etrafına bak.</p>
            </>
          ) : (
            <>
              <p><kbd className="rounded bg-white/10 px-1.5">W A S D</kbd> yürü · <kbd className="rounded bg-white/10 px-1.5">Shift</kbd> koş</p>
              <p><b>Fare</b> ile bak (sahneye tıkla) · <kbd className="rounded bg-white/10 px-1.5">E</kbd> incele · <kbd className="rounded bg-white/10 px-1.5">J</kbd> defter</p>
            </>
          )}
          <p className="text-slate-400">Kırmızı nefes alan daireleri ara! 🔴</p>
        </div>
        <button
          onClick={() => { startAmbience(); start() }}
          className="mt-6 w-full rounded-2xl bg-accent py-3.5 text-base font-bold text-white active:scale-95 transition hover:brightness-110"
        >
          Keşfe Başla
        </button>
      </div>
    </div>
  )
}
