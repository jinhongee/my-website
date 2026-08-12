import { useCallback } from 'react'
import useCanvasLoop, { TAU, drawDotGrid, monoLabel } from './useCanvasLoop'

const ACCENT = '255, 84, 20'
const BLUE = '106, 165, 255'
const AMBER = '239, 91, 91'

const LAYERS = [
  { n: 4, label: 'SUPPLY' },
  { n: 3, label: 'MFG' },
  { n: 3, label: 'DIST' },
  { n: 5, label: 'DEMAND' },
]

// Multi-echelon supply network: flow packets over a layered graph,
// stochastic demand pulses at sinks, periodic disruption + reroute.
export default function NetworkViz() {
  const draw = useCallback((ctx, w, h, t, s) => {
    if (!s.nodes) {
      s.nodes = []
      s.edges = []
      LAYERS.forEach((L, li) => {
        for (let i = 0; i < L.n; i++) {
          s.nodes.push({
            li,
            x: 0.1 + (li / (LAYERS.length - 1)) * 0.8,
            y: (i + 1) / (L.n + 1) + (Math.random() - 0.5) * 0.05,
            inv: 0.4 + Math.random() * 0.4,
            phase: Math.random() * TAU,
          })
        }
      })
      const byLayer = (li) => s.nodes.filter((nd) => nd.li === li)
      for (let li = 0; li < LAYERS.length - 1; li++) {
        for (const a of byLayer(li)) {
          const next = byLayer(li + 1)
          const targets = [...next].sort(() => Math.random() - 0.5).slice(0, 2)
          for (const b of targets) {
            s.edges.push({
              a,
              b,
              rate: 0.5 + Math.random() * 0.5,
              off: Math.random(),
              disrupted: 0,
            })
          }
        }
      }
      s.nextDisrupt = 4
    }

    ctx.clearRect(0, 0, w, h)
    drawDotGrid(ctx, w, h, 22, 0.06)

    // periodic disruption + implicit reroute (siblings brighten)
    if (t > s.nextDisrupt) {
      s.nextDisrupt = t + 5.5
      const mid = s.edges.filter((e) => e.a.li === 1)
      const pick = mid[Math.floor(Math.random() * mid.length)]
      if (pick) pick.disrupted = t + 2.8
    }

    const X = (nd) => nd.x * w
    const Y = (nd) => nd.y * (h - 56) + 18

    // edges + packets
    for (const e of s.edges) {
      const x1 = X(e.a)
      const y1 = Y(e.a)
      const x2 = X(e.b)
      const y2 = Y(e.b)
      const mx = (x1 + x2) / 2
      const bow = (y1 - y2) * 0.22
      const down = e.disrupted > t
      const sibBoost =
        s.edges.some((o) => o !== e && o.disrupted > t && o.a.li === e.a.li) && !down ? 0.35 : 0

      if (down) {
        ctx.setLineDash([3, 5])
        ctx.strokeStyle = `rgba(${AMBER}, 0.65)`
      } else {
        ctx.strokeStyle = `rgba(148, 163, 184, ${0.18 + sibBoost * 0.5})`
      }
      ctx.lineWidth = down ? 1.2 : 1
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.quadraticCurveTo(mx, (y1 + y2) / 2 + bow, x2, y2)
      ctx.stroke()
      ctx.setLineDash([])

      if (down) {
        monoLabel(ctx, '✕ capacity', mx - 26, (y1 + y2) / 2 + bow - 6, `rgba(${AMBER}, 0.9)`)
        continue
      }

      const nPk = 2 + Math.round(e.rate + sibBoost * 2)
      for (let k = 0; k < nPk; k++) {
        const u = (t * 0.16 * (e.rate + sibBoost) + e.off + k / nPk) % 1
        const it = 1 - u
        const px = it * it * x1 + 2 * it * u * mx + u * u * x2
        const pyq = it * it * y1 + 2 * it * u * ((y1 + y2) / 2 + bow) + u * u * y2
        ctx.fillStyle = `rgba(${sibBoost ? ACCENT : BLUE}, ${0.55 + 0.4 * Math.sin(u * Math.PI)})`
        ctx.beginPath()
        ctx.arc(px, pyq, 1.9, 0, TAU)
        ctx.fill()
      }
    }

    // nodes
    for (const nd of s.nodes) {
      const px = X(nd)
      const py = Y(nd)
      const sink = nd.li === LAYERS.length - 1
      nd.inv = Math.max(
        0.08,
        Math.min(1, nd.inv + Math.sin(t * 0.9 + nd.phase) * 0.004 + (Math.random() - 0.5) * 0.01),
      )

      // demand pulse rings at sinks
      if (sink) {
        const ph = (t * 0.5 + nd.phase) % 1
        ctx.strokeStyle = `rgba(${ACCENT}, ${0.5 * (1 - ph)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(px, py, 6 + ph * 16, 0, TAU)
        ctx.stroke()
      }

      ctx.fillStyle = '#05070a'
      ctx.strokeStyle = sink ? `rgba(${ACCENT}, 0.85)` : 'rgba(148, 163, 184, 0.7)'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      if (nd.li === 0) {
        ctx.rect(px - 5, py - 5, 10, 10)
      } else if (sink) {
        ctx.arc(px, py, 5, 0, TAU)
      } else {
        ctx.moveTo(px, py - 6)
        ctx.lineTo(px + 6, py)
        ctx.lineTo(px, py + 6)
        ctx.lineTo(px - 6, py)
        ctx.closePath()
      }
      ctx.fill()
      ctx.stroke()

      // inventory bar
      const bw = 20
      ctx.fillStyle = 'rgba(148, 163, 184, 0.15)'
      ctx.fillRect(px - bw / 2, py + 10, bw, 3)
      const low = nd.inv < 0.25
      ctx.fillStyle = low ? `rgba(${AMBER}, 0.95)` : `rgba(${BLUE}, 0.8)`
      ctx.fillRect(px - bw / 2, py + 10, bw * nd.inv, 3)
    }

    // layer labels
    LAYERS.forEach((L, li) => {
      const x = (0.1 + (li / (LAYERS.length - 1)) * 0.8) * w
      monoLabel(ctx, L.label, x - 18, h - 12, 'rgba(139,152,169,0.85)')
    })
    monoLabel(ctx, 'min Σ_e c_e·x_e  s.t.  Ax = d,  x ≤ u', 16, 50, `rgba(${ACCENT}, 0.85)`)
  }, [])

  const ref = useCanvasLoop(draw)
  return <canvas ref={ref} className="viz-canvas" aria-label="Animated multi-echelon supply network flow diagram" />
}
