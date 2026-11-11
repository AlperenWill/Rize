// Oyuncu girdisi: React dışında tutulur, böylece her karede render tetiklenmez.
export const input = {
  keys: { w: false, a: false, s: false, d: false, shift: false },
  joystick: { x: 0, y: 0 }, // x: sağ(+), y: ileri(+)
  lookDelta: { x: 0, y: 0 },
}

// Oyuncunun anlık durumu (pusula ve yakınlık hesabı için)
export const playerState = { yaw: 0, x: 0, z: 0 }

export const isTouchDevice = () =>
  typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)
