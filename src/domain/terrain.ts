import geography from '../../public/data/ben-nevis.json'
import crags from '../../public/data/ben-nevis-crags.json'

// East/north coordinates and heights ALL use kilometres. The 50 m mesh comes
// from real elevation data, with no vertical exaggeration. See geography.md.
export const BEN_NEVIS_GEOGRAPHY = geography
export const BEN_NEVIS_CRAGS = crags
export const WORLD = { minX: -6.5, maxX: 6.5, near: -6.5, far: 6.5 }
export const fract = (n: number) => n - Math.floor(n)
const hash = (x: number, z: number) => fract(Math.sin(x * 127.1 + z * 311.7) * 43758.5453)
export function terrainNoise(x: number, z: number) {
  const ix = Math.floor(x),
    iz = Math.floor(z),
    u = x - ix,
    v = z - iz
  const a = u * u * (3 - 2 * u),
    b = v * v * (3 - 2 * v)
  return (
    (hash(ix, iz) * (1 - a) + hash(ix + 1, iz) * a) * (1 - b) +
    (hash(ix, iz + 1) * (1 - a) + hash(ix + 1, iz + 1) * a) * b
  )
}
function coarseHeightAt(x: number, z: number) {
  const { size, stepKm, minKm } = geography.grid
  const fx = Math.max(0, Math.min(size - 1.000001, (x - minKm) / stepKm))
  const fz = Math.max(0, Math.min(size - 1.000001, (z - minKm) / stepKm))
  const ix = Math.floor(fx),
    iz = Math.floor(fz),
    a = fx - ix,
    b = fz - iz,
    h = geography.heights
  return (
    ((h[iz * size + ix] * (1 - a) + h[iz * size + ix + 1] * a) * (1 - b) +
      (h[(iz + 1) * size + ix] * (1 - a) + h[(iz + 1) * size + ix + 1] * a) * b) /
    1000
  )
}
export function heightAt(x: number, z: number) {
  const coarse = coarseHeightAt(x, z)
  const { size, stepKm, minX, minZ } = crags.grid
  const maxX = minX + (size - 1) * stepKm,
    maxZ = minZ + (size - 1) * stepKm
  if (x <= minX || x >= maxX || z <= minZ || z >= maxZ) return coarse
  const fx = (x - minX) / stepKm,
    fz = (z - minZ) / stepKm
  const i = Math.floor(fx),
    j = Math.floor(fz),
    a = fx - i,
    b = fz - j
  const fine =
    ((crags.heights[j * size + i] * (1 - a) + crags.heights[j * size + i + 1] * a) * (1 - b) +
      (crags.heights[(j + 1) * size + i] * (1 - a) + crags.heights[(j + 1) * size + i + 1] * a) *
        b) /
    1000
  // Join the refined source to the wider mesh along the same coarse boundary.
  const blend = Math.min(1, Math.min(x - minX, maxX - x, z - minZ, maxZ - z) / 0.05)
  return coarse + (fine - coarse) * blend
}
type WorldPoint = { x: number; z: number; y: number }
function perspectiveCamera(eye: WorldPoint, target: WorldPoint, centre: { x: number; y: number }) {
  const vx = target.x - eye.x,
    vy = target.y - eye.y,
    vz = target.z - eye.z
  const distance = Math.hypot(vx, vy, vz),
    horizontal = Math.hypot(vx, vz)
  const forward = { x: vx / distance, y: vy / distance, z: vz / distance }
  const right = { x: vz / horizontal, z: -vx / horizontal }
  const up = {
    x: forward.y * right.z,
    y: forward.z * right.x - forward.x * right.z,
    z: -forward.y * right.x
  }
  return {
    depth(x: number, z: number, y = heightAt(x, z)) {
      return (x - eye.x) * forward.x + (y - eye.y) * forward.y + (z - eye.z) * forward.z
    },
    project(x: number, z: number, y = heightAt(x, z)) {
      const xx = x - eye.x,
        yy = y - eye.y,
        zz = z - eye.z
      const d = Math.max(0.08, xx * forward.x + yy * forward.y + zz * forward.z)
      return {
        x: centre.x + ((xx * right.x + zz * right.z) * 2.2) / d,
        y: centre.y - ((xx * up.x + yy * up.y + zz * up.z) * 2.2) / d
      }
    }
  }
}
// Low northwest viewpoint near the glen. Perspective changes, dimensions do not.
const routeCamera = perspectiveCamera(
  { x: -5.35, z: 1.74, y: heightAt(-5.35, 1.74) + 0.9 },
  { x: geography.summit[0], z: geography.summit[1], y: 0.8 },
  { x: 0.5, y: 0.5 }
)
export const cameraDepth = (x: number, z: number) => routeCamera.depth(x, z, 0)
export const viewDepth = routeCamera.depth
export const projectWorld = routeCamera.project
const mappedPoints = geography.route.map(([x, z]) => projectWorld(x, z))
const mapFrame = {
  left: Math.min(...mappedPoints.map((p) => p.x)),
  right: Math.max(...mappedPoints.map((p) => p.x)),
  top: Math.min(...mappedPoints.map((p) => p.y)),
  bottom: Math.max(...mappedPoints.map((p) => p.y))
}
export function scenePoint(
  point: { x: number; y: number },
  width: number,
  height: number,
  scenic = false
) {
  if (!scenic) {
    // Fit the entire actual route between the header and view controls. One
    // uniform camera scale retains the mountain's proportions on every viewport.
    const padding = Math.min(92, height * 0.25)
    const scale = Math.min(
      (width * 0.84) / (mapFrame.right - mapFrame.left),
      (height - padding * 2) / (mapFrame.bottom - mapFrame.top)
    )
    return {
      x: width * 0.5 + (point.x - (mapFrame.left + mapFrame.right) / 2) * scale,
      y: height * 0.5 + (point.y - (mapFrame.top + mapFrame.bottom) / 2) * scale
    }
  }
  // Centre one undistorted coordinate system; scenery extends past its edges.
  const scale = Math.max(width, height * 0.95)
  return {
    x: width * 0.5 + (point.x - 0.5) * scale,
    y: height * 0.38 - Math.max(0, height - width) * 0.08 + (point.y - 0.5) * scale
  }
}
// Torlundy viewpoint grounded in Geograph photo 5029113's recorded location.
// The camera looks towards the actual North Face; dimensions stay in km.
export const landscapeCamera = perspectiveCamera(
  { x: -0.926, z: 5.503, y: heightAt(-0.926, 5.503) + 0.002 },
  { x: 1.7, z: -0.65, y: 0.85 },
  { x: 0.6, y: 0.5 }
)

// Equal-distance samples retain the mapped path's bends and switchbacks.
const route = geography.route,
  lengths = [0]
for (let i = 1; i < route.length; i++)
  lengths.push(
    lengths[i - 1] + Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1])
  )
export const BEN_NEVIS_TRAIL = Array.from({ length: 401 }, (_, i) => {
  const distance = (lengths.at(-1)! * i) / 400
  let j = 1
  while (j < lengths.length - 1 && lengths[j] < distance) j++
  const t = (distance - lengths[j - 1]) / (lengths[j] - lengths[j - 1] || 1)
  const x = route[j - 1][0] + (route[j][0] - route[j - 1][0]) * t,
    z = route[j - 1][1] + (route[j][1] - route[j - 1][1]) * t
  const p = projectWorld(x, z)
  return [p.x, p.y]
})

// The wide overview looks across the southern slopes so the real eastbound path
// reads left-to-right. Both cameras use identical kilometre coordinates/heights.
const wideRouteCamera = perspectiveCamera(
  { x: -2.5, z: -6.7, y: 2.5 },
  { x: 0.3, z: -0.2, y: 0.7 },
  { x: 0.5, y: 0.5 }
)
export function overviewProjection(width: number, height: number) {
  const wide = width > height * 1.35
  const camera = wide ? wideRouteCamera : routeCamera
  const projected = route.map(([x, z]) => camera.project(x, z))
  const left = Math.min(...projected.map(p => p.x)), right = Math.max(...projected.map(p => p.x))
  const top = Math.min(...projected.map(p => p.y)), bottom = Math.max(...projected.map(p => p.y))
  const topInset = wide ? 65 : 125
  const bottomInset = wide ? 110 : 180
  const scale = Math.min(width * (wide ? 0.7 : 0.76) / (right - left),
    Math.max(80, height - topInset - bottomInset) / (bottom - top))
  const centreY = (topInset + height - bottomInset) / 2
  const point = (p: { x: number; y: number }) => ({
    x: width * 0.5 + (p.x - (left + right) / 2) * scale,
    y: centreY + (p.y - (top + bottom) / 2) * scale
  })
  return {
    ...camera, point, wide,
    route: projected.map(point),
    position(progress: number) {
      const distance = Math.max(0, Math.min(1, progress)) * lengths.at(-1)!
      let j = 1
      while (j < lengths.length - 1 && lengths[j] < distance) j++
      const t = (distance - lengths[j - 1]) / (lengths[j] - lengths[j - 1] || 1)
      const x = route[j - 1][0] + (route[j][0] - route[j - 1][0]) * t
      const z = route[j - 1][1] + (route[j][1] - route[j - 1][1]) * t
      return point(camera.project(x, z))
    }
  }
}
