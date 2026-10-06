import { useEffect, useRef } from 'react'

export const EXPEDITIONS = [
  {
    id: 'fuji',
    name: 'Mount Fuji',
    region: 'Japan',
    elevation: 3776,
    difficulty: 'Challenging'
  },
  {
    id: 'matterhorn',
    name: 'Matterhorn',
    region: 'The Alps',
    elevation: 4478,
    difficulty: 'Challenging'
  },
  {
    id: 'kilimanjaro',
    name: 'Kilimanjaro',
    region: 'Tanzania',
    elevation: 5895,
    difficulty: 'Expert'
  },
  {
    id: 'denali',
    name: 'Denali',
    region: 'Alaska',
    elevation: 6190,
    difficulty: 'Expert'
  },
  {
    id: 'everest',
    name: 'Everest',
    region: 'The Himalayas',
    elevation: 8849,
    difficulty: 'Legendary'
  }
] as const
interface TerrainData {
  size: number
  heights: number[]
  span: number
  heading: number
  datum: number
  snow: number
  forest: number
  elevation: number
  id: string
}
const sources = new Map<string, Promise<TerrainData>>()
function source(id: string) {
  let result = sources.get(id)
  if (!result) {
    result = fetch(`/data/${id}.json`).then((response) => {
      if (!response.ok) throw new Error('Terrain unavailable')
      return response.json() as Promise<TerrainData>
    })
    sources.set(id, result)
  }
  return result
}
const clamp = (n: number, min = 0, max = 1) => Math.max(min, Math.min(max, n))

// The locked expedition cards use their own measured meshes. Surface colours
// are illustrative seasonal treatments, not surveyed glacier/forest boundaries.
function draw(ctx: CanvasRenderingContext2D, w: number, h: number, data: TerrainData) {
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#8ecfdf')
  sky.addColorStop(0.7, '#edf6e9')
  sky.addColorStop(1, '#ecedcb')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)
  const a = (data.heading * Math.PI) / 180,
    tilt = (17 * Math.PI) / 180,
    n = data.size,
    step = data.span / (n - 1)
  const scale = Math.min(w / (data.span * 0.45), h / (((data.elevation - data.datum) / 1000) * 1.65))
  const vertices = data.heights.map((metres, i) => {
    const x = ((i % n) / (n - 1) - 0.5) * data.span,
      z = (Math.floor(i / n) / (n - 1) - 0.5) * data.span
    const depth = x * Math.sin(a) + z * Math.cos(a),
      right = x * Math.cos(a) - z * Math.sin(a)
    return {
      x: w * 0.5 + right * scale,
      y: h * 0.76 - (depth * Math.sin(tilt) + ((metres - data.datum) / 1000) * Math.cos(tilt)) * scale,
      depth,
      metres
    }
  })
  const cells = []
  for (let j = 0; j < n - 1; j++)
    for (let i = 0; i < n - 1; i++) cells.push({ i, j, depth: vertices[j * n + i].depth })
  cells.sort((a, b) => b.depth - a.depth)
  ctx.lineWidth = 0.5
  for (const { i, j, depth } of cells) {
    const k = j * n + i,
      aa = vertices[k],
      bb = vertices[k + 1],
      cc = vertices[k + n],
      dd = vertices[k + n + 1]
    if (
      Math.max(aa.x, bb.x, cc.x, dd.x) < 0 ||
      Math.min(aa.x, bb.x, cc.x, dd.x) > w ||
      Math.min(aa.y, bb.y, cc.y, dd.y) > h ||
      Math.max(aa.y, bb.y, cc.y, dd.y) < 0
    )
      continue
    const dx = (bb.metres - aa.metres) / (step * 1000),
      dz = (cc.metres - aa.metres) / (step * 1000),
      slope = Math.hypot(dx, dz)
    const light = clamp((0.75 + dx * 0.8 - dz * 0.55) / Math.hypot(1, dx, dz), 0.12, 1.1)
    const height = (aa.metres + bb.metres + cc.metres + dd.metres) / 4
    const snow = clamp((height - data.snow) / 350) * clamp(1.8 - slope * 0.75)
    const green = height < data.forest,
      volcanic = data.id === 'fuji' || data.id === 'kilimanjaro'
    const base = green ? [57, 113, 73] : volcanic ? [142, 133, 112] : [136, 152, 156]
    const mist = clamp((depth / data.span + 0.18) * 0.5, 0, 0.36)
    const color = base.map((b, k) => {
      const c =
        (b * (1 - snow) + [251, 250, 231][k] * snow) * (light * 0.65 + 0.4) + (1 - light) * [6, 19, 32][k]
      return Math.round(c * (1 - mist) + [164, 206, 214][k] * mist)
    })
    ctx.fillStyle = `rgb(${color.join(',')})`
    ctx.strokeStyle = ctx.fillStyle
    ctx.beginPath()
    ctx.moveTo(aa.x, aa.y)
    ctx.lineTo(bb.x, bb.y)
    ctx.lineTo(dd.x, dd.y)
    ctx.lineTo(cc.x, cc.y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
}
export function TerrainPreview({ id, name }: { id: string; name: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let stopped = false,
      data: TerrainData | undefined
    const el = canvas.current!,
      ctx = el.getContext('2d')!
    const paint = () => {
      if (stopped || !data || !el.clientWidth || !el.clientHeight) return
      const dpr = Math.min(devicePixelRatio || 1, 2),
        w = el.clientWidth,
        h = el.clientHeight
      el.width = Math.round(w * dpr)
      el.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(ctx, w, h, data)
    }
    const observer = new ResizeObserver(paint)
    observer.observe(el)
    source(id)
      .then((value) => {
        data = value
        paint()
      })
      .catch(() => {
        if (!stopped) el.setAttribute('aria-label', `${name} terrain preview unavailable`)
      })
    return () => {
      stopped = true
      observer.disconnect()
    }
  }, [id, name])
  return (
    <canvas
      ref={canvas}
      className="terrain-preview"
      role="img"
      aria-label={`${name} geographic terrain preview`}
    />
  )
}
