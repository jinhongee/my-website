import { useEffect, useRef } from 'react'

// Shared rAF canvas loop: handles DPR scaling, resize, cleanup.
// draw(ctx, w, h, t, state) — t in seconds, state persists across frames.
export default function useCanvasLoop(draw) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    let w = 0
    let h = 0
    let t0 = null // anchored to the first rAF timestamp — it can predate performance.now()
    const state = {}

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      state.resized = true
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const loop = (now) => {
      if (t0 === null) t0 = now
      // a zero-size first frame (layout not settled) must not kill the loop
      if (w > 10 && h > 10) {
        try {
          draw(ctx, w, h, (now - t0) / 1000, state)
        } catch (e) {
          if (!state.warned) {
            state.warned = true
            console.error('viz draw error:', e)
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [draw])
  return ref
}

export const TAU = Math.PI * 2

// figure palette — ink on paper, drawn from the page's own tokens so the
// panels read as part of the site rather than embedded instruments
export const PAPER = '#ffffff'
export const INK = '84, 92, 104'
export const ACCENT = '255, 69, 0'
export const BLUE = '31, 95, 191'
export const ALERT = '193, 42, 32'

export function drawDotGrid(ctx, w, h, spacing = 24, alpha = 0.1) {
  ctx.fillStyle = `rgba(${INK}, ${alpha})`
  for (let x = spacing / 2; x < w; x += spacing) {
    for (let y = spacing / 2; y < h; y += spacing) {
      ctx.fillRect(x - 0.5, y - 0.5, 1, 1)
    }
  }
}

export function monoLabel(ctx, text, x, y, color = 'rgba(106, 106, 106, 0.85)', size = 9) {
  ctx.font = `500 ${size}px "IBM Plex Mono", monospace`
  ctx.fillStyle = color
  ctx.fillText(text, x, y)
}
