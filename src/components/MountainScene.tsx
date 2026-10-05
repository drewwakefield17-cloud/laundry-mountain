import { useEffect, useRef } from 'react'
import { BEN_NEVIS } from '../domain/config'

export function MountainScene({ metres, close }: { metres: number; close: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const shown = useRef(metres)
  useEffect(() => {
    const el = canvas.current!
    let frame = 0
    const draw = () => {
      const ctx = el.getContext('2d')!
      const w = el.clientWidth, h = el.clientHeight, ratio = Math.min(devicePixelRatio, 2)
      if (el.width !== w * ratio || el.height !== h * ratio) { el.width = w * ratio; el.height = h * ratio }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      shown.current += (metres - shown.current) * .055
      const p = Math.min(1, shown.current / BEN_NEVIS.elevation), route = BEN_NEVIS.route
      const t = p * (route.length - 1), index = Math.min(route.length - 2, Math.floor(t)), f = t - index
      const px = route[index][0] + (route[index + 1][0] - route[index][0]) * f
      const py = route[index][1] + (route[index + 1][1] - route[index][1]) * f
      const sky = ctx.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#c5ddd8'); sky.addColorStop(1, '#f0eee0')
      ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h); ctx.save()
      if (close) { ctx.translate(w * .5, h * .65); ctx.scale(2.1, 2.1); ctx.translate(-px * w, -py * h) }
      const shape = (points: number[][], color: string) => {
        ctx.fillStyle = color; ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h)); ctx.closePath(); ctx.fill()
      }
      shape([[-.2, .6], [.02, .39], [.15, .47], [.3, .27], [.44, .45], [.6, .36], [.78, .48], [1.1, .25], [1.2, 1], [-.2, 1]], '#a3b9ae')
      shape([[-.1, 1], [.09, .64], [.24, .48], [.35, .39], [.45, .28], [.54, .25], [.58, .23], [.68, .23], [.74, .3], [.8, .42], [1.1, .87], [1.1, 1]], BEN_NEVIS.palette.rock)
      shape([[.1, 1], [.3, .62], [.45, .43], [.54, .25], [.57, .44], [.67, .58], [.8, .72], [1.1, 1]], '#83917b')
      shape([[-.1, .9], [.12, .77], [.35, .66], [.5, .59], [.57, .72], [.8, .91], [1.1, 1], [-.1, 1]], BEN_NEVIS.palette.grass)
      shape([[.54, .25], [.58, .23], [.68, .23], [.72, .28], [.63, .3], [.6, .29]], '#b6bab0')
      for (let i = 0; i < 26; i++) {
        const x = .38 + i * .015, y = .48 + i * .012
        ctx.strokeStyle = '#55685a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x * w, y * h); ctx.lineTo((x + .09) * w, (y + .03) * h); ctx.stroke()
      }
      ctx.strokeStyle = '#99bfb8'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(.9 * w, h); ctx.bezierCurveTo(.6 * w, .84 * h, .77 * w, .83 * h, .51 * w, .77 * h); ctx.stroke()
      for (let i = 0; i < 18; i++) {
        const x = (i / 18) * w, y = h * (.93 + Math.sin(i * 4) * .025)
        ctx.fillStyle = i % 3 ? '#3c5940' : '#65735a'; ctx.beginPath(); ctx.ellipse(x, y, 20, 7, 0, 0, Math.PI * 2); ctx.fill()
      }
      ctx.setLineDash([4, 7]); ctx.strokeStyle = '#f9f6e5'; ctx.lineWidth = 2.5; ctx.beginPath()
      route.forEach(([x, y], i) => i ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h)); ctx.stroke(); ctx.setLineDash([])
      for (const n of [0, 2, 4, 6, 7]) {
        ctx.fillStyle = n / 7 <= p ? '#2dbe78' : '#e7e9d9'; ctx.beginPath(); ctx.arc(route[n][0] * w, route[n][1] * h, 4, 0, Math.PI * 2); ctx.fill()
      }
      ctx.strokeStyle = '#12352d'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px * w, py * h); ctx.lineTo(px * w, py * h - 29); ctx.stroke()
      shape([[px, py - 29 / h], [px + 23 / w, py - 23 / h], [px, py - 17 / h]], '#f48a32')
      ctx.fillStyle = '#12352d'; ctx.beginPath(); ctx.arc(px * w, py * h, 6, 0, Math.PI * 2); ctx.fill(); ctx.restore()
      frame = requestAnimationFrame(draw)
    }
    draw(); return () => cancelAnimationFrame(frame)
  }, [metres, close])
  return <canvas ref={canvas} className="mountain-canvas" aria-label={`Ben Nevis stylised route. Your position: ${Math.round(metres)} of 1,345 Laundry Metres.`} role="img" />
}
