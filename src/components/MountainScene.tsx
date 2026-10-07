import { useEffect, useRef } from 'react'
import { BEN_NEVIS } from '../domain/config'
import { routePosition } from '../domain/expedition'
import { drawHighlands } from './mountainTerrain'
import { scenePoint } from '../domain/terrain'

// Reuse decoded images across views and accepted events. Loading an asset must not
// invalidate the terrain cache again on every player-position update.
type AssetSet = {
      pine: HTMLImageElement
      rocks: HTMLImageElement
      clouds: HTMLImageElement
      meadow: HTMLImageElement
      stone: HTMLImageElement
      marker: HTMLImageElement
      sock: HTMLImageElement
      ground: HTMLImageElement
      paintedSlope: HTMLImageElement
    }
export type SceneryFinish = 'illustrated' | 'natural'
const assetSets: Partial<Record<SceneryFinish, AssetSet>> = {}
export function sceneAssets(finish: SceneryFinish = 'illustrated') {
  let assets = assetSets[finish]
  if (!assets) {
    assets = {
      pine: new Image(),
      rocks: new Image(),
      clouds: new Image(),
      meadow: new Image(),
      stone: new Image(),
      marker: new Image(),
      sock: new Image(),
      ground: new Image(),
      paintedSlope: new Image()
    }
    assets.pine.src = finish === 'natural' ? '/art/individual-highland-pine.webp' : '/art/approved-highland-pine.webp'
    assets.meadow.src = '/textures/illustrated-meadow.webp'
    assets.stone.src = '/textures/highland-crag-material.webp'
    assets.rocks.src = finish === 'natural' ? '/art/highland-boulders.webp' : '/art/approved-boulders.webp'
    assets.clouds.src = finish === 'natural' ? '/art/highland-clouds.webp' : '/art/approved-clouds.webp'
    assets.marker.src = '/brand/laundry-mountain-emblem.webp'
    assets.sock.src = finish === 'natural' ? '/art/sock-checkpoint.png' : '/art/sock-marker-teal.webp'
    assets.ground.src = '/textures/ben-nevis-ground-atlas.webp'
    assets.paintedSlope.src = finish === 'natural' ? '/textures/ben-nevis-natural-material.webp' : '/textures/ben-nevis-view-material.webp'
    assetSets[finish] = assets
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
// Four immutable backdrops cap memory while avoiding repeated surface rendering
// when returning between home, map and a live session. Progress is drawn separately.
const backdrops = new Map<string, { canvas: HTMLCanvasElement; paint: typeof drawHighlands }>()
const NO_GHOSTS: SceneGhost[] = []
const portraits = new Map<string, HTMLImageElement>()
let overviewMaterial: HTMLImageElement | undefined
function detailedOverviewMaterial() {
  if (!overviewMaterial) {
    overviewMaterial = new Image()
    overviewMaterial.src = '/textures/ben-nevis-overview-detail.png'
  }
  return overviewMaterial
}
let overviewBasket: { body: HTMLImageElement; limbs: HTMLImageElement } | undefined
function overviewBasketArtwork() {
  if (!overviewBasket) {
    overviewBasket = { body: new Image(), limbs: new Image() }
    overviewBasket.body.src = '/art/basket-body.png'
    overviewBasket.limbs.src = '/art/basket-limbs.png'
  }
  return overviewBasket
}
export function MountainScene({
  metres,
  close,
  focusMetres,
  showLabel = false,
  scenic = false,
  finish = 'illustrated',
  ghosts = NO_GHOSTS
}: {
  metres: number
  close: boolean
  focusMetres?: number
  showLabel?: boolean
  scenic?: boolean
  finish?: SceneryFinish
  ghosts?: SceneGhost[]
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    shown = useRef(metres)
  const terrainCache = useRef<{
    canvas: HTMLCanvasElement
    width: number
    height: number
    textured: number
    scenic: boolean
    finish: SceneryFinish
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
        scenic: !scenic,
        finish,
        paint: drawHighlands
      })
    let terrain = cache.canvas
    const { pine, rocks, clouds, meadow, stone, marker, sock, ground, paintedSlope } = sceneAssets(finish)
    const routePaint = !scenic && finish === 'natural' ? detailedOverviewMaterial() : undefined
    const completeMask = routePaint ? 255 : 127
    const basketArt = showLabel && finish === 'natural' ? overviewBasketArtwork() : undefined
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
      const drawSock = (x: number, y: number, size = 72) => {
        if (!sock.complete || !sock.naturalWidth) return
        // The illustrated sprite is independent of the geographic mesh and
        // anchored by its platform, so zoom never inflates progress markers.
        ctx.drawImage(sock, x - size / 3, y - size + 3, size * 2 / 3, size)
      }
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      if (close && !scenic) {
        const x = Math.max(0.5 / 2.05, Math.min(1 - 0.5 / 2.05, focus.x)),
          y = Math.max(0.57 / 2.05, Math.min(1 - 0.43 / 2.05, focus.y))
        ctx.translate(width * 0.5, height * 0.57)
        ctx.scale(2.05, 2.05)
        ctx.translate(-x * width, -y * height)
      }
      ctx.drawImage(terrain, 0, 0, width, height)
      // Evidence captures should wait for a painted frame with all scene assets,
      // rather than accepting the empty canvas while its first paint is queued.
      el.dataset.terrainReady = String(cache.textured === completeMask)
      if (scenic) {
        // Small illustrated foreground stones frame the card/medallion. The
        // mountain and stream behind them retain the real geographic projection.
        if (rocks.complete && rocks.naturalWidth) {
          const rockWidth = Math.min(width * 0.26, height * 0.42)
          const rockHeight = (rockWidth * rocks.naturalHeight) / rocks.naturalWidth
          ctx.drawImage(rocks, -rockWidth * 0.14, height - rockHeight + 5, rockWidth, rockHeight)
        }
        ctx.restore()
        return
      }
      // Illustrated Highland framing sits at the edge of the game viewport,
      // separate from the measured mesh. Route markers stay above this frame.
      ctx.save()
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      const foregroundHeight = Math.min(width * 0.55, height * 0.32)
      if (pine.complete && pine.naturalWidth) {
        const treeWidth = (foregroundHeight * pine.naturalWidth) / pine.naturalHeight
        ctx.drawImage(
          pine,
          -treeWidth * 0.35,
          height - foregroundHeight - 20,
          treeWidth,
          foregroundHeight
        )
        ctx.drawImage(
          pine,
          width - treeWidth * 0.34,
          height - foregroundHeight * 0.7 - 20,
          treeWidth * 0.7,
          foregroundHeight * 0.7
        )
      }
      if (rocks.complete && rocks.naturalWidth) {
        const rockWidth = Math.min(width * 0.32, height * 0.34)
        const rockHeight = (rockWidth * rocks.naturalHeight) / rocks.naturalWidth
        ctx.drawImage(rocks, -rockWidth * 0.15, height - rockHeight - 11, rockWidth, rockHeight)
      }
      ctx.restore()
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
      ctx.lineWidth = 4
      path(1)
      ctx.stroke()
      ctx.strokeStyle = '#e2d5b5'
      ctx.lineWidth = 2.5
      path(1)
      ctx.stroke()
      ctx.setLineDash([1, 10])
      ctx.strokeStyle = '#fffde8'
      ctx.lineWidth = 2
      path(1)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.strokeStyle = '#14aa72'
      ctx.lineWidth = 3
      path(player.progress)
      ctx.stroke()
      // Camera zoom affects the world; interface pins retain their phone-size
      // dimensions. Transform their coordinates once, then draw in screen space.
      const worldTransform = ctx.getTransform()
      const markerPosition = (metres: number) => {
        const p = viewportPosition(metres)
        return {
          x:
            (p.x * width * worldTransform.a + p.y * height * worldTransform.c + worldTransform.e) /
            ratio /
            width,
          y:
            (p.x * width * worldTransform.b + p.y * height * worldTransform.d + worldTransform.f) /
            ratio /
            height,
          progress: p.progress
        }
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      for (const checkpoint of BEN_NEVIS.checkpoints) {
        const p = markerPosition(checkpoint.metres),
          reached = metres >= checkpoint.metres
        ctx.fillStyle = reached ? '#2dbe78' : '#faf8e8'
        ctx.strokeStyle = '#31554a'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(p.x * width, p.y * height, 3.5, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }
      const nextCheckpoint = BEN_NEVIS.checkpoints.find((checkpoint) => checkpoint.metres > metres)
      if (nextCheckpoint && nextCheckpoint.metres < BEN_NEVIS.elevation) {
        const next = markerPosition(nextCheckpoint.metres)
        drawSock(next.x * width, next.y * height, 48)
      }
      if (showLabel)
        for (const [ghostIndex, ghost] of ghostImages.entries()) {
          const compact = height < 400,
            portraitRadius = compact ? 11 : 15,
            portraitOffset = compact ? 54 : 24
          const p = markerPosition(ghost.metres),
            gx = Math.max(28, Math.min(width - 28, p.x * width + (ghostIndex % 2 ? -portraitOffset : portraitOffset))),
            gy = p.y * height - (compact ? 8 : 24)
          // Portrait size stays independent of terrain zoom. Socks are reserved
          // for milestones, while demo climbers retain explicit labels.
          ctx.strokeStyle = '#fff9df'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(gx, gy)
          ctx.lineTo(p.x * width, p.y * height)
          ctx.stroke()
          ctx.save()
          ctx.beginPath()
          ctx.arc(gx, gy, portraitRadius, 0, Math.PI * 2)
          ctx.clip()
          ctx.fillStyle = '#9ab9a0'
          ctx.fillRect(gx - portraitRadius, gy - portraitRadius, portraitRadius * 2, portraitRadius * 2)
          if (ghost.portrait.complete && ghost.portrait.naturalWidth)
            ctx.drawImage(ghost.portrait, gx - portraitRadius, gy - portraitRadius, portraitRadius * 2, portraitRadius * 2)
          ctx.restore()
          ctx.beginPath()
          ctx.arc(gx, gy, portraitRadius, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = '#fffcece8'
          ctx.beginPath()
          ctx.roundRect(gx - 19, gy + portraitRadius - 1, 38, 15, 4)
          ctx.fill()
          ctx.fillStyle = '#245347'
          ctx.font = '600 9px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('Demo', gx, gy + portraitRadius + 10)
        }
      const summit = markerPosition(BEN_NEVIS.elevation),
        sx = summit.x * width,
        sy = summit.y * height
      drawSock(sx, sy, 56)
      if (focusMetres !== undefined) {
        const markerFocus = markerPosition(focusMetres)
        ctx.strokeStyle = '#f5bf4f'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(markerFocus.x * width, markerFocus.y * height, 9, 0, Math.PI * 2)
        ctx.stroke()
      }
      const markerPlayer = markerPosition(shown.current)
      const px = markerPlayer.x * width,
        py = markerPlayer.y * height
      if (!basketArt) drawSock(px, py)
      if (showLabel) {
        ctx.save()
        if (basketArt?.body.complete && basketArt.body.naturalWidth && basketArt.limbs.complete && basketArt.limbs.naturalWidth) {
          // Same rigged artwork as active climb, static at the exact route position.
          ctx.translate(px - 26, py - 52)
          ctx.scale(52 / 320, 52 / 320)
          const limb = (sx: number, sy: number, sw: number, sh: number, x: number, y: number, w: number, h: number) =>
            ctx.drawImage(basketArt.limbs, sx, sy, sw, sh, x, y, w, h)
          limb(793, 710, 347, 405, 190, 227, 65, 76)
          limb(813, 132, 267, 407, 257, 137, 43, 83)
          limb(130, 699, 406, 441, 80, 225, 78, 85)
          limb(192, 127, 242, 425, 18, 139, 47, 89)
          ctx.drawImage(basketArt.body, 73, 134, 1114, 1018, 38, 19, 245, 224)
        } else {
          ctx.translate(px, py - 21)
          ctx.fillStyle = '#fffff4'
          ctx.strokeStyle = '#fffce6'
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(0, 0, 16, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          if (marker.complete && marker.naturalWidth) ctx.drawImage(marker, -15, -15, 30, 30)
        }
        ctx.restore()
        const labelWidth = 58,
          labelX = Math.max(5, Math.min(width - labelWidth - 5, basketArt ? (px < width / 2 ? px + 31 : px - labelWidth - 31) : px + 12)),
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
      el.dataset.terrainReady = 'false'
      const textured =
        Number(!!(pine.complete && pine.naturalWidth)) +
        2 * Number(!!(rocks.complete && rocks.naturalWidth)) +
        4 * Number(!!(clouds.complete && clouds.naturalWidth)) +
        8 * Number(!!(meadow.complete && meadow.naturalWidth)) +
        16 * Number(!!(stone.complete && stone.naturalWidth)) +
        32 * Number(!!(ground.complete && ground.naturalWidth)) +
        64 * Number(!!(paintedSlope.complete && paintedSlope.naturalWidth)) +
        128 * Number(!!(routePaint?.complete && routePaint.naturalWidth))
      if (
        cache.width !== el.width ||
        cache.height !== el.height ||
        cache.textured !== textured ||
        cache.scenic !== scenic ||
        cache.finish !== finish ||
        cache.paint !== drawHighlands
      ) {
        const key = `${width}:${height}:${ratio}:${textured}:${scenic}:${finish}`
        const shared = backdrops.get(key)
        const paintStarted = performance.now()
        if (shared?.paint === drawHighlands) {
          terrain = shared.canvas
          backdrops.delete(key)
          backdrops.set(key, shared)
          el.dataset.terrainCache = 'hit'
        } else {
          terrain = document.createElement('canvas')
          terrain.width = el.width
          terrain.height = el.height
          const backdrop = terrain.getContext('2d')!
          backdrop.setTransform(ratio, 0, 0, ratio, 0, 0)
          drawHighlands(
            backdrop,
            width,
            height,
            { pine, rocks, clouds, meadow, stone, ground, paintedSlope, routePaint },
            scenic,
            finish
          )
          backdrops.set(key, { canvas: terrain, paint: drawHighlands })
          while (backdrops.size > 4) backdrops.delete(backdrops.keys().next().value!)
          el.dataset.terrainCache = 'painted'
        }
        cache.canvas = terrain
        el.dataset.terrainRenderMs = (performance.now() - paintStarted).toFixed(1)
        cache.width = el.width
        cache.height = el.height
        cache.textured = textured
        cache.scenic = scenic
        cache.finish = finish
        cache.paint = drawHighlands
      }
      requestDraw()
    }
    // Asset completions and resize notifications in one frame share one expensive paint.
    let resizeFrame = 0
    const loaded = () => {
      if (!disposed && !resizeFrame)
        resizeFrame = requestAnimationFrame(() => {
          resizeFrame = 0
          if (!disposed) resize()
        })
    }
    const observer = new ResizeObserver(loaded)
    observer.observe(el)
    for (const asset of [
      pine,
      rocks,
      clouds,
      meadow,
      stone,
      marker,
      sock,
      ground,
      paintedSlope,
      ...(routePaint ? [routePaint] : []),
      ...(basketArt ? [basketArt.body, basketArt.limbs] : []),
      ...ghostImages.map((g) => g.portrait)
    ])
      asset.addEventListener('load', loaded)
    document.addEventListener('visibilitychange', requestDraw)
    motion.addEventListener('change', requestDraw)
    resize()
    return () => {
      for (const asset of [
        pine,
        rocks,
        clouds,
        meadow,
        stone,
        marker,
        sock,
        ground,
        paintedSlope,
        ...(routePaint ? [routePaint] : []),
        ...(basketArt ? [basketArt.body, basketArt.limbs] : []),
        ...ghostImages.map((g) => g.portrait)
      ])
        asset.removeEventListener('load', loaded)
      disposed = true
      cancelAnimationFrame(frame)
      cancelAnimationFrame(resizeFrame)
      observer.disconnect()
      document.removeEventListener('visibilitychange', requestDraw)
      motion.removeEventListener('change', requestDraw)
    }
  }, [metres, close, focusMetres, showLabel, scenic, finish, ghosts])
  return (
    <canvas
      ref={canvas}
      className="mountain-canvas"
      data-scenery-finish={finish}
      aria-label={
        scenic
          ? 'Illustrated Ben Nevis landscape rendered from real elevation data.'
          : `Ben Nevis terrain and Mountain Path. Your position: ${Math.round(metres)} of 1,345 Laundry Metres.${ghosts.length ? ` Fictional demo climbers: ${ghosts.map((g) => g.name).join(', ')}.` : ''}`
      }
      role="img"
    />
  )
}
