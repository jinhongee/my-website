import { useCallback } from 'react'
import useCanvasLoop, { TAU, drawDotGrid, monoLabel, PAPER, INK, ACCENT } from './useCanvasLoop'

const SHELLS = 9

// Generative agent population as an orrery: each shell is a cohort on a shared
// orbit, turning at ω ∝ 1/r. Interactions are drawn only where neighbouring
// cohorts fall into alignment, so the coupling sweeps slowly instead of churning.
export default function SwarmViz() {
  const draw = useCallback((ctx, w, h, t) => {
    ctx.fillStyle = PAPER
    ctx.fillRect(0, 0, w, h)
    drawDotGrid(ctx, w, h, 26, 0.05)

    const cx = w / 2
    const cy = h / 2

    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55)
    glow.addColorStop(0, `rgba(${ACCENT}, 0.05)`)
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, w, h)

    // shell geometry, resolved once per frame and shared by orbits/agents/chords
    const breathe = 1 + Math.sin(t * 0.17) * 0.014
    const shells = []
    for (let k = 0; k < SHELLS; k++) {
      const f = (k + 1) / SHELLS
      const n = 5 + k * 4
      shells.push({
        rx: w * 0.45 * f * breathe,
        ry: h * 0.41 * f * breathe,
        n,
        step: TAU / n,
        phase: (t * 0.14) / (0.3 + f) + k * 0.55,
      })
    }

    ctx.lineWidth = 1
    ctx.strokeStyle = `rgba(${INK}, 0.12)`
    for (const s of shells) {
      ctx.beginPath()
      ctx.ellipse(cx, cy, s.rx, s.ry, 0, 0, TAU)
      ctx.stroke()
    }

    // coupling: a chord appears only inside a narrow alignment window
    const WINDOW = 0.034
    ctx.lineWidth = 0.7
    let links = 0
    for (let k = 0; k < SHELLS - 1; k++) {
      const a = shells[k]
      const b = shells[k + 1]
      for (let i = 0; i < a.n; i++) {
        const th = a.phase + i * a.step
        const th2 = b.phase + Math.round((th - b.phase) / b.step) * b.step
        const d = Math.atan2(Math.sin(th - th2), Math.cos(th - th2))
        if (Math.abs(d) > WINDOW) continue
        ctx.strokeStyle = `rgba(${INK}, ${0.32 * (1 - Math.abs(d) / WINDOW)})`
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(th) * a.rx, cy + Math.sin(th) * a.ry)
        ctx.lineTo(cx + Math.cos(th2) * b.rx, cy + Math.sin(th2) * b.ry)
        ctx.stroke()
        links++
      }
    }

    let agents = 0
    for (let k = 0; k < SHELLS; k++) {
      const s = shells[k]
      // one tracer per shell, so the differential rotation stays readable
      ctx.strokeStyle = `rgba(${ACCENT}, 0.22)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(cx, cy, s.rx, s.ry, 0, s.phase - 0.28, s.phase)
      ctx.stroke()

      for (let i = 0; i < s.n; i++) {
        const th = s.phase + i * s.step
        const px = cx + Math.cos(th) * s.rx
        const py = cy + Math.sin(th) * s.ry
        const tracer = i === 0
        ctx.fillStyle = tracer ? `rgba(${ACCENT}, 0.95)` : `rgba(${INK}, ${0.3 + k * 0.05})`
        ctx.beginPath()
        ctx.arc(px, py, tracer ? 2.1 : 1.5, 0, TAU)
        ctx.fill()
        agents++
      }
    }

    const label = `N=${agents}   ω ∝ 1/r   coupled: ${String(links).padStart(2, '0')}`
    ctx.font = '500 9px "IBM Plex Mono", monospace'
    monoLabel(ctx, label, w - ctx.measureText(label).width - 14, h - 14, 'rgba(106, 106, 106, 0.6)')
  }, [])

  const ref = useCanvasLoop(draw)
  return <canvas ref={ref} className="viz-canvas" aria-label="Animated concentric agent population" />
}
