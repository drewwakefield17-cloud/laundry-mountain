"""Ground-only illustration guides and world-UV bakes for locked expeditions.
Uses the same orthographic geometry as previewSurface.ts; no new landforms.
Usage: python scripts/build-preview-material.py ID [PAINTED_IMAGE]
"""
from pathlib import Path
import json, sys
import numpy as np
from PIL import Image, ImageFilter

root=Path(__file__).resolve().parent.parent
art=root/'docs/design/source-art'; cache=root/'artifacts/geography'
cache.mkdir(parents=True,exist_ok=True)
mountain=sys.argv[1]; data=json.loads((root/f'public/data/{mountain}.json').read_text())
n=data['size']; span=data['span']; heights=np.array(data['heights']).reshape(n,n)/1000
angle=np.deg2rad(data['heading']); tilt=np.deg2rad(6); w,h=768,540
scale=min(w/(span*.42),h/((data['elevation']-data['datum'])/1000*1.5))

def project(x,z,y):
    depth=x*np.sin(angle)+z*np.cos(angle)
    return w*.5+(x*np.cos(angle)-z*np.sin(angle))*scale,h*.81-(depth*np.sin(tilt)+(y-data['datum']/1000)*np.cos(tilt))*scale,depth

if len(sys.argv)>2:
    painted=np.array(Image.open(sys.argv[2]).convert('RGB').resize((w,h),Image.Resampling.LANCZOS))
    buffers=np.load(cache/f'{mountain}-material-view.npz')
    side=1024
    x,z=np.meshgrid(np.linspace(-span/2,span/2,side),np.linspace(span/2,-span/2,side))
    fx=(x/span+.5)*(n-1); fz=(z/span+.5)*(n-1)
    i=np.clip(fx.astype(int),0,n-2); j=np.clip(fz.astype(int),0,n-2); a,b=fx-i,fz-j
    y=(heights[j,i]*(1-a)+heights[j,i+1]*a)*(1-b)+(heights[j+1,i]*(1-a)+heights[j+1,i+1]*a)*b
    sx,sy,depth=project(x,z,y); ix=np.clip(sx.astype(int),0,w-1); iy=np.clip(sy.astype(int),0,h-1)
    visible=(sx>=0)&(sx<w)&(sy>=0)&(sy<h)&(abs(depth-buffers['depth'][iy,ix])<span*.005)
    alpha=np.array(Image.fromarray((visible*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1)))*visible
    rgba=np.concatenate([painted[iy,ix],alpha[...,None]],axis=-1).astype('uint8')
    Image.fromarray(rgba).save(cache/f'{mountain}-material-baked.png')
    Image.fromarray(rgba).save(root/f'public/textures/{mountain}-terrain-material.webp',quality=94)
    print(f'{mountain}: baked {visible.mean():.1%} of world atlas')
    sys.exit()

x,z=np.meshgrid(np.linspace(-span/2,span/2,n),np.linspace(-span/2,span/2,n))
sx,sy,depth=project(x,z,heights)
dx=np.gradient(heights,span/(n-1),axis=1); dz=np.gradient(heights,span/(n-1),axis=0)
light=np.clip((.57+dx*.8-dz*.6)/np.sqrt(1+dx*dx+dz*dz),0,1)
snow=np.clip((heights*1000-data['snow'])/350,0,1)*np.clip(1.45-np.hypot(dx,dz),0,1)
green=np.clip((data['forest']-heights*1000)/180,0,1)
rock= np.array([18,51,75])[None,None,:]*(1-light[...,None])+np.array([229,213,166])[None,None,:]*light[...,None]
grass=np.array([11,65,53])[None,None,:]*(1-light[...,None])+np.array([174,194,103])[None,None,:]*light[...,None]
ice=np.array([65,123,153])[None,None,:]*(1-light[...,None])+np.array([255,251,222])[None,None,:]*light[...,None]
colour=(rock*(1-green[...,None])+grass*green[...,None])*(1-snow[...,None])+ice*snow[...,None]
vertices=np.concatenate([sx[...,None],sy[...,None],depth[...,None],colour],axis=-1)
pixels=np.zeros((h,w,3),dtype='uint8'); pixels[:]=[229,243,222]
depths=np.full((h,w),np.inf,dtype='float32')
for j in range(n-1):
    for i in range(n-1):
        for a,b,c in [(vertices[j,i],vertices[j,i+1],vertices[j+1,i]),(vertices[j,i+1],vertices[j+1,i+1],vertices[j+1,i])]:
            x0=max(0,int(min(a[0],b[0],c[0]))); x1=min(w-1,int(max(a[0],b[0],c[0])+1))
            y0=max(0,int(min(a[1],b[1],c[1]))); y1=min(h-1,int(max(a[1],b[1],c[1])+1))
            if x0>x1 or y0>y1: continue
            area=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
            if abs(area)<.001: continue
            xx,yy=np.meshgrid(np.arange(x0,x1+1)+.5,np.arange(y0,y1+1)+.5)
            u=((b[1]-c[1])*(xx-c[0])+(c[0]-b[0])*(yy-c[1]))/area
            v=((c[1]-a[1])*(xx-c[0])+(a[0]-c[0])*(yy-c[1]))/area; q=1-u-v
            depth=u*a[2]+v*b[2]+q*c[2]; region=depths[y0:y1+1,x0:x1+1]
            take=(u>=0)&(v>=0)&(q>=0)&(depth<region)
            pixels[y0:y1+1,x0:x1+1][take]=np.clip(u[...,None]*a[3:]+v[...,None]*b[3:]+q[...,None]*c[3:],0,255)[take]
            region[take]=depth[take]
Image.fromarray(pixels).save(art/f'{mountain}-material-control.png')
np.savez_compressed(cache/f'{mountain}-material-view.npz',depth=depths)
print(art/f'{mountain}-material-control.png')
