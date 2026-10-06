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
type Vertex = { x: number; y: number; wx: number; wz: number; height: number }
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
      Math.min(
        viewDepth(a.wx, a.wz, a.height),
        viewDepth(b.wx, b.wz, b.height),
        viewDepth(c.wx, c.wz, c.height)
      ) < 0.75 ||
      Math.max(a.x, b.x, c.x) < -2 ||
      Math.min(a.x, b.x, c.x) > w + 2 ||
      Math.max(a.y, b.y, c.y) < -2 ||
      Math.min(a.y, b.y, c.y) > h + 2
    )
      return
    const x = (a.wx + b.wx + c.wx) / 3,
      z = (a.wz + b.wz + c.wz) / 3,
      elevation = (a.height + b.height + c.height) / 3
    // Flat-lit geographic faces form crisp illustrated planes instead of smooth
    // terrain-map shading. Their geometry remains the unmodified elevation mesh.
    const det = (b.wx - a.wx) * (c.wz - a.wz) - (c.wx - a.wx) * (b.wz - a.wz)
    const dx = ((b.height - a.height) * (c.wz - a.wz) - (c.height - a.height) * (b.wz - a.wz)) / det
    const dz = ((c.height - a.height) * (b.wx - a.wx) - (b.height - a.height) * (c.wx - a.wx)) / det
    const slope = Math.hypot(dx, dz)
    const light = clamp((0.65 + dx * 0.7 - dz * 0.85) / Math.hypot(1, dx, dz), 0.01, 1)
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
    const fog = clamp((cameraDepth(x, z) - 0.3) * 0.085, 0, 0.58)
    const grassPalette = [
      [20, 65, 61],
      [43, 99, 72],
      [102, 137, 65],
      [142, 175, 79],
      [191, 204, 119]
    ]
    const rockPalette = [
      [24, 52, 78],
      [52, 84, 110],
      [111, 137, 146],
      [151, 173, 167],
      [202, 213, 191]
    ]
    const shade = clamp(Math.floor((light * 0.88 - crevice * 0.25) * 5), 0, 4)
    const rgb = [0, 1, 2].map((k) => {
      const turf = lerp(grassPalette[shade][k], grass[k], 0.06)
      const crag = lerp(rockPalette[shade][k], granite[k], 0.075)
      let base = lerp(turf, crag, rock)
      if (land.wood) base = lerp([11, 54, 53][k], [78, 125, 73][k], light * 0.75 + fine * 0.25)
      if (land.water) base = lerp([19, 103, 141][k], [97, 195, 205][k], fine * 0.4 + light * 0.4)
      return Math.round(lerp(base, [160, 201, 208][k], fog))
    })
    ctx.lineWidth = 0.6
    ctx.fillStyle = `rgb(${rgb.join(',')})`
    ctx.strokeStyle = ctx.fillStyle
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    // Sparse ink and warm edges follow actual rocky facets. These marks change
    // the illustration surface, never the mountain height or the route.
    if (rock > 0.5 && slope > 0.42 && fine > 0.66 && fog < 0.42) {
      ctx.strokeStyle = light > 0.65 ? '#f7e7b789' : '#15364b6b'
      ctx.lineWidth = light > 0.65 ? 0.75 : 0.55
      ctx.beginPath()
      ctx.moveTo(a.x * 0.72 + b.x * 0.28, a.y * 0.72 + b.y * 0.28)
      ctx.lineTo((b.x + c.x) * 0.5, (b.y + c.y) * 0.5)
      ctx.stroke()
    }
    if (land.water && fine > 0.75) {
      const cx = (a.x + b.x + c.x) / 3,
        cy = (a.y + b.y + c.y) / 3
      ctx.strokeStyle = '#d8fff4a0'
      ctx.lineWidth = 0.55
      ctx.beginPath()
      ctx.moveTo(cx - 1.5, cy)
      ctx.lineTo(cx + 1.5, cy)
      ctx.stroke()
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
