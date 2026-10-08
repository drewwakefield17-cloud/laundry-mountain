import type { PreviewTerrain } from '../components/previewSurface'

export type ScenicExpeditionId = 'fuji' | 'everest'
// Laundry checkpoints and the illustrated game trail are not hiking navigation.
// Terrain positions use the unchanged north-up elevation grid in kilometres.
export const SCENIC_EXPEDITIONS = {
  fuji: {
    name: 'Mount Fuji', region: 'Japan', elevation: 3776,
    tagline: 'A fresh load. A new horizon.',
    checkpoints: [
      { metres: 800, name: 'Out of the forest' },
      { metres: 1800, name: 'Above the clouds' },
      { metres: 2900, name: 'The final switchbacks' },
      { metres: 3776, name: 'Hello, higher ground' }
    ],
    route: [[.3,7],[.9,6],[.5,5.3],[1.3,4.6],[.8,4],[1.5,3.4],[.7,3],[1.25,2.6],[.5,2.2],[.9,1.8],[.35,1.5],[.65,1.15],[.25,.85],[.4,.6],[.1,.35],[0,0]],
  },
  everest: {
    name: 'Everest', region: 'The Himalayas', elevation: 8849,
    tagline: 'Even the biggest piles have a summit.',
    checkpoints: [
      { metres: 1800, name: 'Ice to meet you' },
      { metres: 4200, name: 'A whole new altitude' },
      { metres: 6800, name: 'On top of the washing' },
      { metres: 8849, name: 'Top of your world' }
    ],
    route: [[.1,7.5],[.5,6.8],[1.25,6],[1.5,5.5],[1.15,4.9],[1.2,4.3],[1.5,3.8],[1.1,3.3],[.9,2.8],[.85,2.3],[.5,1.85],[.55,1.3],[.2,.9],[.25,.5],[0,0]],
  }
} as const

export function scenicExpeditionId(value: string | null): ScenicExpeditionId | null {
  return value === 'fuji' || value === 'everest' ? value : null
}

export function terrainHeight(data: PreviewTerrain, x: number, z: number) {
  const n = data.size, clamp = (v: number) => Math.max(0, Math.min(n - 1.00001, v))
  const px = clamp((x / data.span + .5) * (n - 1)), pz = clamp((z / data.span + .5) * (n - 1))
  const i = Math.floor(px), j = Math.floor(pz), a = px - i, b = pz - j
  return ((data.heights[j*n+i]*(1-a)+data.heights[j*n+i+1]*a)*(1-b)
    +(data.heights[(j+1)*n+i]*(1-a)+data.heights[(j+1)*n+i+1]*a)*b) / 1000
}

export function expeditionRoute(data: PreviewTerrain, id: ScenicExpeditionId) {
  const stops = SCENIC_EXPEDITIONS[id].route
  const points: { x: number; z: number; height: number }[] = []
  stops.slice(0,-1).forEach((p,i) => {
    const q = stops[i+1]
    for (let k=0;k<16;k++) {
      const t=k/16, x=p[0]+(q[0]-p[0])*t,z=p[1]+(q[1]-p[1])*t
      points.push({x,z,height:terrainHeight(data,x,z)})
    }
  })
  points.push({x:0,z:0,height:terrainHeight(data,0,0)})
  return points
}
