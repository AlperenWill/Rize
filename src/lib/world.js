// Bölüm 1 dünya sınırları ve çarpışma daireleri (x, z, yarıçap)
export const START = { x: 4, z: 14, yaw: 0.55 }
export const EYE_HEIGHT = 1.7

export const colliders = [
  { x: -11, z: -9, r: 5.4 }, // Rize Kalesi
]

const LAND = { minX: -34, maxX: 22, minZ: -30, maxZ: 24 }
const PIER = { minX: 20, maxX: 34, z: 3, halfW: 1.3 }

export function resolvePosition(x, z) {
  // Sınırlar: kara + iskele
  const onPierZone = x > LAND.maxX && Math.abs(z - PIER.z) < PIER.halfW
  if (onPierZone) {
    x = Math.min(x, PIER.maxX)
    z = Math.min(Math.max(z, PIER.z - PIER.halfW), PIER.z + PIER.halfW)
  } else {
    x = Math.min(Math.max(x, LAND.minX), LAND.maxX)
    z = Math.min(Math.max(z, LAND.minZ), LAND.maxZ)
    // iskelenin yanından denize düşmesin
    if (x > LAND.maxX - 0.05) x = LAND.maxX
  }
  // Daire çarpışmaları
  for (const c of colliders) {
    const dx = x - c.x
    const dz = z - c.z
    const d = Math.hypot(dx, dz)
    if (d < c.r) {
      const k = c.r / (d || 0.0001)
      x = c.x + dx * k
      z = c.z + dz * k
    }
  }
  return [x, z]
}

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
