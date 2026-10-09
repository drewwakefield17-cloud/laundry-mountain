import { MOUNTAINS, type MountainId } from '../domain/mountains'

// Artwork-space anchors on the dry painted path. This is game progress, not a hiking map.
const benTrail = [[53,82],[45,77],[60.7,71.7],[56,68],[43,64],[47,61],[55,58.5],[65,54],[72,51],[75,49.3],[73,48],[66,46],[59,44],[63,42],[69,41],[68,40],[64,38.6],[67,37.3],[73,36],[75,34.7],[74,33.9],[69,32.7],[65,31.3],[66,30.7],[72,29.5],[74,28.5],[74,27.5],[71,26.6],[70,25],[67.6,23.8],[65.6,22.6],[63.6,21.2],[61.5,20.1],[60,19.2],[60.7,18.4]]
const trails: Record<MountainId, number[][]> = {
  'ben-nevis': benTrail,
  fuji: [[59,78],[67,74],[63,71],[59,68],[69,65],[75,61],[82,58],[76,55],[65,52],[78,49],[82,47],[70,44],[68,43],[78,39],[71,37],[67,35.5],[77,33],[73,31],[68,30],[75,28],[68,26],[69,24],[70,22],[68,20],[66,18],[65,16]],
  everest: [[61,78],[68,73],[58,69],[65,67],[78,62],[75,58],[61,53],[75,49.5],[63,46],[78,42.5],[65,38.5],[72,36.8],[66,35],[72,33.7],[65,31.7],[63,30.2],[66,28.8],[60,26.5],[62,24.6],[64,22],[62,18],[63,15]],
}

export function IllustratedMountainScene({ metres, mountainId = 'ben-nevis', locked = false }: { metres: number; mountainId?: MountainId; locked?: boolean }) {
  const mountain = MOUNTAINS[mountainId]
  const trail = trails[mountainId]
  const lengths = trail.slice(1).map((p,i) => Math.hypot((p[0]-trail[i][0])*948, (p[1]-trail[i][1])*1659))
  const total = lengths.reduce((a,b) => a+b,0)
  function pointAt(distance: number) {
    let remaining = Math.min(1,Math.max(0,distance/mountain.elevation))*total
    for (let i=0;i<lengths.length;i++) {
      if (remaining<=lengths[i]) {const t=remaining/lengths[i];return [trail[i][0]+(trail[i+1][0]-trail[i][0])*t,trail[i][1]+(trail[i+1][1]-trail[i][1])*t]}
      remaining-=lengths[i]
    }
    return trail[trail.length-1]
  }
  const player = pointAt(metres)
  const labelBelow = mountainId !== 'ben-nevis' && player[1] < 24
  return <div className="illustrated-overview" aria-label={`${mountain.name} illustrated game map. You have climbed ${Math.round(metres)} Laundry Metres.`}>
    <svg viewBox="0 0 948 1659" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Your trail to the ${mountain.name} summit`}>
      <image href={mountainId === 'ben-nevis' ? '/art/coordinated-ben-nevis-map.webp' : `/art/playable-${mountainId}-map.webp`} width="948" height="1659" />
      <polyline points={trail.map(p=>`${p[0]*9.48},${p[1]*16.59}`).join(' ')} fill="none" stroke="#173e3838" strokeWidth="14" strokeLinejoin="round" />
      <polyline points={trail.map(p=>`${p[0]*9.48},${p[1]*16.59}`).join(' ')} fill="none" stroke="#fffdf0" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 23" />
      {mountain.checkpoints.filter(c=>c.metres>0).map(c=>{const p=pointAt(c.metres);const width=86-c.metres/mountain.elevation*39;const height=width*2.17;return <svg key={c.metres} x={p[0]*9.48-width*.25} y={p[1]*16.59-height} width={width} height={height} viewBox="150 229 613 1329"><title>{c.name} · {c.metres} Laundry Metres</title><image href="/art/reference-sock-marker.webp" width="887" height="1774" /></svg>})}
      {!locked && <g transform={`translate(${player[0]*9.48},${player[1]*16.59})`} className="overview-player">
        <circle cy="-12" r="15" fill="#009470" stroke="white" strokeWidth="7" />
        <circle cy={labelBelow ? 64 : -76} r="43" fill="#eaffef" stroke="white" strokeWidth="8" />
        <image href="/art/reference-basket-walk.webp" x="-40" y={labelBelow ? 24 : -116} width="80" height="80" />
        <foreignObject x={player[0] > 64 ? -265 : 42} y={labelBelow ? 37 : -103} width="225" height="66"><div className="overview-player-label">You · {Math.round(metres).toLocaleString()} m</div></foreignObject>
      </g>}
    </svg>
  </div>
}
