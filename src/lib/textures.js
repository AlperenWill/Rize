import * as THREE from 'three'
import { mulberry32 } from './world'

function canvasTexture(draw, size = 256) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  draw(c.getContext('2d'), size)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

// Kesme taş duvar dokusu (sıralı, derzli taş örgüsü)
export function makeStoneTexture(base = [176, 168, 152]) {
  return canvasTexture((g, s) => {
    const rnd = mulberry32(7)
    g.fillStyle = '#6d685d'
    g.fillRect(0, 0, s, s)
    const rows = 4
    const h = s / rows
    for (let r = 0; r < rows; r++) {
      const cols = r % 2 ? 3 : 2
      const w = s / cols
      const off = r % 2 ? -w / 2 : 0
      for (let c = -1; c <= cols; c++) {
        const v = (rnd() - 0.5) * 36
        g.fillStyle = `rgb(${base[0] + v}, ${base[1] + v}, ${base[2] + v})`
        g.fillRect(off + c * w + 3, r * h + 3, w - 6, h - 6)
        g.fillStyle = 'rgba(0,0,0,0.08)'
        g.fillRect(off + c * w + 3, r * h + h - 9, w - 6, 6)
      }
    }
  })
}

// Kaldırım taşı zemini
export function makeCobbleTexture() {
  return canvasTexture((g, s) => {
    const rnd = mulberry32(21)
    g.fillStyle = '#4b4a46'
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 28; i++) {
      const x = rnd() * s, y = rnd() * s, r = 14 + rnd() * 12
      const v = 100 + rnd() * 40
      g.fillStyle = `rgb(${v}, ${v - 4}, ${v - 12})`
      g.beginPath()
      g.ellipse(x, y, r, r * 0.8, rnd() * 3, 0, Math.PI * 2)
      g.fill()
    }
  })
}

// Ahşap tahta dokusu
export function makeWoodTexture() {
  return canvasTexture((g, s) => {
    const rnd = mulberry32(3)
    g.fillStyle = '#6b4a2e'
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 60; i++) {
      g.strokeStyle = `rgba(30,18,8,${0.1 + rnd() * 0.2})`
      g.lineWidth = 1 + rnd() * 2
      g.beginPath()
      const y = rnd() * s
      g.moveTo(0, y)
      g.lineTo(s, y + (rnd() - 0.5) * 6)
      g.stroke()
    }
  }, 128)
}

// Akan su çizgileri
export function makeWaterTexture() {
  return canvasTexture((g, s) => {
    const rnd = mulberry32(8)
    g.fillStyle = '#2b7a96'
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 40; i++) {
      g.strokeStyle = `rgba(255,255,255,${0.1 + rnd() * 0.25})`
      g.lineWidth = 1 + rnd() * 2
      const x = rnd() * s, y = rnd() * s
      g.beginPath()
      g.moveTo(x, y)
      g.quadraticCurveTo(x + 20, y + (rnd() - 0.5) * 10, x + 40 + rnd() * 30, y)
      g.stroke()
    }
  })
}

// Yumuşak sis lekesi
export function makeMistTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(235,240,242,0.55)')
  grad.addColorStop(1, 'rgba(235,240,242,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}
