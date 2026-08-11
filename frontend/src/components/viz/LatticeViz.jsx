import { useCallback } from 'react'
import useCanvasLoop, { TAU, monoLabel } from './useCanvasLoop'

const ACCENT = '79, 227, 193'
const BLUE = '106, 165, 255'

// Open-weight model training: a parameter lattice with swirling activation
// interference, tensor-parallel shard boundaries, token stream in, loss out.
export default function LatticeViz() {
  const draw = useCallback((ctx, w, h, t, s) => {
    if (!s.tokens) {
      s.tokens = []
      s.tokT = 0
    }

    ctx.clearRect(0, 0, w, h)

    const gx0 = 46
    const gy0 = 40
    const gw = w - 92
    const gh = h - 118
    const cols = Math.max(18, Math.floor(gw / 17))
    const rows = Math.max(10, Math.floor(gh / 17))
    const cw = gw / (cols - 1)
    const ch = gh / (rows - 1)
    const ccx = gx0 + gw / 2
    const ccy = gy0 + gh / 2

    // lattice with spiral interference intensity
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = gx0 + i * cw
        const y = gy0 + j * ch
        const dx = (x - ccx) / gw
        const dy = (y - ccy) / gh
        const r = Math.hypot(dx, dy)
        const th = Math.atan2(dy, dx)
        const v =
          0.5 +
          0.5 *
            Math.sin(th * 3 - r * 14 + t * 1.4) *
            Math.sin(i * 0.31 - j * 0.27 + t * 0.8)
        const a = 0.06 + v * 0.85
        const hot = v > 0.72
        ctx.fillStyle = hot ? `rgba(${ACCENT}, ${a})` : `rgba(${BLUE}, ${a * 0.55})`
        ctx.beginPath()
        ctx.arc(x, y, 0.8 + v * 1.9, 0, TAU)
        ctx.fill()
      }
    }

    // tensor-parallel shard boundaries (2 x 4) with cycling highlight
    const shardCols = 4
    const shardRows = 2
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.16)'
    ctx.lineWidth = 1
    for (let i = 1; i < shardCols; i++) {
      const x = gx0 + (gw * i) / shardCols
      ctx.beginPath()
      ctx.moveTo(x, gy0 - 8)
      ctx.lineTo(x, gy0 + gh + 8)
      ctx.stroke()
    }
    for (let j = 1; j < shardRows; j++) {
      const y = gy0 + (gh * j) / shardRows
      ctx.beginPath()
      ctx.moveTo(gx0 - 8, y)
      ctx.lineTo(gx0 + gw + 8, y)
      ctx.stroke()
    }
    const active = Math.floor(t * 0.9) % (shardCols * shardRows)
    const ai = active % shardCols
    const aj = Math.floor(active / shardCols)
    const sx = gx0 + (gw * ai) / shardCols
    const sy = gy0 + (gh * aj) / shardRows
    const sw = gw / shardCols
    const sh = gh / shardRows
    ctx.strokeStyle = `rgba(${ACCENT}, 0.8)`
    ctx.lineWidth = 1.2
    const cr = 9
    ctx.beginPath()
    for (const [ux, uy] of [[0, 0], [1, 0], [1, 1], [0, 1]]) {
      const px = sx + ux * sw + (ux ? -4 : 4)
      const py = sy + uy * sh + (uy ? -4 : 4)
      const dxs = ux ? -1 : 1
      const dys = uy ? -1 : 1
      ctx.moveTo(px + dxs * cr, py)
      ctx.lineTo(px, py)
      ctx.lineTo(px, py + dys * cr)
    }
    ctx.stroke()
    monoLabel(ctx, `TP shard ${aj * shardCols + ai} // all-reduce`, sx + 8, sy + 16, `rgba(${ACCENT}, 0.95)`)

    // token stream feeding the lattice
    if (t - s.tokT > 0.32) {
      s.tokT = t
      s.tokens.push({ x: w + 10, w: 14 + Math.random() * 34 })
    }
    const ty = h - 44
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)'
    ctx.beginPath()
    ctx.moveTo(gx0 - 20, ty)
    ctx.lineTo(w - 20, ty)
    ctx.stroke()
    for (let i = s.tokens.length - 1; i >= 0; i--) {
      const tok = s.tokens[i]
      tok.x -= 1.6
      if (tok.x + tok.w < gx0 - 24) {
        s.tokens.splice(i, 1)
        continue
      }
      const entering = tok.x < gx0 + 30
      ctx.fillStyle = entering ? `rgba(${ACCENT}, 0.8)` : 'rgba(148, 163, 184, 0.4)'
      ctx.fillRect(tok.x, ty - 5, tok.w, 10)
      ctx.fillStyle = '#05070a'
      ctx.fillRect(tok.x + 1, ty - 4, tok.w - 2, 8)
      ctx.fillStyle = entering ? `rgba(${ACCENT}, 0.5)` : 'rgba(148, 163, 184, 0.25)'
      ctx.fillRect(tok.x + 1, ty - 4, tok.w - 2, 8)
    }
    monoLabel(ctx, 'BPE token stream →', gx0 - 20, ty + 20, 'rgba(139,152,169,0.8)')

    // loss curve (power-law) top right
    const lw = 120
    const lh = 34
    const lx = w - lw - 18
    const ly = 48
    ctx.fillStyle = 'rgba(5, 7, 10, 0.7)'
    ctx.fillRect(lx - 8, ly - 6, lw + 16, lh + 20)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)'
    ctx.strokeRect(lx - 8, ly - 6, lw + 16, lh + 20)
    ctx.strokeStyle = `rgba(${BLUE}, 0.9)`
    ctx.lineWidth = 1.2
    ctx.beginPath()
    for (let i = 0; i <= lw; i += 2) {
      const u = i / lw
      const v = Math.pow(u + 0.035, -0.32) - 0.62 + Math.sin(i * 1.7) * 0.015
      const y = ly + lh - Math.min(1, Math.max(0, v)) * lh
      if (i === 0) ctx.moveTo(lx + i, y)
      else ctx.lineTo(lx + i, y)
    }
    ctx.stroke()
    const mu = (t * 0.06) % 1
    const mv = Math.pow(mu + 0.035, -0.32) - 0.62
    ctx.fillStyle = `rgba(${ACCENT}, 1)`
    ctx.beginPath()
    ctx.arc(lx + mu * lw, ly + lh - Math.min(1, Math.max(0, mv)) * lh, 2.2, 0, TAU)
    ctx.fill()
    monoLabel(ctx, 'L(C) ∝ C^-α', lx - 2, ly + lh + 10, 'rgba(139,152,169,0.85)')

    monoLabel(ctx, 'W ∈ R^{d×d} // multilingual corpus', w - 248, ty + 20, 'rgba(139,152,169,0.8)')
  }, [])

  const ref = useCanvasLoop(draw)
  return <canvas ref={ref} className="viz-canvas" aria-label="Animated parameter lattice with tensor-parallel shards and token stream" />
}
