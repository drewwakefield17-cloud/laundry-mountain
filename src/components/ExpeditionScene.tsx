import { useEffect, useRef, useState } from 'react'
import { BasketAvatar } from './BasketAvatar'
import { sceneAssets } from './MountainScene'
import { paintedMaterial, source } from './TerrainPreview'
import { paintPreview } from './previewSurface'
import { expeditionRoute, SCENIC_EXPEDITIONS, type ScenicExpeditionId } from '../domain/expeditionScenery'
import './expedition-scene.css'

type ScreenPoint = { x: number; y: number }
const cache = new Map<string, HTMLCanvasElement>()

/** Geographic scenery, independent game overlays and a separately rigged basket. */
export function ExpeditionScene({ id, close, metres = 0 }: {
  id: ScenicExpeditionId; close: boolean; metres?: number
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [points,setPoints] = useState<ScreenPoint[]>([])
  const [dimensions,setDimensions] = useState({width:390,height:700})
  const [error,setError] = useState(false)
  const [ready,setReady] = useState(false)
  const previous=useRef({id,metres})
  const [motion,setMotion]=useState<'idle'|'walking'|'celebrating'>('idle')
  const expedition = SCENIC_EXPEDITIONS[id]
  const progress = Math.max(0,Math.min(1,metres/expedition.elevation))
  useEffect(()=>{
    const before=previous.current;previous.current={id,metres}
    if(before.id!==id||metres<=before.metres){setMotion('idle');return}
    setMotion(expedition.checkpoints.some(c=>before.metres<c.metres&&metres>=c.metres)?'celebrating':'walking')
    const timer=window.setTimeout(()=>setMotion('idle'),1800)
    return()=>window.clearTimeout(timer)
  },[id,metres,expedition])
  useEffect(() => {
    let stopped=false, frame=0
    let terrain: Awaited<ReturnType<typeof source>> | undefined
    const el=canvas.current!, context=el.getContext('2d')!
    const materials={...sceneAssets('natural'),ground:paintedMaterial(id)}
    const images=[materials.clouds,materials.stone,materials.meadow,materials.ground]
    setReady(false);setError(false)
    function paint() {
      frame=0
      if(stopped || !terrain || !el.clientWidth || !el.clientHeight || images.some(i=>!i.complete)) return
      const width=el.clientWidth,height=el.clientHeight,dpr=Math.min(devicePixelRatio||1,2)
      const route=expeditionRoute(terrain,id), angle=terrain.heading*Math.PI/180,tilt=6*Math.PI/180
      const world=route.map(p=>({x:p.x*Math.cos(angle)-p.z*Math.sin(angle),
        y:(p.x*Math.sin(angle)+p.z*Math.cos(angle))*Math.sin(tilt)+(p.height-terrain!.datum/1000)*Math.cos(tilt)}))
      const minY=Math.min(...world.map(p=>p.y)),maxY=Math.max(...world.map(p=>p.y))
      const wide=width>height
      // A uniform world scale: never stretch the mountain to fill a tall screen.
      const minX=Math.min(...world.map(p=>p.x)),maxX=Math.max(...world.map(p=>p.x))
      const scale=Math.min(height*(close?.39:wide?.48:.55)/(maxY-minY),close?Infinity:(width-65)/(maxX-minX))
      const view={scale,originX:close?width*.52:width*.5-(minX+maxX)*.5*scale,originY:height*(close?.57:.77)+minY*scale}
      const projected=world.map(p=>({x:view.originX+p.x*scale,y:view.originY-p.y*scale}))
      setPoints(projected);setDimensions({width,height})
      const key=[id,width,height,dpr,close,...images.map(i=>Number(i.complete&&!!i.naturalWidth))].join(':')
      el.width=Math.round(width*dpr);el.height=Math.round(height*dpr)
      context.setTransform(dpr,0,0,dpr,0,0)
      let backdrop=cache.get(key)
      const start=performance.now()
      if(!backdrop) {
        backdrop=document.createElement('canvas');backdrop.width=el.width;backdrop.height=el.height
        const c=backdrop.getContext('2d')!;c.setTransform(dpr,0,0,dpr,0,0)
        paintPreview(c,width,height,terrain,materials,view)
        // A subtle atmospheric veil separates the near trail from the massif.
        const mistColour=id==='fuji'?'#a8bbaa':'#d5e5ee'
        const veil=c.createLinearGradient(0,height*(close?.48:.65),0,height*(close?.72:1))
        veil.addColorStop(0,`${mistColour}00`);veil.addColorStop(.7,`${mistColour}${close?'dd':'66'}`);veil.addColorStop(1,mistColour)
        c.fillStyle=veil;c.fillRect(0,height*(close?.48:.65),width,height)
        cache.set(key,backdrop);while(cache.size>8) cache.delete(cache.keys().next().value!)
      }
      context.drawImage(backdrop,0,0,width,height)
      el.dataset.renderMs=(performance.now()-start).toFixed(1)
      el.dataset.ready='true';el.dataset.framing=wide?'landscape':'portrait'
      setReady(images.every(i=>i.complete&&!!i.naturalWidth))
    }
    const queue=()=>{if(!stopped&&!frame)frame=requestAnimationFrame(paint)}
    const assetError=()=>{if(!stopped)setError(true)}
    images.forEach(i=>i.addEventListener('load',queue))
    images.forEach(i=>i.addEventListener('error',assetError))
    const observer=new ResizeObserver(queue);observer.observe(el)
    source(id).then(data=>{terrain=data;queue()}).catch(()=>{if(!stopped)setError(true)})
    return()=>{stopped=true;cancelAnimationFrame(frame);observer.disconnect();images.forEach(i=>{i.removeEventListener('load',queue);i.removeEventListener('error',assetError)})}
  },[id,close])
  const {width,height}=dimensions,wide=width>height
  const at=(fraction:number)=>points[Math.min(points.length-1,Math.round(fraction*(points.length-1)))]
  // The foreground keeps its original 3:2 aspect ratio. Ground contacts share
  // its cover transform, rather than placing sprites against unrelated CSS boxes.
  const foregroundScale=Math.max(width/1536,height*(wide?1:1.2)/1024)
  const groundPoint=(x:number,y:number)=>({x:(width-1536*foregroundScale)/2+x*1536*foregroundScale,y:(height-1024*foregroundScale)*(wide?.5:1)+y*1024*foregroundScale})
  const player=close?groundPoint((wide?.65:.49)+progress*(wide?.05:.075),(wide?.66:.84)-progress*(wide?.05:.10)):at(progress)
  const nearSock=groundPoint(wide?.75:.59,wide?.58:.735)
  const nearSockHeight=wide?51:86
  const basketWidth=wide?(close?120:44):Math.min(width*(close?.48:.12),close?200:48)
  const next=expedition.checkpoints.find(c=>c.metres>metres)??expedition.checkpoints[3]
  const path=points.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  return <div className={`expedition-world expedition-world--${id} ${close?'is-close':''}`}>
    <canvas ref={canvas} className="expedition-canvas" role="img" aria-label={`Illustrated ${expedition.name} geographic terrain`} />
    <img className="expedition-foreground" src={`/art/${id}-foreground.webp`} alt="" aria-hidden="true" />
    {!close&&points.length>0&&<svg className="expedition-route" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={path} fill="none" stroke="#163e48" strokeOpacity=".32" strokeWidth="3.5" strokeLinejoin="round" />
      <path d={path} fill="none" stroke="#fffcec" strokeWidth="2.3" strokeDasharray="1 8" strokeLinecap="round" />
      {expedition.checkpoints.map(c=>{const fraction=c.metres/expedition.elevation,p=at(fraction),size=(wide?40:58)*(1-.53*fraction),spriteWidth=size*2/3;return p&&<g key={c.metres}>
        <ellipse cx={p.x} cy={p.y} rx={spriteWidth*.23} ry={size*.025} fill="#142f38" opacity=".18" />
        <image href="/art/sock-checkpoint.png" x={p.x-spriteWidth*.46} y={p.y-size*.938} width={spriteWidth} height={size} />
      </g>})}
    </svg>}
    {close&&<img className="expedition-near-sock" style={{left:nearSock.x-nearSockHeight*2/3*.46,top:nearSock.y-nearSockHeight*.938,width:nearSockHeight*2/3,height:nearSockHeight}} src="/art/sock-checkpoint.png" alt="" />}
    {player&&<div className={`expedition-basket ${close ? '' : 'expedition-pin'}`} style={{left:player.x,top:player.y,width:basketWidth}}><BasketAvatar facing={close ? 'uphill' : 'front'} moving={motion==='walking'} celebrating={motion==='celebrating'} />{!close && <span>Scenery preview</span>}</div>}
    <span className="sr-only">{expedition.name}. {next.name}. Expedition scenery preview; progress is not awarded here.</span>
    {!ready&&!error&&<span className="expedition-loading" role="status">Finding your mountain…</span>}
    {error&&<span className="expedition-loading" role="alert">This mountain couldn’t load. Open it again to retry.</span>}
  </div>
}
