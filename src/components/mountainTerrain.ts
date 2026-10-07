import {
  BEN_NEVIS_GEOGRAPHY as geo,
  BEN_NEVIS_CRAGS as crags,
  WORLD,
  cameraDepth as mapDepth,
  viewDepth as mapViewDepth,
  heightAt,
  projectWorld as mapProject,
  landscapeCamera,
  scenePoint,
  overviewProjection,
  terrainNoise
} from '../domain/terrain'
export interface SceneAssets {
  pine?: HTMLImageElement
  rocks?: HTMLImageElement
  clouds?: HTMLImageElement
  meadow?: HTMLImageElement
  stone?: HTMLImageElement
  ground?: HTMLImageElement
  paintedSlope?: HTMLImageElement
  routePaint?: HTMLImageElement
  routeWide?: HTMLImageElement
}
const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const quadChannel = (
  data: Uint8ClampedArray,
  k: number,
  a: number,
  b: number,
  c: number,
  d: number,
  u: number,
  v: number
) => lerp(lerp(data[a + k], data[b + k], u), lerp(data[c + k], data[d + k], u), v)
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
      if (
        feature.kind !== kind ||
        (kind === 'river' &&
          !['River Nevis', 'Allt a’ Mhuilinn', "Allt a' Mhuilinn"].includes(feature.name))
      )
        continue
      c.beginPath()
      feature.points.forEach(([x, z], i) => {
        const px = ((x - WORLD.minX) / 13) * LAND_SIZE,
          py = ((z - WORLD.near) / 13) * LAND_SIZE
        if (i) c.lineTo(px, py)
        else c.moveTo(px, py)
      })
      if (kind === 'river') {
        c.strokeStyle = '#0000ff'
        c.lineWidth = feature.name === 'River Nevis' ? 2 : 1
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
const atlasCache = new WeakMap<HTMLImageElement, Uint8ClampedArray>()
const ATLAS_SIZE = 1024
const slopeCache = new WeakMap<HTMLImageElement, Uint8ClampedArray>()
function slopeMaterial(image?: HTMLImageElement) {
  if (!image?.complete || !image.naturalWidth) return undefined
  let data = slopeCache.get(image)
  if (!data) {
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')!
    context.drawImage(image, 0, 0)
    data = context.getImageData(0, 0, canvas.width, canvas.height).data
    slopeCache.set(image, data)
  }
  return data
}
function groundAtlas(image?: HTMLImageElement) {
  if (!image?.complete || !image.naturalWidth) return undefined
  let data = atlasCache.get(image)
  if (!data) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = ATLAS_SIZE
    const context = canvas.getContext('2d')!
    context.drawImage(image, 0, 0, ATLAS_SIZE, ATLAS_SIZE)
    data = context.getImageData(0, 0, ATLAS_SIZE, ATLAS_SIZE).data
    atlasCache.set(image, data)
  }
  return data
}
const MATERIAL_SIZE = 256
const mirrored = (n: number) => {
  const i = ((Math.floor(n) % (MATERIAL_SIZE * 2)) + MATERIAL_SIZE * 2) % (MATERIAL_SIZE * 2)
  return i < MATERIAL_SIZE ? i : MATERIAL_SIZE * 2 - i - 1
}
function material(image?: HTMLImageElement) {
  if (!image?.complete || !image.naturalWidth) return undefined
  let data = materialCache.get(image)
  if (!data) {
    const c = document.createElement('canvas')
    c.width = c.height = MATERIAL_SIZE
    const ctx = c.getContext('2d')!
    ctx.drawImage(image, 0, 0, MATERIAL_SIZE, MATERIAL_SIZE)
    data = ctx.getImageData(0, 0, MATERIAL_SIZE, MATERIAL_SIZE).data
    materialCache.set(image, data)
  }
  return data
}
type Vertex = {
  x: number
  y: number
  wx: number
  wz: number
  height: number
  invDepth: number
  nx: number
  nz: number
  sun: number
}
export function drawHighlands(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  assets: SceneAssets = {},
  scenic = false,
  finish: 'illustrated' | 'natural' = 'illustrated',
  overview = false
) {
  const natural = finish === 'natural'
  const composition = overview ? overviewProjection(w, h) : undefined
  const wideMaterialView = composition?.wide ? overviewProjection(844, 326) : undefined
  const overviewPaint = wideMaterialView ? assets.routeWide : assets.routePaint
  const projectWorld = composition?.project ?? (scenic ? landscapeCamera.project : mapProject)
  const viewDepth = composition?.depth ?? (scenic ? landscapeCamera.depth : mapViewDepth)
  const toScreen = (p: { x: number; y: number }) => composition ? composition.point(p) : scenePoint(p, w, h, scenic)
  const cameraDepth = composition ? (x: number, z: number) => composition.depth(x, z, 0) : scenic
    ? (x: number, z: number) => landscapeCamera.depth(x, z, 0) - 5
    : mapDepth
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, overview ? '#6dbcf0' : natural ? '#a5c4d5' : '#8ccdf3')
  sky.addColorStop(0.55, overview ? '#dceef5' : natural ? '#e1e9e5' : '#d8ebef')
  sky.addColorStop(1, natural ? '#e7e8d7' : '#edf0cf')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)
  // Warm illustrated daylight is an atmospheric layer, not altered terrain.
  const sunX = w * (scenic ? 0.78 : 0.85),
    sunY = h * 0.12,
    sunRadius = Math.min(w, h) * 0.1
  const halo = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.7, sunX, sunY, sunRadius * 3.2)
  halo.addColorStop(0, '#fff5cb99')
  halo.addColorStop(1, '#fff5cb00')
  ctx.fillStyle = halo
  ctx.fillRect(0, 0, w, h)
  const sun = ctx.createLinearGradient(0, sunY - sunRadius, 0, sunY + sunRadius)
  sun.addColorStop(0, '#ffdc7c')
  sun.addColorStop(1, '#ffad4b')
  ctx.fillStyle = sun
  ctx.beginPath()
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
  if (!natural) ctx.fill()
  if (assets.clouds?.complete && assets.clouds.naturalWidth) {
    ctx.save()
    ctx.globalAlpha = overview ? 0.94 : natural ? 0.65 : 0.9
    const cloudHeight = w * 1.1 * assets.clouds.naturalHeight / assets.clouds.naturalWidth
    ctx.drawImage(assets.clouds, -w * 0.15, -cloudHeight * 0.25, w * 1.1, cloudHeight)
    ctx.restore()
  }
  const cover = landCover(),
    meadow = material(assets.meadow),
    stone = material(assets.stone),
    ground = groundAtlas(assets.ground),
    paintedSlope = slopeMaterial(assets.paintedSlope),
    routePaint = slopeMaterial(overviewPaint)
  const routePaintWidth = overviewPaint?.naturalWidth ?? 0
  const routePaintHeight = overviewPaint?.naturalHeight ?? 0
  const grids: Vertex[][][] = []
  const cells: Array<{ grid: number; i: number; j: number; depth: number }> = []
  const meshes = [
    {
      size: geo.grid.size,
      stepKm: geo.grid.stepKm,
      minX: geo.grid.minKm,
      minZ: geo.grid.minKm
    },
    crags.grid
  ]
  for (const [gridIndex, mesh] of meshes.entries()) {
    const grid: Vertex[][] = []
    const { size, stepKm, minX, minZ } = mesh
    for (let j = 0; j < size; j++) {
      const line: Vertex[] = []
      for (let i = 0; i < size; i++) {
        const wx = minX + i * stepKm,
          wz = minZ + j * stepKm,
          height = heightAt(wx, wz)
        const p = toScreen(projectWorld(wx, wz, height))
        const nx = (heightAt(wx + stepKm, wz) - heightAt(wx - stepKm, wz)) / (2 * stepKm)
        const nz = (heightAt(wx, wz + stepKm) - heightAt(wx, wz - stepKm)) / (2 * stepKm)
        // Sample the actual ridges towards the light. Their cast shadows give
        // glens and crags depth without adding or distorting any landform.
        let sun = 1
        for (const distance of [0.1, 0.2, 0.4, 0.7, 1, 1.5, 2]) {
          if (
            heightAt(wx - distance * 0.85, wz - distance * 0.53) >
            height + distance * 0.65 + 0.02
          ) {
            sun = 0.18
            break
          }
        }
        line.push({
          ...p,
          wx,
          wz,
          height,
          nx,
          nz,
          sun,
          invDepth: 1 / viewDepth(wx, wz, height)
        })
      }
      grid.push(line)
    }
    for (let j = 0; j < size - 1; j++)
      for (let i = 0; i < size - 1; i++) {
        const x = minX + i * stepKm,
          z = minZ + j * stepKm
        // Replace these coarse cells with sourced detail, rather than layering
        // two competing surfaces in the depth buffer.
        if (
          gridIndex === 0 &&
          x >= crags.grid.minX - 1e-8 &&
          z >= crags.grid.minZ - 1e-8 &&
          x + stepKm <= crags.grid.minX + (crags.grid.size - 1) * crags.grid.stepKm + 1e-8 &&
          z + stepKm <= crags.grid.minZ + (crags.grid.size - 1) * crags.grid.stepKm + 1e-8
        )
          continue
        cells.push({
          grid: gridIndex,
          i,
          j,
          depth: cameraDepth(x + stepKm / 2, z + stepKm / 2)
        })
      }
    grids.push(grid)
  }
  // The depth buffer resolves visibility. Draw near faces first so occluded
  // pixels skip the expensive material shader instead of being repainted.
  cells.sort((a, b) => a.depth - b.depth)
  // Rasterise surface materials in world space. A single colour per 50 m face
  // discarded the painted detail and made mapped woodland edges look triangular.
  // This is a cached Canvas 2D material pass, not new terrain or a scene image.
  const density = Math.min(overview ? 2 : 1.6, (overview ? 1600 : 1200) / Math.max(w, h))
  const sw = Math.ceil(w * density),
    sh = Math.ceil(h * density)
  const surface = document.createElement('canvas')
  surface.width = sw
  surface.height = sh
  const surfaceContext = surface.getContext('2d')!
  const pixels = surfaceContext.createImageData(sw, sh)
  const depth = new Float32Array(sw * sh)
  const grassPalette = [
    [17, 64, 60],
    [43, 98, 68],
    [76, 139, 83],
    [122, 171, 100],
    [193, 210, 139]
  ]
  const rockPalette = [
    [15, 44, 67],
    [43, 76, 104],
    [102, 132, 148],
    [178, 193, 185],
    [247, 225, 175]
  ]
  const face = (a: Vertex, b: Vertex, c: Vertex) => {
    if (
      Math.min(a.invDepth, b.invDepth, c.invDepth) <= 0 ||
      Math.max(a.invDepth, b.invDepth, c.invDepth) > 1 / 0.12
    )
      return
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
        // Continuous real surface normals remove the visible 50 m triangle grid.
        const nx = ua * a.nx + vb * b.nx + qc * c.nx
        const nz = ua * a.nz + vb * b.nz + qc * c.nz
        const sunlight = ua * a.sun + vb * b.sun + qc * c.sun
        const light =
          clamp((0.49 + nx * 0.9 + nz * 0.55) / Math.hypot(1, nx, nz), 0.16, 1) *
          (0.48 + sunlight * 0.52)
        const land = coverAt(cover, x, z)
        const patch = terrainNoise(x * 14, z * 14)
        const rock = clamp((elevation - 0.5) * 3.4 + (slope - 0.38) * 0.9 + (patch - 0.5) * 0.35)
        // Repeat a small painted material across the real slopes. Use luminance
        // for crevices, with the scene palette supplying coherent ink/sun colours.
        const warp = terrainNoise(x * 7, z * 7) * 0.055
        // Larger painted planes retain the material's brushwork at phone scale;
        // tiny repeated contrast made the previous crags read as noisy stone.
        // Rock brushwork runs up the cliff, rather than making square tiled
        // patches across it. Mirrored edges avoid visible material seams.
        const tx = mirrored((x * 0.8 - z * 0.6) * 180 + elevation * 55 + warp * 40)
        const tz = mirrored((x * 0.6 + z * 0.8) * 180 - elevation * 95 - warp * 40)
        const ti = (tz * MATERIAL_SIZE + tx) * 4
        const stoneLight = stone
          ? (stone[ti] * 0.25 + stone[ti + 1] * 0.55 + stone[ti + 2] * 0.2) / 255
          : 0.55
        const grassIndex = (mirrored(z * 200) * MATERIAL_SIZE + mirrored(x * 200)) * 4
        const grassLight = meadow
          ? (meadow[grassIndex] + meadow[grassIndex + 1] + meadow[grassIndex + 2]) / 765
          : 0.5
        const grain = lerp((grassLight - 0.5) * 1.15, (stoneLight - 0.47) * 2.7, rock)
        const shade = clamp(light * 3.8 - crevice * rock * 0.6 + grain, 0, 3.999)
        const low = Math.floor(shade),
          blend = shade - low
        // Keep hero cliffs crisp with the new camera's actual world distance.
        const fog = clamp((viewDepth(x, z, elevation) - 4.5) * 0.028, 0, 0.23)
        const offset = index * 4
        // The north-up atlas is attached to the sourced world coordinates,
        // never to the screen. Camera changes and zoom retain its placement.
        const atlasX = clamp(((x + 6.5) / 13) * (ATLAS_SIZE - 1), 0, ATLAS_SIZE - 1)
        const atlasZ = clamp(((6.5 - z) / 13) * (ATLAS_SIZE - 1), 0, ATLAS_SIZE - 1)
        const atlasLeft = Math.floor(atlasX),
          atlasTop = Math.floor(atlasZ)
        const atlasRight = Math.min(atlasLeft + 1, ATLAS_SIZE - 1),
          atlasBottom = Math.min(atlasTop + 1, ATLAS_SIZE - 1)
        const groundIndex = (atlasTop * ATLAS_SIZE + atlasLeft) * 4
        const groundRight = (atlasTop * ATLAS_SIZE + atlasRight) * 4
        const groundBottom = (atlasBottom * ATLAS_SIZE + atlasLeft) * 4
        const groundCorner = (atlasBottom * ATLAS_SIZE + atlasRight) * 4
        // Generated paint is not authoritative land-cover data. Prevent its
        // water/wood tints from creating features outside the actual OSM masks.
        const paintedWater =
          ground &&
          ground[groundIndex] < 55 &&
          ground[groundIndex + 1] > 90 &&
          ground[groundIndex + 2] > ground[groundIndex + 1] * 1.06 &&
          ground[groundIndex + 2] > ground[groundIndex] * 1.2
        const paintedWood =
          ground &&
          ground[groundIndex] < 70 &&
          ground[groundIndex + 1] > ground[groundIndex] * 1.6 &&
          ground[groundIndex + 1] > ground[groundIndex + 2] * 1.18
        // Fine canopy clusters give the woods depth while staying inside mapped polygons.
        const canopy = land.wood ? terrainNoise(x * 220, z * 220) : 0
        const grove = land.wood ? terrainNoise(x * 42, z * 42) : 0
        // Ground-only illustration is inverse-projected onto the original
        // world coordinates. Alpha excludes hidden or unpainted slopes.
        const slopeX = clamp(((x + 4) / 10) * 3071, 0, 3071)
        const slopeZ = clamp(((6 - z) / 8) * 3071, 0, 3071)
        const slopeLeft = Math.floor(slopeX),
          slopeTop = Math.floor(slopeZ)
        const slopeRight = Math.min(slopeLeft + 1, 3071),
          slopeBottom = Math.min(slopeTop + 1, 3071)
        const slopeA = (slopeTop * 3072 + slopeLeft) * 4,
          slopeB = (slopeTop * 3072 + slopeRight) * 4,
          slopeC = (slopeBottom * 3072 + slopeLeft) * 4,
          slopeD = (slopeBottom * 3072 + slopeRight) * 4
        const slopeU = slopeX - slopeLeft,
          slopeV = slopeZ - slopeTop
        const slopeAlpha =
          paintedSlope && x >= -4 && x <= 6 && z >= -2 && z <= 6
            ? quadChannel(paintedSlope, 3, slopeA, slopeB, slopeC, slopeD, slopeU, slopeV) / 255
            : 0
        // Sample the overview painting from measured world coordinates directly.
        // This avoids a second low-resolution north-up bake stretching the crags.
        // Geometry, occlusion, route and mapped land cover remain authoritative.
        const routeSample = routePaint
          ? wideMaterialView ? wideMaterialView.point(wideMaterialView.project(x, z, elevation)) : scenePoint(mapProject(x, z, elevation), 390, 1428 * 390 / 768)
          : undefined
        const routeX = routeSample ? routeSample.x / (wideMaterialView ? 844 : 390) * (routePaintWidth - 1) : -1
        const routeY = routeSample ? routeSample.y / (wideMaterialView ? 326 : 1428 * 390 / 768) * (routePaintHeight - 1) : -1
        const routeLeft = Math.floor(routeX), routeTop = Math.floor(routeY)
        const routeIndex = (routeTop * routePaintWidth + routeLeft) * 4
        const routeCoverage = routePaint && routeX >= 0 && routeY >= 0 && routeX < routePaintWidth - 1 && routeY < routePaintHeight - 1
          && Math.abs(routePaint[routeIndex] - routePaint[0]) + Math.abs(routePaint[routeIndex + 1] - routePaint[1]) + Math.abs(routePaint[routeIndex + 2] - routePaint[2]) > 45
        const routeOpacity = clamp(Math.min(routeX, routeY, routePaintWidth - 1 - routeX, routePaintHeight - 1 - routeY) / 64)
        for (let k = 0; k < 3; k++) {
          const turf = lerp(grassPalette[low][k], grassPalette[low + 1][k], blend)
          const plane = lerp(rockPalette[low][k], rockPalette[low + 1][k], blend)
          // Retain the illustrated material's blue slate and warm brush colour,
          // rather than reducing the whole artwork to grey luminance noise.
          const crag = stone ? lerp(plane, stone[ti + k] * (0.45 + light * 0.85), 0.45) : plane
          let value = lerp(turf, crag, rock)
          if (ground && !paintedWater && !paintedWood) {
            const paint = lerp(
              lerp(ground[groundIndex + k], ground[groundRight + k], atlasX - atlasLeft),
              lerp(ground[groundBottom + k], ground[groundCorner + k], atlasX - atlasLeft),
              atlasZ - atlasTop
            )
            // The atlas establishes large painted groups. Preserve the finer
            // meadow/crag material underneath instead of blurring it away.
            value = lerp(value, paint * (0.86 + light * 0.3), lerp(0.62, 0.76, rock))
            const brush = lerp(grassLight, stoneLight, rock)
            value *= clamp(0.84 + brush * 0.32, 0.88, 1.12)
          }
          if (paintedSlope && slopeAlpha && !land.wood && !land.water && !wideMaterialView)
            value = lerp(
              value,
              quadChannel(paintedSlope, k, slopeA, slopeB, slopeC, slopeD, slopeU, slopeV) *
                (0.91 + light * 0.18),
              slopeAlpha * 0.94
            )
          if (routePaint && routeCoverage && !land.wood && !land.water)
            value = lerp(value, quadChannel(routePaint, k, routeIndex, routeIndex + 4,
              routeIndex + routePaintWidth * 4, routeIndex + routePaintWidth * 4 + 4,
              routeX - routeLeft, routeY - routeTop), 0.96 * routeOpacity)
          if (land.wood)
            value = lerp(
              [10, 48, 49][k],
              [77, 145, 93][k],
              clamp(canopy * 0.32 + grove * 0.38 + light * 0.22 - 0.08)
            )
          if (land.wood && routePaint && routeCoverage)
            value = lerp(value, quadChannel(routePaint, k, routeIndex, routeIndex + 4,
              routeIndex + routePaintWidth * 4, routeIndex + routePaintWidth * 4 + 4,
              routeX - routeLeft, routeY - routeTop), .8 * routeOpacity)
          if (land.water)
            value = lerp(
              [12, 90, 118][k],
              [116, 213, 211][k],
              clamp(0.24 + light * 0.35 + terrainNoise(x * 240, z * 1200) * 0.25)
            )
          if (natural && !overview) {
            // Restrained daylight and mineral colours on the same measured relief.
            value = value * [0.96, 0.94, 0.91][k] + [10, 8, 9][k]
          }
          pixels.data[offset + k] = Math.round(lerp(value, [146, 191, 204][k], fog))
        }
        pixels.data[offset + 3] = 255
      }
  }
  for (const { grid: gridIndex, i, j } of cells) {
    const grid = grids[gridIndex]
    const a = grid[j][i],
      b = grid[j][i + 1],
      c = grid[j + 1][i],
      d = grid[j + 1][i + 1]
    face(a, b, c)
    face(b, d, c)
  }
  // An ink-soft contour at real occlusion boundaries gives distant ridges a
  // readable edge. It traces the depth buffer rather than inventing peak outlines.
  for (let y = 1; !natural && y < sh - 1; y++)
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
  // Fine painted fissures follow the measured fall line on exposed slopes.
  // Screen-depth checks keep strokes behind nearer ridges, including the low view.
  let cragSeed = 831
  const cragRandom = () => {
    cragSeed = (cragSeed * 16807) % 2147483647
    return cragSeed / 2147483647
  }
  const visible = (x: number, z: number, elevation: number) => {
    const p = toScreen(projectWorld(x, z, elevation))
    if (p.x < 0 || p.x >= w || p.y < 0 || p.y >= h) return undefined
    const index = Math.floor(p.y * density) * sw + Math.floor(p.x * density)
    return 1 / viewDepth(x, z, elevation) >= depth[index] - 0.001 ? p : undefined
  }
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  for (let mark = 0; mark < (natural ? 0 : 2200); mark++) {
    let x = lerp(-2, 4, cragRandom()),
      z = lerp(-3, 3, cragRandom())
    if (heightAt(x, z) < 0.65) continue
    const points: { x: number; y: number }[] = []
    for (let step = 0; step < 7; step++) {
      const elevation = heightAt(x, z)
      const nx = (heightAt(x + 0.025, z) - heightAt(x - 0.025, z)) / 0.05
      const nz = (heightAt(x, z + 0.025) - heightAt(x, z - 0.025)) / 0.05
      const slope = Math.hypot(nx, nz)
      const p = visible(x, z, elevation)
      if (!p || slope < 0.52) break
      points.push(p)
      x -= (nx / slope) * 0.018
      z -= (nz / slope) * 0.018
    }
    if (points.length < 3) continue
    ctx.beginPath()
    points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
    ctx.strokeStyle = mark % 4 === 0 ? '#f9e4ab55' : '#173c5555'
    ctx.lineWidth = mark % 4 === 0 ? 0.65 : 0.45
    ctx.stroke()
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
    const trees = [
      ...Array.from({ length: overview ? 45000 : 120000 }, () => ({
        x: lerp(-4, 2, random()),
        z: lerp(-2, 6, random()),
        size: lerp(0.018, 0.032, random())
      })),
      ...Array.from({ length: scenic ? 3500 : 0 }, () => ({
        x: lerp(-2.3, 0.15, random()),
        z: lerp(3.3, 5.3, random()),
        size: lerp(0.02, 0.032, random())
      }))
    ]
      .filter((p) => coverAt(cover, p.x, p.z).wood && heightAt(p.x, p.z) < 0.55)
      .sort((a, b) => cameraDepth(b.x, b.z) - cameraDepth(a.x, a.z))
    for (const t of trees) {
      if (viewDepth(t.x, t.z) < 0.12) continue
      const p = toScreen(projectWorld(t.x, t.z)),
        top = toScreen(projectWorld(t.x, t.z, heightAt(t.x, t.z) + t.size))
      const th = p.y - top.y,
        tw = (th * pine.naturalWidth) / pine.naturalHeight
      if (p.x < -tw || p.x > w + tw || p.y < 0 || p.y > h + th || th < (overview ? 1.6 : 0.6)) continue
      // Hide sprites behind intervening terrain; ground depth is the same real mesh.
      const screenIndex =
        clamp(Math.floor(p.y * density), 0, sh - 1) * sw +
        clamp(Math.floor(p.x * density), 0, sw - 1)
      if (1 / viewDepth(t.x, t.z) < depth[screenIndex] - 0.001) continue
      ctx.globalAlpha = clamp(1 - Math.max(0, viewDepth(t.x, t.z) - 2) * 0.026, 0.7, 1)
      ctx.drawImage(pine, p.x - tw / 2, p.y - th, tw, th)
    }
    ctx.globalAlpha = 1
  }
}
