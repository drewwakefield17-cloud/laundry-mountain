// Paint small, independent geographic expedition meshes. Coordinates and heights
// remain in kilometres; texture and seasonal colours are artistic treatments.
export interface PreviewTerrain {
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
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const samples = new WeakMap<HTMLImageElement, Uint8ClampedArray>()
const groundSamples = new WeakMap<HTMLImageElement, Uint8ClampedArray>()
function groundTexture(image?: HTMLImageElement) {
  if (!image?.complete || !image.naturalWidth) return undefined
  let pixels = groundSamples.get(image)
  if (!pixels) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1024
    const context = canvas.getContext('2d')!
    context.drawImage(image, 0, 0, 1024, 1024)
    pixels = context.getImageData(0, 0, 1024, 1024).data
    groundSamples.set(image, pixels)
  }
  return pixels
}
const quad = (
  data: Uint8ClampedArray,
  k: number,
  a: number,
  b: number,
  c: number,
  d: number,
  u: number,
  v: number
) => mix(mix(data[a + k], data[b + k], u), mix(data[c + k], data[d + k], u), v)
function texture(image?: HTMLImageElement) {
  if (!image?.complete || !image.naturalWidth) return undefined
  let pixels = samples.get(image)
  if (!pixels) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    const context = canvas.getContext('2d')!
    context.drawImage(image, 0, 0, 256, 256)
    pixels = context.getImageData(0, 0, 256, 256).data
    samples.set(image, pixels)
  }
  return pixels
}
const wrap = (v: number) => {
  const n = ((Math.floor(v) % 512) + 512) % 512
  return n < 256 ? n : 511 - n
}
export function paintPreview(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  data: PreviewTerrain,
  assets: {
    stone?: HTMLImageElement
    meadow?: HTMLImageElement
    clouds?: HTMLImageElement
    ground?: HTMLImageElement
  }
) {
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, '#8ccdf3')
  sky.addColorStop(1, '#e5f1df')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)
  const sun = ctx.createLinearGradient(0, 0, 0, h * 0.3)
  sun.addColorStop(0, '#ffe093')
  sun.addColorStop(1, '#ffb54f')
  ctx.fillStyle = sun
  ctx.beginPath()
  ctx.arc(w * 0.82, h * 0.19, Math.min(w, h) * 0.095, 0, Math.PI * 2)
  ctx.fill()
  if (assets.clouds?.complete && assets.clouds.naturalWidth) {
    ctx.save()
    ctx.globalAlpha = 0.85
    const cloudHeight = w * 1.2 * assets.clouds.naturalHeight / assets.clouds.naturalWidth
    ctx.drawImage(assets.clouds, -w * 0.1, -cloudHeight * 0.35, w * 1.2, cloudHeight)
    ctx.restore()
  }
  const stone = texture(assets.stone),
    meadow = texture(assets.meadow),
    ground = groundTexture(assets.ground)
  const angle = (data.heading * Math.PI) / 180,
    tilt = (6 * Math.PI) / 180
  const n = data.size,
    step = data.span / (n - 1)
  const scale = Math.min(w / (data.span * 0.42), h / (((data.elevation - data.datum) / 1000) * 1.5))
  const sample = (i: number, j: number) =>
    data.heights[clamp(j, 0, n - 1) * n + clamp(i, 0, n - 1)] / 1000
  const vertices = data.heights.map((metres, index) => {
    const i = index % n,
      j = Math.floor(index / n)
    const x = (i / (n - 1) - 0.5) * data.span,
      z = (j / (n - 1) - 0.5) * data.span
    const depth = x * Math.sin(angle) + z * Math.cos(angle)
    return {
      x: w * 0.5 + (x * Math.cos(angle) - z * Math.sin(angle)) * scale,
      y:
        h * 0.81 -
        (depth * Math.sin(tilt) + ((metres - data.datum) / 1000) * Math.cos(tilt)) * scale,
      wx: x,
      wz: z,
      depth,
      elevation: metres / 1000,
      nx: (sample(i + 1, j) - sample(i - 1, j)) / (2 * step),
      nz: (sample(i, j + 1) - sample(i, j - 1)) / (2 * step)
    }
  })
  const density = Math.min(1.7, 900 / Math.max(w, h)),
    sw = Math.ceil(w * density),
    sh = Math.ceil(h * density)
  const canvas = document.createElement('canvas')
  canvas.width = sw
  canvas.height = sh
  const c = canvas.getContext('2d')!,
    pixels = c.createImageData(sw, sh)
  const depths = new Float32Array(sw * sh)
  depths.fill(Infinity)
  type Vertex = (typeof vertices)[number]
  const face = (a: Vertex, b: Vertex, d: Vertex) => {
    const ax = a.x * density,
      ay = a.y * density,
      bx = b.x * density,
      by = b.y * density,
      dx = d.x * density,
      dy = d.y * density
    const area = (by - dy) * (ax - dx) + (dx - bx) * (ay - dy)
    if (Math.abs(area) < 0.001) return
    const x0 = Math.max(0, Math.floor(Math.min(ax, bx, dx))),
      x1 = Math.min(sw - 1, Math.ceil(Math.max(ax, bx, dx)))
    const y0 = Math.max(0, Math.floor(Math.min(ay, by, dy))),
      y1 = Math.min(sh - 1, Math.ceil(Math.max(ay, by, dy)))
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const u = ((by - dy) * (x + 0.5 - dx) + (dx - bx) * (y + 0.5 - dy)) / area
        const v = ((dy - ay) * (x + 0.5 - dx) + (ax - dx) * (y + 0.5 - dy)) / area,
          q = 1 - u - v
        if (u < 0 || v < 0 || q < 0) continue
        const index = y * sw + x,
          depth = u * a.depth + v * b.depth + q * d.depth
        if (depth >= depths[index]) continue
        depths[index] = depth
        const nx = u * a.nx + v * b.nx + q * d.nx,
          nz = u * a.nz + v * b.nz + q * d.nz
        const slope = Math.hypot(nx, nz),
          elevation = u * a.elevation + v * b.elevation + q * d.elevation
        const wx = u * a.wx + v * b.wx + q * d.wx,
          wz = u * a.wz + v * b.wz + q * d.wz
        const light = clamp((0.57 + nx * 0.8 - nz * 0.6) / Math.hypot(1, nx, nz))
        const snow = clamp((elevation * 1000 - data.snow) / 350) * clamp(1.45 - slope)
        const green = clamp((data.forest - elevation * 1000) / 180)
        const ti =
          (wrap((wx * 0.65 + wz * 0.76) * 170 - elevation * 65) * 256 +
            wrap((wx * 0.76 - wz * 0.65) * 170 + elevation * 45)) *
          4
        const grain = stone ? (stone[ti] + stone[ti + 1] + stone[ti + 2]) / 765 - 0.5 : 0
        const exposure = clamp(light * 0.9 + 0.12 + grain * 0.55)
        const mist = clamp((depth / data.span + 0.1) * 0.2, 0, 0.2)
        const volcanic = data.id === 'fuji' || data.id === 'kilimanjaro'
        const gx = clamp((wx / data.span + 0.5) * 1023, 0, 1023),
          gz = clamp((0.5 - wz / data.span) * 1023, 0, 1023)
        const ix = Math.floor(gx),
          iz = Math.floor(gz),
          jx = Math.min(ix + 1, 1023),
          jz = Math.min(iz + 1, 1023)
        const ga = (iz * 1024 + ix) * 4,
          gb = (iz * 1024 + jx) * 4,
          gc = (jz * 1024 + ix) * 4,
          gd = (jz * 1024 + jx) * 4
        const opacity = ground ? quad(ground, 3, ga, gb, gc, gd, gx - ix, gz - iz) / 255 : 0
        for (let k = 0; k < 3; k++) {
          const rock = mix(
            [18, 51, 75][k],
            (volcanic ? [205, 177, 122] : [229, 213, 166])[k],
            exposure
          )
          const grass = mix(
            [11, 65, 53][k],
            [174, 194, 103][k],
            clamp(light + (meadow ? (meadow[ti + k] / 255 - 0.5) * 0.5 : 0))
          )
          const ice = mix(
            [65, 123, 153][k],
            [255, 251, 222][k],
            clamp(light * 0.9 + 0.28 + grain * 0.25)
          )
          let material = mix(mix(rock, grass, green), ice, snow)
          if (ground && opacity)
            material = mix(
              material,
              quad(ground, k, ga, gb, gc, gd, gx - ix, gz - iz) * (0.96 + light * 0.08),
              opacity * 0.96
            )
          pixels.data[index * 4 + k] = mix(material, [146, 191, 204][k], mist)
        }
        pixels.data[index * 4 + 3] = 255
      }
  }
  for (let j = 0; j < n - 1; j++)
    for (let i = 0; i < n - 1; i++) {
      const k = j * n + i
      face(vertices[k], vertices[k + 1], vertices[k + n])
      face(vertices[k + 1], vertices[k + n + 1], vertices[k + n])
    }
  for (let y = 1; y < sh; y++)
    for (let x = 1; x < sw; x++) {
      const index = y * sw + x
      if (!Number.isFinite(depths[index])) continue
      if (
        !Number.isFinite(depths[index - sw]) ||
        depths[index - sw] - depths[index] > data.span * 0.018
      ) {
        for (let k = 0; k < 3; k++)
          pixels.data[index * 4 + k] = mix(pixels.data[index * 4 + k], [25, 65, 84][k], 0.35)
      }
    }
  c.putImageData(pixels, 0, 0)
  ctx.drawImage(canvas, 0, 0, w, h)
  // A cream atmospheric frame softens the finite data boundary. It is not an
  // invented continuation of the mountain or a claim of additional land cover.
  const foregroundMist = ctx.createLinearGradient(0, h * 0.64, 0, h * 0.97)
  foregroundMist.addColorStop(0, '#edf3e000')
  foregroundMist.addColorStop(0.65, '#edf3e099')
  foregroundMist.addColorStop(1, '#edf3e0')
  ctx.fillStyle = foregroundMist
  ctx.fillRect(0, h * 0.64, w, h * 0.36)
}
