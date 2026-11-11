// Bölümlerin dünya kuralları: başlangıç, sınırlar, çarpışma ve zemin yüksekliği
export const EYE_HEIGHT = 1.7

const clamp = (v, a, b) => Math.min(Math.max(v, a), b)

function pushOutCircles(x, z, circles) {
  for (const c of circles) {
    const dx = x - c.x, dz = z - c.z
    const d = Math.hypot(dx, dz)
    if (d < c.r) {
      const k = c.r / (d || 1e-4)
      x = c.x + dx * k
      z = c.z + dz * k
    }
  }
  return [x, z]
}

// ---- Bölüm 1: kıyı + iskele
const PIER = { maxX: 34, z: 3, halfW: 1.3 }
const c1 = [{ x: -11, z: -9, r: 5.4 }]
const world1 = {
  start: { x: 4, z: 14, yaw: 0.55 },
  height: () => 0,
  resolve(x, z) {
    const onPier = x > 22 && Math.abs(z - PIER.z) < PIER.halfW
    if (onPier) {
      x = Math.min(x, PIER.maxX)
      z = clamp(z, PIER.z - PIER.halfW, PIER.z + PIER.halfW)
    } else {
      x = clamp(x, -34, 22)
      z = clamp(z, -30, 24)
    }
    return pushOutCircles(x, z, c1)
  },
}

// ---- Bölüm 2: çay bahçesi + dere + kemer köprü
export const BRIDGE = { x: 6, z: -4, halfW: 1.15, halfL: 3, rise: 1.1 }
const STREAM_HALF = 2.6
const world2 = {
  start: { x: 6, z: 16, yaw: 0 },
  height(x, z) {
    const dz = (z - BRIDGE.z) / BRIDGE.halfL
    if (Math.abs(x - BRIDGE.x) <= BRIDGE.halfW && Math.abs(dz) < 1) return BRIDGE.rise * (1 - dz * dz)
    return 0
  },
  resolve(x, z, px, pz) {
    x = clamp(x, -30, 30)
    z = clamp(z, -30, 30)
    const inZone = (zz) => Math.abs(zz - BRIDGE.z) < STREAM_HALF + 0.4
    if (inZone(z) && Math.abs(x - BRIDGE.x) > BRIDGE.halfW) {
      if (inZone(pz) && Math.abs(px - BRIDGE.x) <= BRIDGE.halfW + 0.01) x = clamp(x, BRIDGE.x - BRIDGE.halfW, BRIDGE.x + BRIDGE.halfW)
      else z = pz
    }
    return [x, z]
  },
}

// ---- Bölüm 3: Fırtına Vadisi
export const ZIL = { x: -16, z: -16 }
const c3 = [{ x: ZIL.x, z: ZIL.z, r: 9.4 }]
const world3 = {
  start: { x: -4, z: 20, yaw: 0.32 },
  height: () => 0,
  resolve(x, z) {
    x = clamp(x, -30, 7.6)
    z = clamp(z, -34, 28)
    return pushOutCircles(x, z, c3)
  },
}

export const worlds = { 1: world1, 2: world2, 3: world3 }

// Tekrarlanabilir rastgele sayı üretici
export function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
