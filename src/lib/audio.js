// Prosedürel ambiyans: dalga, rüzgar, kuş ve hafif fon müziği (harici dosya gerektirmez)
let ctx, master, birdTimer, started = false
const mix = {}
let birdChance = 0.6

function noiseBuffer(c, seconds = 4) {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < d.length; i++) {
    const w = Math.random() * 2 - 1
    last = (last + 0.02 * w) / 1.02 // kahverengi gürültü
    d[i] = last * 3.5
  }
  return buf
}

function loopNoise(c, { type, freq, q = 0.7, gain, lfoRate, lfoDepth }) {
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c)
  src.loop = true
  const f = c.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  const g = c.createGain()
  g.gain.value = gain
  const lfo = c.createOscillator()
  lfo.frequency.value = lfoRate
  const lg = c.createGain()
  lg.gain.value = lfoDepth
  lfo.connect(lg).connect(g.gain)
  src.connect(f).connect(g).connect(master)
  src.start()
  lfo.start()
  return g
}

function chirp() {
  if (!ctx || ctx.state !== 'running') return
  const t = ctx.currentTime
  const base = 2200 + Math.random() * 1600
  const notes = 2 + Math.floor(Math.random() * 3)
  for (let i = 0; i < notes; i++) {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    const t0 = t + i * 0.13
    o.frequency.setValueAtTime(base, t0)
    o.frequency.exponentialRampToValueAtTime(base * 1.4, t0 + 0.09)
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(0.035, t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11)
    o.connect(g).connect(master)
    o.start(t0)
    o.stop(t0 + 0.13)
  }
}

export function startAmbience() {
  if (started) { ctx?.resume(); return }
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  started = true
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.9
  master.connect(ctx.destination)

  mix.waves = loopNoise(ctx, { type: 'lowpass', freq: 520, gain: 0.22, lfoRate: 0.11, lfoDepth: 0.14 }) // dalga
  mix.wind = loopNoise(ctx, { type: 'bandpass', freq: 700, q: 0.4, gain: 0.05, lfoRate: 0.07, lfoDepth: 0.035 }) // rüzgar
  mix.brook = loopNoise(ctx, { type: 'bandpass', freq: 1500, q: 0.8, gain: 0.0, lfoRate: 0.6, lfoDepth: 0.01 }) // dere
  setChapterAudio(pendingChapter)

  // Fon müziği: yumuşak Re minör ped
  ;[146.83, 220, 293.66, 349.23].forEach((f, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = f
    g.gain.value = 0.012
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.05 + i * 0.03
    const lg = ctx.createGain()
    lg.gain.value = 0.008
    lfo.connect(lg).connect(g.gain)
    o.connect(g).connect(master)
    o.start()
    lfo.start()
  })

  birdTimer = setInterval(() => Math.random() < birdChance && chirp(), 3500)
}

export function setMuted(muted) {
  if (!ctx) return
  master.gain.setTargetAtTime(muted ? 0 : 0.9, ctx.currentTime, 0.15)
}

export function stopAmbience() {
  clearInterval(birdTimer)
  ctx?.close()
  ctx = null
  started = false
}

// Bölüme göre ses karışımı: 1 deniz, 2 dere + kuş, 3 güçlü dere + rüzgar
const PROFILES = {
  1: { waves: 0.22, wind: 0.05, brook: 0, birds: 0.6 },
  2: { waves: 0, wind: 0.03, brook: 0.09, birds: 0.9 },
  3: { waves: 0, wind: 0.11, brook: 0.14, birds: 0.2 },
}
let pendingChapter = 1
export function setChapterAudio(chapter) {
  pendingChapter = chapter
  if (!ctx || !mix.waves) return
  const p = PROFILES[chapter]
  for (const k of ['waves', 'wind', 'brook']) mix[k].gain.setTargetAtTime(p[k], ctx.currentTime, 0.6)
  birdChance = p.birds
}
