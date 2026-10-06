import { WORLD, heightAt, projectWorld, terrainNoise } from '../domain/terrain'
export interface SceneAssets {
  pine?: HTMLImageElement
  rocks?: HTMLImageElement
  clouds?: HTMLImageElement
}
type Point = { x: number; y: number; z: number; height: number }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n))
const rgb = (r: number, g: number, b: number) => `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
export function drawHighlands(ctx: CanvasRenderingContext2D, w: number, h: number, assets: SceneAssets = {}) {
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#b8e2e6')
  sky.addColorStop(0.4, '#eff8e8')
  sky.addColorStop(1, '#ffe7b4')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)
  let seed = 407
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  // Distant ranges are separate geometry layers with atmospheric depth.
  function range(base: number, amplitude: number, color: string, offset: number) {
    const skyline = Array.from({ length: 131 }, (_, i) => {
      const x = i / 130,
        peak =
          terrainNoise(x * 18 + offset, 7) * 0.6 +
          terrainNoise(x * 44 + offset, 3) * 0.25 +
          terrainNoise(x * 100, offset) * 0.15
      return { x: x * w, y: (base - peak * amplitude) * h }
    })
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (const p of skyline) ctx.lineTo(p.x, p.y)
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
    ctx.clip()
    for (let i = 1; i < skyline.length - 1; i++) {
      const p = skyline[i]
      if (p.y < skyline[i - 1].y && p.y < skyline[i + 1].y) {
        ctx.fillStyle = '#e6f4df36'
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - w * 0.055, base * h)
        ctx.lineTo(p.x + w * 0.008, (base + 0.025) * h)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = '#345d7225'
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x + w * 0.065, base * h)
        ctx.lineTo(p.x + w * 0.008, (base + 0.025) * h)
        ctx.closePath()
        ctx.fill()
      }
    }
    ctx.restore()
  }
  range(0.49, 0.31, '#aacbd0', 6)
  range(0.6, 0.27, '#80adb8', 17)
  range(0.69, 0.21, '#548e97', 33)
  // A separate cloud sprite adds painted edges while terrain stays code-built.
  const clouds = assets.clouds
  if (clouds?.complete && clouds.naturalWidth) {
    ctx.save()
    ctx.globalAlpha = 0.85
    ctx.drawImage(
      clouds,
      -w * 0.17,
      -h * 0.075,
      w * 0.95,
      (w * 0.95 * clouds.naturalHeight) / clouds.naturalWidth
    )
    ctx.globalAlpha = 0.58
    ctx.drawImage(clouds, w * 0.65, h * 0.02, w * 0.7, (w * 0.7 * clouds.naturalHeight) / clouds.naturalWidth)
    ctx.restore()
  }
  // Build small triangulated faces. Lighting comes from the actual surface normal.
  // The mesh is only painted on resize/asset load; progress animation reuses it.
  const columns = 165,
    rows = 160,
    grid: Point[][] = []
  for (let j = 0; j <= rows; j++) {
    const z = lerp(WORLD.far, WORLD.near, j / rows),
      line: Point[] = []
    for (let i = 0; i <= columns; i++) {
      const x = lerp(WORLD.minX, WORLD.maxX, i / columns),
        height = heightAt(x, z),
        p = projectWorld(x, z, height)
      line.push({ x: p.x * w, y: p.y * h, z, height })
    }
    grid.push(line)
  }
  function face(a: Point, b: Point, c: Point, wx: number, wz: number) {
    const elevation = (a.height + b.height + c.height) / 3,
      eps = 0.014,
      dx = (heightAt(wx + eps, wz) - heightAt(wx - eps, wz)) / (eps * 2),
      dz = (heightAt(wx, wz + eps) - heightAt(wx, wz - eps)) / (eps * 2)
    const length = Math.hypot(dx, 1, dz),
      light = clamp(((dx * 0.8 + 1.05 + dz * 0.48) / length) * 0.82 + 0.1, 0.18, 1.19),
      slope = Math.hypot(dx, dz)
    const patch = terrainNoise(wx * 10 + 3, wz * 11),
      fine = terrainNoise(wx * 61, wz * 63),
      rock = Math.max(
        elevation > 0.96 ? 0.85 : 0,
        clamp((elevation - 0.55) * 2 + (slope - 1.1) * 0.3 + (patch - 0.5) * 1.3)
      )
    const grass = [118 + patch * 40, 153 + patch * 26, 66 + patch * 18],
      stone = [190 + patch * 32, 179 + patch * 24, 144 + patch * 19]
    const shadow = clamp(1 - light),
      fog = clamp((wz - 2.05) * 0.18)
    const channels = [0, 1, 2].map((k) => {
      const value = lerp(grass[k], stone[k], rock) * (light + (fine - 0.5) * 0.12)
      return lerp(value + [6, 28, 58][k] * shadow, [150, 190, 193][k], fog)
    })
    ctx.fillStyle = rgb(channels[0], channels[1], channels[2])
    ctx.strokeStyle = ctx.fillStyle
    ctx.lineWidth = 0.55
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.lineTo(c.x, c.y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }
  for (let j = 0; j < rows; j++) {
    const z = lerp(WORLD.far, WORLD.near, (j + 0.5) / rows)
    for (let i = 0; i < columns; i++) {
      const x = lerp(WORLD.minX, WORLD.maxX, (i + 0.5) / columns),
        a = grid[j][i],
        b = grid[j][i + 1],
        c = grid[j + 1][i],
        d = grid[j + 1][i + 1]
      face(a, c, b, x, z)
      face(b, c, d, x, z)
    }
  }
  // Lochan and stream follow the glen. Shore and water are independently painted.
  const lake = projectWorld(-0.69, 0.71)
  ctx.save()
  ctx.translate(lake.x * w, lake.y * h + 12)
  ctx.rotate(-0.15)
  const water = ctx.createLinearGradient(0, -h * 0.018, 0, h * 0.026)
  water.addColorStop(0, '#c9edf0')
  water.addColorStop(0.25, '#75c6ce')
  water.addColorStop(1, '#207d96')
  ctx.fillStyle = '#d1c691'
  ctx.beginPath()
  ctx.ellipse(0, 0, w * 0.115, h * 0.025, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = water
  ctx.beginPath()
  ctx.ellipse(0, 0, w * 0.109, h * 0.022, 0, 0, Math.PI * 2)
  ctx.fill()
  for (let i = 0; i < 9; i++) {
    ctx.strokeStyle = i % 2 ? '#eefcdb80' : '#257b9590'
    ctx.lineWidth = 0.7
    ctx.beginPath()
    const y = (rand() - 0.5) * h * 0.028
    ctx.moveTo(-w * 0.08 + rand() * w * 0.04, y)
    ctx.lineTo(w * (0.02 + rand() * 0.07), y)
    ctx.stroke()
  }
  ctx.restore()
  const stream = ctx.createLinearGradient(0, h * 0.8, 0, h)
  stream.addColorStop(0, '#b2dcce')
  stream.addColorStop(1, '#499fba')
  ctx.strokeStyle = stream
  ctx.lineWidth = w * 0.012
  ctx.beginPath()
  ctx.moveTo(lake.x * w, lake.y * h + 12)
  ctx.bezierCurveTo(w * 0.58, h * 0.86, w * 0.28, h * 0.87, w * 0.49, h * 1.04)
  ctx.stroke()
  // Hand-painted sprite assets are small objects positioned on the code terrain.
  const pine = assets.pine,
    rocks = assets.rocks
  if (pine?.complete && pine.naturalWidth) {
    const trees = Array.from({ length: 1450 }, () => {
      const x = lerp(-1.65, 1.65, rand()),
        z = lerp(-0.1, 1.55, rand()),
        height = heightAt(x, z)
      return { x, z, height }
    })
      .filter((t) => t.height < 0.57)
      .sort((a, b) => b.z - a.z)
    for (const t of trees) {
      const p = projectWorld(t.x, t.z, t.height),
        size = h * (0.033 + rand() * 0.036) * (1.2 - t.z * 0.22),
        width = (size * pine.naturalWidth) / pine.naturalHeight
      ctx.drawImage(pine, p.x * w - width / 2, p.y * h - size, width, size)
    }
    for (const [x, y, size] of [
      [-0.025, 1.025, 0.45],
      [0.06, 0.99, 0.29],
      [0.955, 1.05, 0.47],
      [1.035, 0.91, 0.4],
      [0.88, 0.99, 0.21]
    ]) {
      const th = h * size,
        tw = (th * pine.naturalWidth) / pine.naturalHeight
      ctx.drawImage(pine, x * w - tw / 2, y * h - th, tw, th)
    }
  }
  if (rocks?.complete && rocks.naturalWidth) {
    for (const [x, y, size] of [
      [0.05, 0.97, 0.2],
      [0.69, 1.015, 0.31],
      [0.61, 0.73, 0.05],
      [0.88, 0.87, 0.11]
    ]) {
      const rw = w * size,
        rh = (rw * rocks.naturalHeight) / rocks.naturalWidth
      ctx.drawImage(rocks, x * w - rw / 2, y * h - rh, rw, rh)
    }
  }
  // Sparse soft mist stays behind the route, never blurring the mountain's detail.
  const mist = ctx.createLinearGradient(0, h * 0.44, 0, h * 0.61)
  mist.addColorStop(0, '#eaf7e900')
  mist.addColorStop(0.6, '#eaf7e925')
  mist.addColorStop(1, '#eaf7e900')
  ctx.fillStyle = mist
  ctx.fillRect(0, h * 0.44, w, h * 0.17)
}
