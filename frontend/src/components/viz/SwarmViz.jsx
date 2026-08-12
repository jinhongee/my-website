import { useCallback } from 'react'
import useCanvasLoop, { TAU, drawDotGrid, monoLabel } from './useCanvasLoop'

const COHORTS = [
  { rgb: '255, 84, 20', label: 'π_A' },
  { rgb: '106, 165, 255', label: 'π_B' },
  { rgb: '148, 163, 184', label: 'π_C' },
]

// Generative agent population: boid dynamics blended with a swirling
// time-varying vector field; proximity edges = pairwise interactions.
export default function SwarmViz() {
  const draw = useCallback((ctx, w, h, t, s) => {
    if (!s.agents) {
      s.agents = Array.from({ length: 132 }, (_, i) => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        c: i % 3,
      }))
      s.trail = null
    }
    if (s.resized) {
      s.resized = false
      s.trail = null
    }

    // motion trails: fade previous frame instead of clearing
    if (!s.trail) {
      ctx.clearRect(0, 0, w, h)
      s.trail = true
    } else {
      ctx.fillStyle = 'rgba(5, 7, 10, 0.16)'
      ctx.fillRect(0, 0, w, h)
    }
    drawDotGrid(ctx, w, h, 24, 0.045)

    const dt = 0.016
    const agents = s.agents
    const R = 0.085 // neighbour radius (normalized)

    // interaction edges (subsampled for cost)
    ctx.lineWidth = 0.6
    let edges = 0
    for (let i = 0; i < agents.length && edges < 90; i += 2) {
      for (let j = i + 2; j < agents.length && edges < 90; j += 2) {
        const a = agents[i]
        const b = agents[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const d2 = dx * dx + dy * dy
        if (d2 < 0.0035) {
          const alpha = 0.28 * (1 - d2 / 0.0035)
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`
          ctx.beginPath()
          ctx.moveTo(a.x * w, a.y * h)
          ctx.lineTo(b.x * w, b.y * h)
          ctx.stroke()
          edges++
        }
      }
    }

    for (const a of agents) {
      // boid forces
      let cxn = 0, cyn = 0, axn = 0, ayn = 0, sxn = 0, syn = 0, nn = 0
      for (const b of agents) {
        if (a === b) continue
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d2 = dx * dx + dy * dy
        if (d2 > R * R) continue
        nn++
        cxn += b.x
        cyn += b.y
        axn += b.vx
        ayn += b.vy
        if (d2 < 0.0009) {
          sxn -= dx / (d2 + 1e-4)
          syn -= dy / (d2 + 1e-4)
        }
      }
      if (nn > 0) {
        a.vx += ((cxn / nn - a.x) * 0.55 + (axn / nn - a.vx) * 0.28) * dt
        a.vy += ((cyn / nn - a.y) * 0.55 + (ayn / nn - a.vy) * 0.28) * dt
        a.vx += sxn * 0.00035 * dt * 60
        a.vy += syn * 0.00035 * dt * 60
      }

      // swirling environment field (curl-ish, time varying)
      const fa =
        Math.sin(a.x * 5.2 + t * 0.32) * 1.6 +
        Math.cos(a.y * 4.4 - t * 0.24) * 1.6 +
        Math.atan2(a.y - 0.5, a.x - 0.5)
      a.vx += Math.cos(fa + Math.PI / 2) * 0.09 * dt
      a.vy += Math.sin(fa + Math.PI / 2) * 0.09 * dt

      // speed clamp
      const sp = Math.hypot(a.vx, a.vy)
      const smax = 0.16
      const smin = 0.035
      if (sp > smax) {
        a.vx = (a.vx / sp) * smax
        a.vy = (a.vy / sp) * smax
      } else if (sp < smin && sp > 0) {
        a.vx = (a.vx / sp) * smin
        a.vy = (a.vy / sp) * smin
      }

      a.x += a.vx * dt
      a.y += a.vy * dt
      if (a.x < -0.02) a.x = 1.02
      if (a.x > 1.02) a.x = -0.02
      if (a.y < -0.02) a.y = 1.02
      if (a.y > 1.02) a.y = -0.02

      const px = a.x * w
      const py = a.y * h
      const col = COHORTS[a.c].rgb
      ctx.fillStyle = `rgba(${col}, 0.92)`
      ctx.beginPath()
      ctx.arc(px, py, 1.7, 0, TAU)
      ctx.fill()
      // heading tick
      const hd = Math.atan2(a.vy, a.vx)
      ctx.strokeStyle = `rgba(${col}, 0.5)`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(px + Math.cos(hd) * 5, py + Math.sin(hd) * 5)
      ctx.stroke()
    }

    // legend
    ctx.fillStyle = 'rgba(5, 7, 10, 0.7)'
    ctx.fillRect(12, h - 40, 210, 28)
    COHORTS.forEach((c, i) => {
      ctx.fillStyle = `rgba(${c.rgb}, 0.95)`
      ctx.beginPath()
      ctx.arc(24 + i * 66, h - 26, 2.2, 0, TAU)
      ctx.fill()
      monoLabel(ctx, `${c.label}(a|s)`, 31 + i * 66, h - 22, 'rgba(139,152,169,0.85)')
    })
    monoLabel(ctx, `N=${agents.length} agents // interactions: ${String(edges).padStart(2, '0')}`, w - 232, h - 22, 'rgba(139,152,169,0.85)')
  }, [])

  const ref = useCanvasLoop(draw)
  return <canvas ref={ref} className="viz-canvas" aria-label="Animated multi-agent simulation swarm" />
}
