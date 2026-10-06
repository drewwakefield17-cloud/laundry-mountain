import geography from '../../public/data/ben-nevis.json'

// East/north coordinates and heights ALL use kilometres. The 50 m mesh comes
// from real elevation data, with no vertical exaggeration. See geography.md.
export const BEN_NEVIS_GEOGRAPHY = geography
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
export function heightAt(x: number, z: number) {
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
// Perspective from the northwest reveals the northern crags and western path.
// Camera distance, coordinates and elevation all use kilometres; no height stretch.
const AZIMUTH = (125 * Math.PI) / 180,
  TILT = (23 * Math.PI) / 180
export function cameraDepth(x: number, z: number) {
  return x * Math.sin(AZIMUTH) + z * Math.cos(AZIMUTH)
}
export function viewDepth(x: number, z: number, y = heightAt(x, z)) {
  return 8 + cameraDepth(x, z) * Math.cos(TILT) - y * Math.sin(TILT)
}
export function projectWorld(x: number, z: number, y = heightAt(x, z)) {
  const right = x * Math.cos(AZIMUTH) - z * Math.sin(AZIMUTH)
  const up = cameraDepth(x, z) * Math.sin(TILT) + y * Math.cos(TILT)
  const perspective = 8 / 4.5 / Math.max(0.5, viewDepth(x, z, y))
  return { x: 0.5 + right * perspective, y: 0.58 - up * perspective }
}
export function scenePoint(point: { x: number; y: number }, width: number, height: number) {
  // Centre one undistorted coordinate system; scenery extends past its edges.
  const scale = Math.min(width, height * 1.32)
  return {
    x: width * 0.5 + (point.x - 0.5) * scale,
    y: height * 0.58 - Math.max(0, height - width) * 0.18 + (point.y - 0.5) * scale
  }
}
// A low, north-northwest scenic viewpoint near Torlundy. The camera looks
// towards the actual North Face; all vectors and terrain dimensions stay in km.
const eye = { x: -1.25, z: 5.15, y: heightAt(-1.25, 5.15) + 0.025 }
const target = { x: 1.3, z: -0.45, y: 0.62 }
const vx = target.x - eye.x,
  vy = target.y - eye.y,
  vz = target.z - eye.z
const distance = Math.hypot(vx, vy, vz),
  horizontal = Math.hypot(vx, vz)
const forward = { x: vx / distance, y: vy / distance, z: vz / distance }
const right = { x: vz / horizontal, z: -vx / horizontal }
const up = { x: forward.y * right.z, y: forward.z * right.x - forward.x * right.z, z: -forward.y * right.x }
export const landscapeCamera = {
  depth(x: number, z: number, y = heightAt(x, z)) {
    return (x - eye.x) * forward.x + (y - eye.y) * forward.y + (z - eye.z) * forward.z
  },
  project(x: number, z: number, y = heightAt(x, z)) {
    const xx = x - eye.x,
      yy = y - eye.y,
      zz = z - eye.z
    const d = Math.max(0.08, xx * forward.x + yy * forward.y + zz * forward.z)
    return {
      x: 0.73 + ((xx * right.x + zz * right.z) * 2.2) / d,
      y: 0.47 - ((xx * up.x + yy * up.y + zz * up.z) * 2.2) / d
    }
  }
}

// Equal-distance samples retain the mapped path's bends and switchbacks.
const route = geography.route,
  lengths = [0]
for (let i = 1; i < route.length; i++)
  lengths.push(lengths[i - 1] + Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]))
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
