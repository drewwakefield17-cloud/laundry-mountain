// A lightweight height field keeps the mountain and trail genuinely data driven.
// Coordinates describe an illustrative game world, never a real hiking route.
export const WORLD = { minX: -1.65, maxX: 1.65, near: -0.15, far: 3.0 }
export const fract = (n: number) => n - Math.floor(n)
const hash = (x: number, z: number) => fract(Math.sin(x * 127.1 + z * 311.7) * 43758.5453)
export function terrainNoise(x: number, z: number) {
  const ix = Math.floor(x),
    iz = Math.floor(z),
    u = x - ix,
    v = z - iz,
    a = u * u * (3 - 2 * u),
    b = v * v * (3 - 2 * v)
  return (
    (hash(ix, iz) * (1 - a) + hash(ix + 1, iz) * a) * (1 - b) +
    (hash(ix, iz + 1) * (1 - a) + hash(ix + 1, iz + 1) * a) * b
  )
}
export function heightAt(x: number, z: number) {
  const dx = (x - 0.3) / 1.42,
    dz = (z - 1.9) / 1.22,
    d = Math.hypot(dx, dz),
    angle = Math.atan2(dz, dx)
  const erosion = Math.sin(angle * 7 + terrainNoise(x * 3, z * 3) * 2) * 0.068 * Math.min(1, d * 1.8)
  const rough =
    (terrainNoise(x * 11 + 8, z * 10) - 0.5) * 0.065 +
    (terrainNoise(x * 29, z * 27) - 0.5) * 0.029 +
    (terrainNoise(x * 67, z * 61) - 0.5) * 0.014
  const massif = Math.max(0.02, Math.min(1.035, 1.33 - Math.pow(d, 1.05) * 0.87 + erosion))
  const shoulder = Math.max(0, 0.63 - Math.hypot((x + 1.04) * 0.9, (z - 2.25) * 1.25) * 0.65)
  const glen = 0.03 + terrainNoise(x * 3 + 7, z * 4) * 0.065
  return Math.max(glen, massif, shoulder) + rough * Math.min(1, massif * 2)
}
export function projectWorld(x: number, z: number, y = heightAt(x, z)) {
  return { x: 0.5 + x * 0.31 + (z - 1.5) * 0.045, y: 0.985 - z * 0.137 - y * 0.49 }
}
const trail = [
  [-1.02, 0.1],
  [-0.6, 0.38],
  [-1.02, 0.65],
  [-0.25, 0.93],
  [-0.72, 1.16],
  [0.12, 1.41],
  [-0.22, 1.63],
  [0.3, 1.84],
  [0.31, 1.98]
]
// Sample gentle switchbacks on the same height field as the visible ground.
const curve = (a: number, b: number, c: number, d: number, t: number) =>
  0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t)
export const BEN_NEVIS_TRAIL = Array.from({ length: (trail.length - 1) * 12 + 1 }, (_, step) => {
  const index = Math.min(trail.length - 2, Math.floor(step / 12)),
    t = (step - index * 12) / 12
  const a = trail[Math.max(0, index - 1)],
    b = trail[index],
    c = trail[index + 1],
    d = trail[Math.min(trail.length - 1, index + 2)]
  const p = projectWorld(curve(a[0], b[0], c[0], d[0], t), curve(a[1], b[1], c[1], d[1], t))
  return [p.x, p.y]
})
