import { useEffect, useRef } from 'react'
import { BEN_NEVIS } from '../domain/config'
import { routePosition } from '../domain/expedition'
import { drawHighlands } from './mountainTerrain'
import { scenePoint } from '../domain/terrain'

// Reuse decoded images across views and accepted events. Loading an asset must not
// invalidate the terrain cache again on every player-position update.
let assets:
  | {
      pine: HTMLImageElement
      rocks: HTMLImageElement
      clouds: HTMLImageElement
      meadow: HTMLImageElement
      stone: HTMLImageElement
    }
  | undefined
function sceneAssets() {
  if (!assets) {
    assets = {
      pine: new Image(),
      rocks: new Image(),
      clouds: new Image(),
      meadow: new Image(),
      stone: new Image()
    }
    assets.pine.src = '/art/illustrated-pines.webp'
    assets.meadow.src = '/textures/illustrated-meadow.webp'
    assets.stone.src = '/textures/illustrated-rock.webp'
    assets.rocks.src = '/art/highland-boulders.webp'
    assets.clouds.src = '/art/highland-clouds.webp'
  }
  return assets
}
export interface SceneGhost {
  id: string
  name: string
  metres: number
  avatar: string
  is_demo: true
}
const NO_GHOSTS: SceneGhost[] = []
const portraits = new Map<string, HTMLImageElement>()
export function MountainScene({
  metres,
  close,
  focusMetres,
  showLabel = false,
  ghosts = NO_GHOSTS
}: {
  metres: number
  close: boolean
  focusMetres?: number
  showLabel?: boolean
  ghosts?: SceneGhost[]
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    shown = useRef(metres)
  const terrainCache = useRef<{
    canvas: HTMLCanvasElement
    width: number
    height: number
    textured: number
    paint: typeof drawHighlands
  } | null>(null)
  useEffect(() => {
    const el = canvas.current!,
      ctx = el.getContext('2d')!
    const cache =
      terrainCache.current ??
      (terrainCache.current = {
        canvas: document.createElement('canvas'),
        width: 0,
        height: 0,
        textured: 0,
        paint: drawHighlands
      })
    const terrain = cache.canvas,
      backdrop = terrain.getContext('2d')!
    const { pine, rocks, clouds, meadow, stone } = sceneAssets()
    const ghostImages = ghosts.map((ghost) => {
      let portrait = portraits.get(ghost.avatar)
      if (!portrait) {
        portrait = new Image()
        portrait.src = ghost.avatar
        portraits.set(ghost.avatar, portrait)
      }
      return { ...ghost, portrait }
    })
    let frame = 0,
      width = 0,
      height = 0,
      ratio = 1,
      disposed = false
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const draw = () => {
      frame = 0
      if (disposed || !width || !height || document.hidden) return
      const difference = metres - shown.current
      shown.current =
        motion.matches || Math.abs(difference) < 0.05 ? metres : shown.current + difference * 0.14
      const viewportPosition = (metres: number) => {
        const p = routePosition(metres),
          screen = scenePoint(p, width, height)
        return {
          x: screen.x / width,
          y: screen.y / height,
          progress: p.progress
        }
      }
      const player = viewportPosition(shown.current),
        focus = viewportPosition(focusMetres ?? shown.current)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      if (close) {
        const x = Math.max(0.5 / 2.05, Math.min(1 - 0.5 / 2.05, focus.x)),
          y = Math.max(0.57 / 2.05, Math.min(1 - 0.43 / 2.05, focus.y))
        ctx.translate(width * 0.5, height * 0.57)
        ctx.scale(2.05, 2.05)
        ctx.translate(-x * width, -y * height)
      }
      ctx.drawImage(terrain, 0, 0, width, height)
      const path = (progress: number) => {
        ctx.beginPath()
        const t = progress * (BEN_NEVIS.route.length - 1),
          last = Math.floor(t)
        BEN_NEVIS.route.forEach(([x, y], i) => {
          const p = scenePoint({ x, y }, width, height)
          if (i <= last) i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)
        })
        const end = viewportPosition(progress * BEN_NEVIS.elevation)
        ctx.lineTo(end.x * width, end.y * height)
      }
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.strokeStyle = '#18392b70'
      ctx.lineWidth = 6
      path(1)
      ctx.stroke()
      ctx.strokeStyle = '#ddd0a4'
      ctx.lineWidth = 3.5
      path(1)
      ctx.stroke()
      ctx.setLineDash([1, 7])
      ctx.strokeStyle = '#fffde8'
      ctx.lineWidth = 2.5
      path(1)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.strokeStyle = '#42e59c'
      ctx.lineWidth = 4
      path(player.progress)
      ctx.stroke()
      for (const checkpoint of BEN_NEVIS.checkpoints) {
        const p = viewportPosition(checkpoint.metres),
          reached = metres >= checkpoint.metres
        ctx.fillStyle = reached ? '#2dbe78' : '#faf8e8'
        ctx.strokeStyle = '#31554a'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(p.x * width, p.y * height, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }
      if (showLabel)
        for (const [ghostIndex, ghost] of ghostImages.entries()) {
          const p = viewportPosition(ghost.metres),
            gx = p.x * width + (ghostIndex % 2 ? -20 : 20),
            gy = p.y * height - 15
          ctx.strokeStyle = '#fff9df'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(gx, gy)
          ctx.lineTo(p.x * width, p.y * height)
          ctx.stroke()
          ctx.save()
          ctx.beginPath()
          ctx.arc(gx, gy, 14, 0, Math.PI * 2)
          ctx.clip()
          ctx.fillStyle = '#9ab9a0'
          ctx.fillRect(gx - 14, gy - 14, 28, 28)
          if (ghost.portrait.complete && ghost.portrait.naturalWidth)
            ctx.drawImage(ghost.portrait, gx - 14, gy - 14, 28, 28)
          ctx.restore()
          ctx.beginPath()
          ctx.arc(gx, gy, 14, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = '#fffcece8'
          ctx.beginPath()
          ctx.roundRect(gx - 17, gy + 13, 34, 13, 5)
          ctx.fill()
          ctx.fillStyle = '#245347'
          ctx.font = '600 8px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('Demo', gx, gy + 22)
        }
      const summit = viewportPosition(BEN_NEVIS.elevation),
        sx = summit.x * width,
        sy = summit.y * height
      ctx.fillStyle = '#d6d6bd'
      ctx.beginPath()
      ctx.moveTo(sx - 5, sy + 2)
      ctx.lineTo(sx, sy - 7)
      ctx.lineTo(sx + 5, sy + 2)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#435b50'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(sx, sy - 5)
      ctx.lineTo(sx, sy - 24)
      ctx.stroke()
      ctx.fillStyle = '#f5bf4f'
      ctx.beginPath()
      ctx.moveTo(sx, sy - 24)
      ctx.lineTo(sx + 13, sy - 20)
      ctx.lineTo(sx, sy - 16)
      ctx.closePath()
      ctx.fill()
      if (focusMetres !== undefined) {
        ctx.strokeStyle = '#f5bf4f'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(focus.x * width, focus.y * height, 9, 0, Math.PI * 2)
        ctx.stroke()
      }
      const px = player.x * width,
        py = player.y * height
      ctx.fillStyle = '#12352d'
      ctx.beginPath()
      ctx.ellipse(px, py + 2, 7, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#fff8e2'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(px, py - 26)
      ctx.stroke()
      ctx.fillStyle = '#f48a32'
      ctx.beginPath()
      ctx.moveTo(px + 1, py - 26)
      ctx.quadraticCurveTo(px + 11, py - 28, px + 19, py - 21)
      ctx.lineTo(px + 1, py - 15)
      ctx.closePath()
      ctx.fill()
      if (showLabel) {
        const labelWidth = 58,
          labelX = Math.max(5, Math.min(width - labelWidth - 5, px + 12)),
          labelY = py - 52
        ctx.fillStyle = '#fffde9'
        ctx.strokeStyle = '#087c5a'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(labelX, labelY, labelWidth, 40, 9)
        ctx.fill()
        ctx.stroke()
        ctx.textAlign = 'center'
        ctx.fillStyle = '#163a49'
        ctx.font = '600 10px sans-serif'
        ctx.fillText('You', labelX + 29, labelY + 13)
        ctx.font = '800 15px sans-serif'
        ctx.fillText(`${(player.progress * 100).toFixed(0)}%`, labelX + 29, labelY + 30)
      }
      ctx.restore()
      if (Math.abs(metres - shown.current) > 0.01) frame = requestAnimationFrame(draw)
    }
    const requestDraw = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(draw)
    }
    const resize = () => {
      width = el.clientWidth
      height = el.clientHeight
      ratio = Math.min(devicePixelRatio || 1, 2)
      if (!width || !height) return
      el.width = Math.round(width * ratio)
      el.height = Math.round(height * ratio)
      const textured =
        Number(!!(pine.complete && pine.naturalWidth)) +
        Number(!!(rocks.complete && rocks.naturalWidth)) +
        Number(!!(clouds.complete && clouds.naturalWidth)) +
        Number(!!(meadow.complete && meadow.naturalWidth)) +
        Number(!!(stone.complete && stone.naturalWidth))
      if (
        cache.width !== el.width ||
        cache.height !== el.height ||
        cache.textured !== textured ||
        cache.paint !== drawHighlands
      ) {
        terrain.width = el.width
        terrain.height = el.height
        backdrop.setTransform(ratio, 0, 0, ratio, 0, 0)
        drawHighlands(backdrop, width, height, {
          pine,
          rocks,
          clouds,
          meadow,
          stone
        })
        cache.width = el.width
        cache.height = el.height
        cache.textured = textured
        cache.paint = drawHighlands
      }
      requestDraw()
    }
    const observer = new ResizeObserver(resize)
    observer.observe(el)
    const loaded = () => {
      if (!disposed) resize()
    }
    for (const asset of [pine, rocks, clouds, meadow, stone, ...ghostImages.map((g) => g.portrait)])
      asset.addEventListener('load', loaded)
    document.addEventListener('visibilitychange', requestDraw)
    motion.addEventListener('change', requestDraw)
    resize()
    return () => {
      for (const asset of [pine, rocks, clouds, meadow, stone, ...ghostImages.map((g) => g.portrait)])
        asset.removeEventListener('load', loaded)
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener('visibilitychange', requestDraw)
      motion.removeEventListener('change', requestDraw)
    }
  }, [metres, close, focusMetres, showLabel, ghosts])
  return (
    <canvas
      ref={canvas}
      className="mountain-canvas"
      aria-label={`Ben Nevis terrain and Mountain Path. Your position: ${Math.round(metres)} of 1,345 Laundry Metres.${ghosts.length ? ` Fictional demo climbers: ${ghosts.map((g) => g.name).join(', ')}.` : ''}`}
      role="img"
    />
  )
}
