import { useCallback } from 'react'
import useCanvasLoop, { TAU, drawDotGrid, monoLabel } from './useCanvasLoop'

const ACCENT = '79, 227, 193'
const BLUE = '106, 165, 255'

// Recurrent sequence modeling: scrolling stochastic price path with a
// forecast cone (top), unrolled LSTM cells passing hidden state (bottom).
export default function SequenceViz() {
  const draw = useCallback((ctx, w, h, t, s) => {
    if (!s.series) {
      s.series = []
      s.v = 0
      s.x = 0.5
      s.last = 0
      // prefill so the chart is full on first paint
      for (let k = 0; k < Math.floor(w / 3) + 4; k++) {
        s.v = s.v * 0.94 + (Math.random() - 0.5) * 0.02 + (0.5 - s.x) * 0.004
        if (Math.random() < 0.01) s.v += (Math.random() - 0.5) * 0.06
        s.x = Math.max(0.08, Math.min(0.92, s.x + s.v))
        s.series.push(s.x)
      }
    }

    // advance the random walk (mean-reverting w/ occasional jumps)
    if (t - s.last > 0.03) {
      s.last = t
      s.v = s.v * 0.94 + (Math.random() - 0.5) * 0.02 + (0.5 - s.x) * 0.004
      if (Math.random() < 0.01) s.v += (Math.random() - 0.5) * 0.06
      s.x = Math.max(0.08, Math.min(0.92, s.x + s.v))
      s.series.push(s.x)
      const cap = Math.floor(w / 3) + 4
      while (s.series.length > cap) s.series.shift()
    }

    ctx.clearRect(0, 0, w, h)
    drawDotGrid(ctx, w, h, 22, 0.06)

    const chartH = h * 0.52
    const chartY = 24
    const px = (i) => w - 20 - (s.series.length - 1 - i) * 3
    const py = (v) => chartY + (1 - v) * chartH

    // forecast cone from the last point
    const n = s.series.length
    if (n > 2) {
      const lx = px(n - 1)
      const ly = py(s.series[n - 1])
      const horizon = 90
      ctx.beginPath()
      ctx.moveTo(lx, ly)
      for (let k = 0; k <= horizon; k += 6) {
        ctx.lineTo(lx + k, ly - Math.sqrt(k) * 2.6)
      }
      for (let k = horizon; k >= 0; k -= 6) {
        ctx.lineTo(lx + k, ly + Math.sqrt(k) * 2.6)
      }
      ctx.closePath()
      ctx.fillStyle = `rgba(${BLUE}, 0.09)`
      ctx.fill()

      // sampled trajectories inside the cone
      for (let m = 0; m < 3; m++) {
        ctx.strokeStyle = `rgba(${BLUE}, 0.35)`
        ctx.setLineDash([3, 4])
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(lx, ly)
        let yy = ly
        for (let k = 6; k <= horizon; k += 6) {
          yy += Math.sin(t * 1.3 + m * 2.1 + k * 0.12) * 2.4 + (m - 1) * 0.9
          ctx.lineTo(lx + k, yy)
        }
        ctx.stroke()
        ctx.setLineDash([])
      }
    }

    // realized path
    ctx.strokeStyle = `rgba(${ACCENT}, 0.9)`
    ctx.lineWidth = 1.6
    ctx.beginPath()
    for (let i = 0; i < n; i++) {
      const x = px(i)
      if (x < 14) continue
      const y = py(s.series[i])
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    if (n > 0) {
      const lx = px(n - 1)
      const ly = py(s.series[n - 1])
      ctx.fillStyle = `rgba(${ACCENT}, 1)`
      ctx.beginPath()
      ctx.arc(lx, ly, 3, 0, TAU)
      ctx.fill()
      ctx.strokeStyle = `rgba(${ACCENT}, ${0.5 + 0.4 * Math.sin(t * 4)})`
      ctx.beginPath()
      ctx.arc(lx, ly, 7 + Math.sin(t * 4) * 2, 0, TAU)
      ctx.stroke()
    }

    monoLabel(ctx, 'x_1:t  (observed)', 18, chartY + 26, `rgba(${ACCENT}, 0.8)`)
    monoLabel(ctx, 'E[x_t+τ | h_t] ± σ√τ', w - 158, chartY + 26, `rgba(${BLUE}, 0.9)`)

    // --- unrolled recurrent cells ---
    const cellY = h * 0.78
    const nc = Math.min(5, Math.max(3, Math.floor(w / 150)))
    const span = w - 120
    const gap = span / (nc - 1)
    const cx0 = 60

    // hidden-state pulses between cells
    for (let i = 0; i < nc - 1; i++) {
      const xa = cx0 + i * gap + 18
      const xb = cx0 + (i + 1) * gap - 18
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(xa, cellY)
      ctx.lineTo(xb, cellY)
      ctx.stroke()
      const ph = (t * 0.7 + i * 0.23) % 1
      const pxp = xa + (xb - xa) * ph
      ctx.fillStyle = `rgba(${ACCENT}, ${0.9 * Math.sin(ph * Math.PI)})`
      ctx.beginPath()
      ctx.arc(pxp, cellY, 2.4, 0, TAU)
      ctx.fill()
    }

    for (let i = 0; i < nc; i++) {
      const cx = cx0 + i * gap
      // input arrow from chart
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)'
      ctx.setLineDash([2, 4])
      ctx.beginPath()
      ctx.moveTo(cx, chartY + chartH + 8)
      ctx.lineTo(cx, cellY - 26)
      ctx.stroke()
      ctx.setLineDash([])

      // cell body
      ctx.strokeStyle = `rgba(${ACCENT}, 0.75)`
      ctx.lineWidth = 1.3
      ctx.strokeRect(cx - 18, cellY - 16, 36, 32)

      // self-loop (cell state) with orbiting pulse
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cellY - 26, 9, 0, TAU)
      ctx.stroke()
      const oa = t * 2.2 + i * 1.1
      ctx.fillStyle = `rgba(${BLUE}, 0.95)`
      ctx.beginPath()
      ctx.arc(cx + Math.cos(oa) * 9, cellY - 26 + Math.sin(oa) * 9, 2, 0, TAU)
      ctx.fill()

      // gate activations (f, i, o) as oscillating bars
      for (let g = 0; g < 3; g++) {
        const gv = 0.5 + 0.45 * Math.sin(t * 1.7 + i * 0.9 + g * 2.1)
        const bx = cx - 12 + g * 9
        ctx.fillStyle = `rgba(${ACCENT}, ${0.25 + gv * 0.65})`
        ctx.fillRect(bx, cellY + 10 - gv * 20, 5, gv * 20)
      }
    }

    monoLabel(ctx, 'σ(W_f·[h,x])  σ(W_i·[h,x])  σ(W_o·[h,x])', cx0 - 18, cellY + 34, 'rgba(139,152,169,0.75)')
    monoLabel(ctx, 'c_t', cx0 + (nc - 1) * gap + 16, cellY - 24, `rgba(${BLUE}, 0.9)`)
    monoLabel(ctx, 'h_t →', cx0 + (nc - 1) * gap + 24, cellY + 3, `rgba(${ACCENT}, 0.9)`)
  }, [])

  const ref = useCanvasLoop(draw)
  return <canvas ref={ref} className="viz-canvas" aria-label="Animated LSTM sequence forecasting diagram" />
}
