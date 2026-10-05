import { useEffect, useRef } from 'react'
import { BEN_NEVIS } from '../domain/config'
import { routePosition } from '../domain/expedition'
import { drawHighlands } from './mountainTerrain'

export function MountainScene({ metres, close, focusMetres }: { metres: number; close: boolean; focusMetres?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null), shown = useRef(metres)
  useEffect(() => {
    const el = canvas.current!, ctx = el.getContext('2d')!
    const terrain = document.createElement('canvas'), backdrop = terrain.getContext('2d')!
    let frame = 0, width = 0, height = 0, ratio = 1, disposed = false
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    const draw = () => {
      frame = 0; if (disposed || !width || !height || document.hidden) return
      const difference = metres - shown.current
      shown.current = motion.matches || Math.abs(difference) < .05 ? metres : shown.current + difference * .14
      const player = routePosition(shown.current), focus = routePosition(focusMetres ?? shown.current)
      ctx.setTransform(ratio,0,0,ratio,0,0); ctx.clearRect(0,0,width,height); ctx.save()
      if (close) { const x=Math.max(.5/2.05,Math.min(1-.5/2.05,focus.x)), y=Math.max(.57/2.05,Math.min(1-.43/2.05,focus.y)); ctx.translate(width*.5,height*.57);ctx.scale(2.05,2.05);ctx.translate(-x*width,-y*height) }
      ctx.drawImage(terrain,0,0,width,height)
      const path = (progress: number) => {
        ctx.beginPath(); const t=progress*(BEN_NEVIS.route.length-1), last=Math.floor(t)
        BEN_NEVIS.route.forEach(([x,y],i)=>{ if(i<=last) i?ctx.lineTo(x*width,y*height):ctx.moveTo(x*width,y*height) })
        const end=routePosition(progress*BEN_NEVIS.elevation);ctx.lineTo(end.x*width,end.y*height)
      }
      ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle='#233f3855';ctx.lineWidth=5;path(1);ctx.stroke()
      ctx.setLineDash([3,5]);ctx.strokeStyle='#f4f0d7';ctx.lineWidth=2;path(1);ctx.stroke();ctx.setLineDash([])
      ctx.strokeStyle='#79d7a6';ctx.lineWidth=3;path(player.progress);ctx.stroke()
      for (const checkpoint of BEN_NEVIS.checkpoints) {
        const p=routePosition(checkpoint.metres), reached=metres>=checkpoint.metres
        ctx.fillStyle=reached?'#2dbe78':'#faf8e8';ctx.strokeStyle='#31554a';ctx.lineWidth=1.5
        ctx.beginPath();ctx.arc(p.x*width,p.y*height,3.5,0,Math.PI*2);ctx.fill();ctx.stroke()
      }
      const summit=routePosition(BEN_NEVIS.elevation), sx=summit.x*width,sy=summit.y*height
      ctx.fillStyle='#d6d6bd';ctx.beginPath();ctx.moveTo(sx-5,sy+2);ctx.lineTo(sx,sy-7);ctx.lineTo(sx+5,sy+2);ctx.closePath();ctx.fill()
      ctx.strokeStyle='#435b50';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(sx,sy-5);ctx.lineTo(sx,sy-24);ctx.stroke()
      ctx.fillStyle='#f5bf4f';ctx.beginPath();ctx.moveTo(sx,sy-24);ctx.lineTo(sx+13,sy-20);ctx.lineTo(sx,sy-16);ctx.closePath();ctx.fill()
      if (focusMetres!==undefined) {
        ctx.strokeStyle='#f5bf4f';ctx.lineWidth=2;ctx.beginPath();ctx.arc(focus.x*width,focus.y*height,9,0,Math.PI*2);ctx.stroke()
      }
      const px=player.x*width,py=player.y*height
      ctx.fillStyle='#12352d';ctx.beginPath();ctx.ellipse(px,py+2,7,3,0,0,Math.PI*2);ctx.fill()
      ctx.strokeStyle='#fff8e2';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px,py-26);ctx.stroke()
      ctx.fillStyle='#f48a32';ctx.beginPath();ctx.moveTo(px+1,py-26);ctx.quadraticCurveTo(px+11,py-28,px+19,py-21);ctx.lineTo(px+1,py-15);ctx.closePath();ctx.fill()
      ctx.restore()
      if (Math.abs(metres-shown.current)>.01) frame=requestAnimationFrame(draw)
    }
    const requestDraw=()=>{ if (!frame && !disposed) frame=requestAnimationFrame(draw) }
    const resize = () => {
      width=el.clientWidth;height=el.clientHeight;ratio=Math.min(devicePixelRatio||1,2)
      if (!width || !height) return
      el.width=Math.round(width*ratio);el.height=Math.round(height*ratio)
      terrain.width=el.width;terrain.height=el.height;backdrop.setTransform(ratio,0,0,ratio,0,0)
      drawHighlands(backdrop,width,height);requestDraw()
    }
    const observer=new ResizeObserver(resize);observer.observe(el)
    document.addEventListener('visibilitychange',requestDraw);motion.addEventListener('change',requestDraw);resize()
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',requestDraw);motion.removeEventListener('change',requestDraw)}
  }, [metres,close,focusMetres])
  return <canvas ref={canvas} className="mountain-canvas" aria-label={`Ben Nevis stylised route. Your position: ${Math.round(metres)} of 1,345 Laundry Metres.`} role="img" />
}
