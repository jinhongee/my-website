import { useCallback } from 'react'
import useCanvasLoop, { TAU, drawDotGrid, monoLabel } from './useCanvasLoop'

const ACCENT = '255, 84, 20'
const BLUE = '106, 165, 255'

function angDiff(a, b) {
  let d = (a - b) % TAU
  if (d < 0) d += TAU
  return d
}

// Passive sonar: rotating bearing sweep over a polar contact field (left),
// scrolling LOFAR narrowband spectrogram with a highlighted tonal (right).
export default function SonarViz() {
  const draw = useCallback((ctx, w, h, t, s) => {
    if (!s.contacts || s.resized) {
      s.resized = false
      if (!s.contacts) {
        s.contacts = Array.from({ length: 16 }, (_, i) => ({
          a: Math.random() * TAU,
          r: 0.25 + Math.random() * 0.68,
          drift: (Math.random() - 0.5) * 0.05,
          target: i === 0,
        }))
        s.cols = []
        s.tonals = [0.24, 0.47, 0.72].map((f, i) => ({
          f,
          amp: 0.9 - i * 0.22,
          wob: 0.5 + Math.random(),
        }))
      }
    }

    ctx.clearRect(0, 0, w, h)
    drawDotGrid(ctx, w, h, 22, 0.06)

    const specW = Math.min(w * 0.34, 250)
    const cx = (w - specW - 30) / 2 + 6
    const cy = h / 2
    const R = Math.min(cx - 26, h / 2 - 34)

    // --- polar grid (dotted rings + spokes) ---
    ctx.fillStyle = 'rgba(148, 163, 184, 0.28)'
    for (let ring = 1; ring <= 4; ring++) {
      const rr = (R * ring) / 4
      const n = Math.max(24, Math.round(rr * 0.55))
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU
        ctx.fillRect(cx + Math.cos(a) * rr - 0.5, cy + Math.sin(a) * rr - 0.5, 1, 1)
      }
    }
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R)
      ctx.stroke()
    }

    // --- expanding ping ripples ---
    const pingPeriod = 2.6
    for (let k = 0; k < 2; k++) {
      const ph = ((t / pingPeriod + k * 0.5) % 1)
      const rr = ph * R
      ctx.strokeStyle = `rgba(${ACCENT}, ${0.35 * (1 - ph)})`
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.arc(cx, cy, rr, 0, TAU)
      ctx.stroke()
    }

    // --- rotating sweep wedge ---
    const sweep = (t * 0.85) % TAU
    const wedge = 1.3
    const grad = ctx.createConicGradient
      ? (() => {
          const g = ctx.createConicGradient(sweep - wedge, cx, cy)
          g.addColorStop(0, `rgba(${ACCENT}, 0)`)
          g.addColorStop(0.98 * (wedge / TAU), `rgba(${ACCENT}, 0.22)`)
          g.addColorStop(wedge / TAU, `rgba(${ACCENT}, 0)`)
          g.addColorStop(1, `rgba(${ACCENT}, 0)`)
          return g
        })()
      : `rgba(${ACCENT}, 0.1)`
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, R, sweep - wedge, sweep)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = `rgba(${ACCENT}, 0.9)`
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R)
    ctx.stroke()

    // --- contacts ---
    for (const c of s.contacts) {
      c.a += c.drift * 0.016
      const px = cx + Math.cos(c.a) * c.r * R
      const py = cy + Math.sin(c.a) * c.r * R
      const since = angDiff(sweep, c.a)
      const glow = Math.exp(-since * 1.8)
      const base = c.target ? 0.5 : 0.22
      const alpha = Math.min(1, base + glow)
      const col = c.target ? ACCENT : '148, 163, 184'
      ctx.fillStyle = `rgba(${col}, ${alpha})`
      ctx.beginPath()
      ctx.arc(px, py, c.target ? 3 : 1.8 + glow * 1.4, 0, TAU)
      ctx.fill()

      if (c.target) {
        // classification lock-on box
        const box = 11 + Math.sin(t * 3) * 1.5
        ctx.strokeStyle = `rgba(${ACCENT}, ${0.45 + glow * 0.5})`
        ctx.lineWidth = 1
        const g2 = 4
        ctx.beginPath()
        for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
          ctx.moveTo(px + sx * box, py + sy * box - sy * g2)
          ctx.lineTo(px + sx * box, py + sy * box)
          ctx.lineTo(px + sx * box - sx * g2, py + sy * box)
        }
        ctx.stroke()
        monoLabel(ctx, 'SS-CONTACT', px + box + 6, py - 2, `rgba(${ACCENT}, 0.95)`)
        monoLabel(ctx, `P(sub)=0.9${2 + Math.floor((Math.sin(t * 0.7) + 1) * 3)}`, px + box + 6, py + 9, 'rgba(139,152,169,0.9)')
      }
    }

    monoLabel(ctx, `PASSIVE ARRAY // BRG ${String(Math.round((sweep / TAU) * 360)).padStart(3, '0')}° // 4.8 kHz BW`, cx - R, cy + R + 20, `rgba(${ACCENT}, 0.8)`)

    // --- LOFAR spectrogram (right strip) ---
    const sx0 = w - specW - 14
    const sy0 = 42
    const specH = h - 84
    const makeCol = (tt) => {
      const col = []
      const bins = 46
      for (let b = 0; b < bins; b++) {
        const u = b / bins
        let v = Math.random() * 0.16
        for (const tone of s.tonals) {
          const fc = tone.f + Math.sin(tt * 0.3 * tone.wob) * 0.012
          v += tone.amp * Math.exp(-Math.pow((u - fc) / 0.011, 2))
        }
        // broadband DEMON-ish flutter near bottom
        v += 0.2 * Math.exp(-Math.pow((u - 0.06) / 0.05, 2)) * (0.5 + 0.5 * Math.sin(tt * 9))
        col.push(Math.min(1, v))
      }
      return col
    }
    const maxCols = Math.floor(specW / 4)
    if (s.cols.length === 0) {
      for (let k = maxCols; k > 0; k--) s.cols.push(makeCol(t - k * 0.055))
    }
    if (!s.lastCol || t - s.lastCol > 0.055) {
      s.lastCol = t
      s.cols.push(makeCol(t))
      while (s.cols.length > maxCols) s.cols.shift()
    }
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)'
    ctx.strokeRect(sx0 - 4, sy0 - 4, specW + 8, specH + 8)
    const bins = 46
    const cellH = specH / bins
    for (let i = 0; i < s.cols.length; i++) {
      const col = s.cols[i]
      const x = sx0 + i * 4
      for (let b = 0; b < bins; b++) {
        const v = col[b]
        if (v < 0.08) continue
        const y = sy0 + specH - (b + 1) * cellH
        const tonal = v > 0.55
        ctx.fillStyle = tonal
          ? `rgba(${ACCENT}, ${Math.min(1, v)})`
          : `rgba(${BLUE}, ${v * 0.55})`
        ctx.fillRect(x, y + cellH * 0.2, 2.4, cellH * 0.6)
      }
    }
    monoLabel(ctx, 't →', sx0 - 4, sy0 + specH + 16, 'rgba(91,104,120,0.8)')
    monoLabel(ctx, 'LOFAR // Hz', sx0 + specW - 70, sy0 + specH + 16, 'rgba(139,152,169,0.8)')
  }, [])

  const ref = useCanvasLoop(draw)
  return <canvas ref={ref} className="viz-canvas" aria-label="Animated passive sonar bearing sweep and LOFAR spectrogram" />
}
