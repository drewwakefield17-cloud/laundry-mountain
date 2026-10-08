import { useEffect, useRef } from 'react'
import { paintPreview } from './previewSurface'
import { sceneAssets } from './MountainScene'

export const EXPEDITIONS = [
  {
    id: 'fuji',
    name: 'Mount Fuji',
    region: 'Japan',
    elevation: 3776,
    difficulty: 'Challenging'
  },
  {
    id: 'everest',
    name: 'Everest',
    region: 'The Himalayas',
    elevation: 8849,
    difficulty: 'Legendary'
  }
] as const
export interface TerrainData {
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
const paintedMaterials = new Map<string, HTMLImageElement>()
const backdrops = new Map<string, { canvas: HTMLCanvasElement; paint: typeof paintPreview }>()
export function paintedMaterial(id: string) {
  let image = paintedMaterials.get(id)
  if (!image) {
    image = new Image()
    image.src = `/textures/${id}-terrain-material.webp`
    paintedMaterials.set(id, image)
  }
  return image
}
export function source(id: string) {
  let result = sources.get(id)
  if (!result) {
    result = fetch(`/data/${id}.json`).then((response) => {
      if (!response.ok) throw new Error('Terrain unavailable')
      return response.json() as Promise<TerrainData>
    }).catch(error => {
      sources.delete(id)
      throw error
    })
    sources.set(id, result)
  }
  return result
}
export function TerrainPreview({ id, name }: { id: string; name: string }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let stopped = false,
      data: TerrainData | undefined,
      frame = 0
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
      const loaded = images.map((image) => Number(image.complete && !!image.naturalWidth)).join('')
      const key = `${id}:${w}:${h}:${dpr}:${loaded}`
      const started = performance.now()
      let backdrop = backdrops.get(key)
      if (backdrop?.paint === paintPreview) {
        backdrops.delete(key)
        el.dataset.terrainCache = 'hit'
      } else {
        const surface = document.createElement('canvas')
        surface.width = el.width
        surface.height = el.height
        const context = surface.getContext('2d')!
        context.setTransform(dpr, 0, 0, dpr, 0, 0)
        paintPreview(context, w, h, data, materials)
        backdrop = { canvas: surface, paint: paintPreview }
        el.dataset.terrainCache = 'painted'
      }
      backdrops.set(key, backdrop)
      while (backdrops.size > 10) backdrops.delete(backdrops.keys().next().value!)
      ctx.drawImage(backdrop.canvas, 0, 0, w, h)
      el.dataset.terrainRenderMs = (performance.now() - started).toFixed(1)
    }
    // Opening a preview should return control before its first paint. Asset and
    // resize notifications in the same frame share one paint, as on Ben Nevis.
    const queuePaint = () => {
      if (!stopped && !frame) frame = requestAnimationFrame(() => {
        frame = 0
        paint()
      })
    }
    const materials = { ...sceneAssets(), ground: paintedMaterial(id) }
    const images = [materials.stone, materials.meadow, materials.clouds, materials.ground]
    images.forEach((image) => image.addEventListener('load', queuePaint))
    const observer = new ResizeObserver(queuePaint)
    observer.observe(el)
    source(id)
      .then((value) => {
        data = value
        queuePaint()
      })
      .catch(() => {
        if (!stopped) el.setAttribute('aria-label', `${name} terrain preview unavailable`)
      })
    return () => {
      stopped = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      images.forEach((image) => image.removeEventListener('load', queuePaint))
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
