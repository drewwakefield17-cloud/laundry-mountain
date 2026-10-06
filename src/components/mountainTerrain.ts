import {
  BEN_NEVIS_GEOGRAPHY as geo,
  WORLD,
  cameraDepth,
  viewDepth,
  heightAt,
  projectWorld,
  scenePoint,
  terrainNoise
} from '../domain/terrain'
export interface SceneAssets {
  pine?: HTMLImageElement
  rocks?: HTMLImageElement
  clouds?: HTMLImageElement
  meadow?: HTMLImageElement
  stone?: HTMLImageElement
}
const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
// Geographic land-cover raster, built once from mapped polygons/river geometry.
// It is a lookup table for material selection, never a background image.
let land: Uint8ClampedArray | undefined
const LAND_SIZE = 1024
function landCover() {
  if (land) return land
  const el = document.createElement('canvas')
  el.width = el.height = LAND_SIZE
  const c = el.getContext('2d', { willReadFrequently: true })!
  c.fillStyle = '#000000'
  c.fillRect(0, 0, LAND_SIZE, LAND_SIZE)
  for (const kind of ['wood', 'water', 'river'])
    for (const feature of geo.features) {
      if (feature.kind !== kind || (kind === 'river' && feature.name !== 'River Nevis')) continue
      c.beginPath()
      feature.points.forEach(([x, z], i) => {
        const px = ((x - WORLD.minX) / 13) * LAND_SIZE,
          py = ((z - WORLD.near) / 13) * LAND_SIZE
        if (i) c.lineTo(px, py)
        else c.moveTo(px, py)
      })
      if (kind === 'river') {
        c.strokeStyle = '#0000ff'
        c.lineWidth = feature.name === 'River Nevis' ? 2 : 0.45
        c.stroke()
      } else {
        c.closePath()
        c.fillStyle = kind === 'wood' ? '#00ff00' : '#0000ff'
        c.fill()
      }
    }
  land = c.getImageData(0, 0, LAND_SIZE, LAND_SIZE).data
  return land
}
function coverAt(data: Uint8ClampedArray, x: number, z: number) {
  const ix = clamp(Math.floor(((x + 6.5) / 13) * LAND_SIZE), 0, LAND_SIZE - 1)
  const iz = clamp(Math.floor(((z + 6.5) / 13) * LAND_SIZE), 0, LAND_SIZE - 1),
    i = (iz * LAND_SIZE + ix) * 4
  return { wood: data[i + 1] > 100, water: data[i + 2] > 80 }
}
const materialCache = new WeakMap<HTMLImageElement, Uint8ClampedArray>()
function material(image?: HTMLImageElement) {
  if (!image?.complete || !image.naturalWidth) return undefined
  let data = materialCache.get(image)
  if (!data) {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const ctx = c.getContext('2d')!
    ctx.drawImage(image, 0, 0, 128, 128)
    data = ctx.getImageData(0, 0, 128, 128).data
    materialCache.set(image, data)
  }
  return data
}
type Vertex = { x: number; y: number; wx: number; wz: number; height: number; invDepth: number }
export function drawHighlands(ctx: CanvasRenderingContext2D, w: number, h: number, assets: SceneAssets = {}) {
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#80cbd8')
  sky.addColorStop(0.55, '#e5f3df')
  sky.addColorStop(1, '#e3e9bf')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)
  if (assets.clouds?.complete && assets.clouds.naturalWidth) {
    ctx.save()
    ctx.globalAlpha = 0.72
    ctx.drawImage(assets.clouds, -w * 0.15, -w * 0.12, w * 1.1, w * 0.6)
    ctx.restore()
  }
  const cover = landCover(),
    meadow = material(assets.meadow),
    stone = material(assets.stone)
  const grid: Vertex[][] = []
  const { size, stepKm, minKm } = geo.grid
  for (let j = 0; j < size; j++) {
    const line: Vertex[] = []
    for (let i = 0; i < size; i++) {
      const wx = minKm + i * stepKm,
        wz = minKm + j * stepKm,
        height = geo.heights[j * size + i] / 1000
      const p = scenePoint(projectWorld(wx, wz, height), w, h)
      line.push({ ...p, wx, wz, height, invDepth: 1 / viewDepth(wx, wz, height) })
    }
    grid.push(line)
  }
  // Sort faces by camera depth so foreground slopes cover the distant terrain.
  const cells: Array<{ i: number; j: number; depth: number }> = []
  for (let j = 0; j < size - 1; j++)
    for (let i = 0; i < size - 1; i++)
      cells.push({
        i,
        j,
        depth: cameraDepth(minKm + (i + 0.5) * stepKm, minKm + (j + 0.5) * stepKm)
      })
  cells.sort((a, b) => b.depth - a.depth)
  // Rasterise surface materials in world space. A single colour per 50 m face
  // discarded the painted detail and made mapped woodland edges look triangular.
  // This is a cached Canvas 2D material pass, not new terrain or a scene image.
  const density = Math.min(1.6, 1200 / Math.max(w, h))
  const sw = Math.ceil(w * density),
    sh = Math.ceil(h * density)
  const surface = document.createElement('canvas')
  surface.width = sw
  surface.height = sh
  const surfaceContext = surface.getContext('2d')!
  const pixels = surfaceContext.createImageData(sw, sh)
  const depth = new Float32Array(sw * sh)
  const grassPalette = [
    [14, 55, 52],
    [32, 88, 64],
    [81, 124, 58],
    [139, 170, 76],
    [207, 213, 132]
  ]
  const rockPalette = [
    [16, 41, 64],
    [35, 68, 95],
    [82, 113, 131],
    [158, 177, 174],
    [240, 218, 170]
  ]
  const face = (a: Vertex, b: Vertex, c: Vertex) => {
    if (Math.max(a.invDepth, b.invDepth, c.invDepth) > 1 / 0.75) return
    const ax = a.x * density,
      ay = a.y * density,
      bx = b.x * density,
      by = b.y * density,
      cx = c.x * density,
      cy = c.y * density
    const x0 = Math.max(0, Math.floor(Math.min(ax, bx, cx))),
      x1 = Math.min(sw - 1, Math.ceil(Math.max(ax, bx, cx)))
    const y0 = Math.max(0, Math.floor(Math.min(ay, by, cy))),
      y1 = Math.min(sh - 1, Math.ceil(Math.max(ay, by, cy)))
    if (x0 > x1 || y0 > y1) return
    const area = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy)
    if (Math.abs(area) < 0.001) return
    const det = (b.wx - a.wx) * (c.wz - a.wz) - (c.wx - a.wx) * (b.wz - a.wz)
    const dx = ((b.height - a.height) * (c.wz - a.wz) - (c.height - a.height) * (b.wz - a.wz)) / det
    const dz = ((c.height - a.height) * (b.wx - a.wx) - (b.height - a.height) * (c.wx - a.wx)) / det
    const slope = Math.hypot(dx, dz)
    const light = clamp((0.65 + dx * 0.7 - dz * 0.85) / Math.hypot(1, dx, dz), 0.01, 1)
    const wx = (a.wx + b.wx + c.wx) / 3,
      wz = (a.wz + b.wz + c.wz) / 3
    const curvature =
      (heightAt(wx + 0.05, wz) +
        heightAt(wx - 0.05, wz) +
        heightAt(wx, wz + 0.05) +
        heightAt(wx, wz - 0.05) -
        4 * heightAt(wx, wz)) /
      0.01
    const crevice = clamp(curvature, 0, 0.5)
    for (let py = y0; py <= y1; py++)
      for (let px = x0; px <= x1; px++) {
        const u = ((by - cy) * (px + 0.5 - cx) + (cx - bx) * (py + 0.5 - cy)) / area
        const v = ((cy - ay) * (px + 0.5 - cx) + (ax - cx) * (py + 0.5 - cy)) / area
        const q = 1 - u - v
        if (u < -0.0001 || v < -0.0001 || q < -0.0001) continue
        const inverse = u * a.invDepth + v * b.invDepth + q * c.invDepth,
          index = py * sw + px
        if (inverse <= depth[index]) continue
        depth[index] = inverse
        // Perspective-correct coordinates keep the material attached during resize/zoom.
        const ua = (u * a.invDepth) / inverse,
          vb = (v * b.invDepth) / inverse,
          qc = (q * c.invDepth) / inverse
        const x = ua * a.wx + vb * b.wx + qc * c.wx,
          z = ua * a.wz + vb * b.wz + qc * c.wz
        const elevation = ua * a.height + vb * b.height + qc * c.height
        const land = coverAt(cover, x, z)
        const patch = terrainNoise(x * 14, z * 14)
        const rock = clamp((elevation - 0.5) * 3.4 + (slope - 0.38) * 0.9 + (patch - 0.5) * 0.35)
        // Repeat a small painted material across the real slopes. Use luminance
        // for crevices, with the scene palette supplying coherent ink/sun colours.
        const warp = terrainNoise(x * 7, z * 7) * 0.055
        const tx = ((Math.floor((x + elevation * 0.7 + warp) * 240) % 128) + 128) % 128
        const tz = ((Math.floor((z + elevation * 1.4 - warp) * 240) % 128) + 128) % 128
        const ti = (tz * 128 + tx) * 4
        const stoneLight = stone
          ? (stone[ti] * 0.25 + stone[ti + 1] * 0.55 + stone[ti + 2] * 0.2) / 255
          : 0.55
        const grassLight = meadow ? (meadow[ti] + meadow[ti + 1] + meadow[ti + 2]) / 765 : 0.5
        const grain = lerp((grassLight - 0.5) * 0.7, (stoneLight - 0.47) * 3.4, rock)
        const shade = clamp(light * 3.8 - crevice * rock * 0.6 + grain, 0, 3.999)
        const low = Math.floor(shade),
          blend = shade - low
        const fog = clamp((cameraDepth(x, z) - 0.3) * 0.07, 0, 0.53)
        const offset = index * 4
        // Fine canopy clusters give the woods depth while staying inside mapped polygons.
        const canopy = land.wood ? terrainNoise(x * 220, z * 220) : 0
        const grove = land.wood ? terrainNoise(x * 42, z * 42) : 0
        for (let k = 0; k < 3; k++) {
          const turf = lerp(grassPalette[low][k], grassPalette[low + 1][k], blend)
          const crag = lerp(rockPalette[low][k], rockPalette[low + 1][k], blend)
          let value = lerp(turf, crag, rock)
          if (land.wood)
            value = lerp(
              [10, 48, 49][k],
              [121, 160, 81][k],
              clamp(canopy * 0.57 + grove * 0.24 + light * 0.22 - 0.12)
            )
          if (land.water)
            value = lerp(
              [12, 90, 118][k],
              [116, 213, 211][k],
              clamp(0.24 + light * 0.35 + terrainNoise(x * 240, z * 1200) * 0.25)
            )
          pixels.data[offset + k] = Math.round(lerp(value, [146, 191, 204][k], fog))
        }
        pixels.data[offset + 3] = 255
      }
  }
  for (const { i, j } of cells) {
    const a = grid[j][i],
      b = grid[j][i + 1],
      c = grid[j + 1][i],
      d = grid[j + 1][i + 1]
    face(a, b, c)
    face(b, d, c)
  }
  // An ink-soft contour at real occlusion boundaries gives distant ridges a
  // readable edge. It traces the depth buffer rather than inventing peak outlines.
  for (let y = 1; y < sh - 1; y++)
    for (let x = 1; x < sw - 1; x++) {
      const i = y * sw + x
      if (!depth[i]) continue
      const above = depth[i - sw],
        left = depth[i - 1]
      if (!above || depth[i] - above > 0.0035 || (left && depth[i] - left > 0.0045)) {
        const k = i * 4
        pixels.data[k] = lerp(pixels.data[k], 28, 0.42)
        pixels.data[k + 1] = lerp(pixels.data[k + 1], 66, 0.42)
        pixels.data[k + 2] = lerp(pixels.data[k + 2], 78, 0.42)
      }
    }
  surfaceContext.putImageData(pixels, 0, 0)
  ctx.drawImage(surface, 0, 0, w, h)
  // Individual small trees are constrained to mapped woodland. No alpine forest
  // is invented around the summit or lochan. Tree height is in world metres.
  const pine = assets.pine
  if (pine?.complete && pine.naturalWidth) {
    let seed = 317
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    const trees = Array.from({ length: 42000 }, () => ({
      x: lerp(-6, 1, random()),
      z: lerp(-3, 6, random()),
      size: lerp(0.015, 0.027, random())
    }))
      .filter((p) => coverAt(cover, p.x, p.z).wood && heightAt(p.x, p.z) < 0.55)
      .sort((a, b) => cameraDepth(b.x, b.z) - cameraDepth(a.x, a.z))
    for (const t of trees) {
      const p = scenePoint(projectWorld(t.x, t.z), w, h),
        top = scenePoint(projectWorld(t.x, t.z, heightAt(t.x, t.z) + t.size), w, h)
      const th = p.y - top.y,
        tw = (th * pine.naturalWidth) / pine.naturalHeight
      if (p.x < 0 || p.x > w || p.y < 0 || p.y > h || th < 0.5) continue
      // Hide sprites behind intervening terrain; ground depth is the same real mesh.
      const screenIndex =
        Math.min(sh - 1, Math.floor(p.y * density)) * sw + Math.min(sw - 1, Math.floor(p.x * density))
      if (1 / viewDepth(t.x, t.z) < depth[screenIndex] - 0.001) continue
      ctx.drawImage(pine, p.x - tw / 2, p.y - th, tw, th)
    }
  }
}
