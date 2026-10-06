import {
  BEN_NEVIS_GEOGRAPHY as geo,
  WORLD,
  cameraDepth,
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
type Vertex = { x: number; y: number; wx: number; wz: number; height: number }
export function drawHighlands(ctx: CanvasRenderingContext2D, w: number, h: number, assets: SceneAssets = {}) {
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#b8e5e9')
  sky.addColorStop(0.55, '#eff6dd')
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
      line.push({ ...p, wx, wz, height })
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
  ctx.lineJoin = 'round'
  ctx.lineWidth = 0.6
  const face = (a: Vertex, b: Vertex, c: Vertex) => {
    if (
      Math.max(a.x, b.x, c.x) < -2 ||
      Math.min(a.x, b.x, c.x) > w + 2 ||
      Math.max(a.y, b.y, c.y) < -2 ||
      Math.min(a.y, b.y, c.y) > h + 2
    )
      return
    const x = (a.wx + b.wx + c.wx) / 3,
      z = (a.wz + b.wz + c.wz) / 3,
      elevation = (a.height + b.height + c.height) / 3
    const dx = (heightAt(x + 0.035, z) - heightAt(x - 0.035, z)) / 0.07,
      dz = (heightAt(x, z + 0.035) - heightAt(x, z - 0.035)) / 0.07
    const slope = Math.hypot(dx, dz),
      light = clamp((0.72 + dx * 0.85 - dz * 0.68) / Math.hypot(1, dx, dz), 0.08, 1.14)
    const patch = terrainNoise(x * 10 + 8, z * 10),
      fine = terrainNoise(x * 109, z * 113)
    const curvature =
      (heightAt(x + 0.05, z) +
        heightAt(x - 0.05, z) +
        heightAt(x, z + 0.05) +
        heightAt(x, z - 0.05) -
        4 * heightAt(x, z)) /
      0.01
    const crevice = clamp(curvature, 0, 0.4) * clamp((elevation - 0.55) * 3)
    const land = coverAt(cover, x, z)
    // The real upper mountain is bare scree/rock; woods occur only inside OSM polygons.
    const rock = clamp((elevation - 0.55) * 3.2 + (slope - 0.45) * 0.8 + (patch - 0.5) * 0.38)
    const tx = ((Math.floor(x * 510) % 128) + 128) % 128,
      tz = ((Math.floor(z * 510) % 128) + 128) % 128,
      ti = (tz * 128 + tx) * 4
    const grass = meadow ? [meadow[ti], meadow[ti + 1], meadow[ti + 2]] : [153, 169, 88]
    const granite = stone ? [stone[ti], stone[ti + 1], stone[ti + 2]] : [191, 190, 159]
    const fog = clamp((cameraDepth(x, z) - 1) * 0.085, 0, 0.68)
    const rgb = [0, 1, 2].map((k) => {
      let base = lerp(
        lerp([185, 187, 92][k], grass[k], 0.2),
        lerp([222, 207, 170][k], granite[k], 0.22),
        rock
      )
      if (land.wood) base = lerp(base, [40, 88, 62][k], 0.83)
      if (land.water) base = [70, 156, 174][k]
      const lit =
        base * (light * 0.75 + 0.3 - crevice * 0.25) + (1 - light) * [16, 40, 65][k] + (fine - 0.5) * 5
      return Math.round(lerp(lit, [181, 213, 204][k], fog))
    })
    ctx.fillStyle = `rgb(${rgb.join(',')})`
    ctx.strokeStyle = ctx.fillStyle
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  for (const { i, j } of cells) {
    const a = grid[j][i],
      b = grid[j][i + 1],
      c = grid[j + 1][i],
      d = grid[j + 1][i + 1]
    face(a, b, c)
    face(b, d, c)
  }
  // Individual small trees are constrained to mapped woodland. No alpine forest
  // is invented around the summit or lochan. Tree height is in world metres.
  const pine = assets.pine
  if (pine?.complete && pine.naturalWidth) {
    let seed = 317
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    const trees = Array.from({ length: 16000 }, () => ({
      x: lerp(-4, 1, random()),
      z: lerp(-3, 4, random()),
      size: lerp(0.015, 0.027, random())
    }))
      .filter((p) => coverAt(cover, p.x, p.z).wood && heightAt(p.x, p.z) < 0.55)
      .sort((a, b) => cameraDepth(b.x, b.z) - cameraDepth(a.x, a.z))
    for (const t of trees) {
      const p = scenePoint(projectWorld(t.x, t.z), w, h),
        top = scenePoint(projectWorld(t.x, t.z, heightAt(t.x, t.z) + t.size), w, h)
      const th = p.y - top.y,
        tw = (th * pine.naturalWidth) / pine.naturalHeight
      if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) continue
      ctx.drawImage(pine, p.x - tw / 2, p.y - th, tw, th)
    }
  }
}
