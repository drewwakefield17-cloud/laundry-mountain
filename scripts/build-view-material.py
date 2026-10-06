"""Guide and bake illustration onto sourced terrain, never a scene background.

guide: save a terrain-only perspective guide plus reproducible projection buffers.
bake PATH: inverse-project the painted guide onto the north-up world material.
Only visible ground samples are transferred; silhouettes/geometry are untouched.
"""
from pathlib import Path
import json, sys
import numpy as np
from PIL import Image, ImageFilter

root = Path(__file__).resolve().parent.parent
cache = root / 'artifacts/geography'; cache.mkdir(parents=True, exist_ok=True)
art = root / 'docs/design/source-art'
geo = json.loads((root / 'public/data/ben-nevis.json').read_text())
fine = json.loads((root / 'public/data/ben-nevis-crags.json').read_text())
coarse = np.array(geo['heights']).reshape(261, 261) / 1000
crags = np.array(fine['heights']).reshape(141, 141) / 1000

def sample(grid, x, z, min_x, min_z, step):
    n = grid.shape[0]
    fx = np.clip((x - min_x) / step, 0, n - 1.000001)
    fz = np.clip((z - min_z) / step, 0, n - 1.000001)
    i, j = fx.astype(int), fz.astype(int); a, b = fx - i, fz - j
    return (grid[j, i] * (1-a) + grid[j, i+1] * a) * (1-b) + (grid[j+1, i] * (1-a) + grid[j+1, i+1] * a) * b

def height(x, z):
    base = sample(coarse, x, z, -6.5, -6.5, .05)
    detail = sample(crags, x, z, 0, -1.5, .025)
    blend = np.clip(np.minimum.reduce([x, 3.5-x, z+1.5, 2-z]) / .05, 0, 1)
    return base + (detail-base) * blend

scenic = sys.argv[-1] == 'scenic'
eye = np.array([-.926, float(height(np.array(-.926), np.array(5.503))) + .002, 5.503]) if scenic else np.array([-5.35, float(height(np.array(-5.35), np.array(1.74))) + .9, 1.74])
target = np.array([1.7, .85, -.65]) if scenic else np.array([geo['summit'][0], .8, geo['summit'][1]])
forward = target - eye; forward /= np.linalg.norm(forward)
right = np.array([forward[2], 0, -forward[0]]); right /= np.linalg.norm(right)
up = np.cross(forward, right)

def project(x, z, y):
    relative = np.stack([x-eye[0], y-eye[1], z-eye[2]], axis=-1)
    distance = relative @ forward
    return (.6 if scenic else .5) + (relative @ right) * 2.2 / np.maximum(.08, distance), .5 - (relative @ up) * 2.2 / np.maximum(.08, distance), distance

route = np.array(geo['route']); rx, rz = route[:, 0], route[:, 1]
px, py, _ = project(rx, rz, height(rx, rz))
left, right_edge, top, bottom = px.min(), px.max(), py.min(), py.max()
w, h = (1024,768) if scenic else (768,1428)
scale = min(w*.84/(right_edge-left), (h-2*92*w/390)/(bottom-top))

def screen(x, z, y):
    px, py, depth = project(x, z, y)
    if scenic:
        return w*.5+(px-.5)*min(w,h*1.32), h*.58+(py-.5)*min(w,h*1.32), depth
    return w*.5+(px-(left+right_edge)/2)*scale, h*.5+(py-(top+bottom)/2)*scale, depth

view_name = 'scenic' if scenic else 'route'

if len(sys.argv) > 1 and sys.argv[1] == 'bake':
    buffers = np.load(cache / f'material-view-{view_name}.npz')
    painted = np.array(Image.open(sys.argv[2]).convert('RGB').resize((w,h), Image.Resampling.LANCZOS))
    # Concentrate texels on this view's visible slopes. A full 13 km square
    # wasted most resolution on unseen ground and softened the painted strokes.
    nx, nz = 3072, 3072
    x, z = np.meshgrid(np.linspace(-4,6,nx), np.linspace(6,-2,nz))
    sx, sy, distance = screen(x,z,height(x,z))
    ix = np.clip(sx.astype(int),0,w-1); iy = np.clip(sy.astype(int),0,h-1)
    # A hidden hillside must never receive paint from the slope in front of it.
    visible = (sx>=0)&(sx<w)&(sy>=0)&(sy<h)&(distance>0)
    visible &= np.abs(1/distance-buffers['depth'][iy,ix]) < .0008
    alpha = np.array(Image.fromarray((visible*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.5))) / 255
    alpha *= visible
    # Fade the original view boundary before projecting its paint. Otherwise a
    # wider phone orientation reveals a rectangular edge in the world material.
    edge = np.minimum.reduce([sx,w-1-sx,sy,h-1-sy])
    alpha *= np.clip(edge/100,0,1)
    rgba = np.concatenate([painted[iy,ix],(alpha[...,None]*255).astype('uint8')],axis=-1)
    if scenic:
        previous = np.array(Image.open(cache/'ben-nevis-view-material-baked.png').convert('RGBA'))
        opacity = rgba[...,3:4].astype(float)/255
        previous_opacity = previous[...,3:4].astype(float)/255
        combined = opacity+previous_opacity*(1-opacity)
        rgba[...,:3] = np.clip((previous[...,:3]*previous_opacity*(1-opacity)+rgba[...,:3]*opacity)/np.maximum(combined,1e-8),0,255)
        rgba[...,3] = (combined[...,0]*255).astype('uint8')
    Image.fromarray(rgba).save(cache/'ben-nevis-view-material-baked.png')
    Image.fromarray(rgba).save(root/'public/textures/ben-nevis-view-material.webp',quality=94)
    print(f'Baked {visible.sum()} visible world texels ({visible.mean():.1%}); retained existing material elsewhere')
    sys.exit()

pixels = np.zeros((h,w,3),dtype='uint8'); pixels[:]=[229,243,222]
depth = np.zeros((h,w),dtype='float32')
atlas = np.array(Image.open(art/'ben-nevis-ground-atlas.png').convert('RGB'))
an = atlas.shape[0]
for size, start_x, start_z, step in [(261,-6.5,-6.5,.05),(141,0,-1.5,.025)]:
    x,z = np.meshgrid(start_x+np.arange(size)*step,start_z+np.arange(size)*step)
    y = height(x,z); sx,sy,d = screen(x,z,y)
    vertices = np.stack([sx,sy,1/np.maximum(d,.001),x,z,y],axis=-1)
    for j in range(size-1):
        for i in range(size-1):
            if size==261 and 0-1e-8<=x[j,i] and x[j,i]+step<=3.5+1e-8 and -1.5-1e-8<=z[j,i] and z[j,i]+step<=2+1e-8: continue
            for a,b,c in [(vertices[j,i],vertices[j,i+1],vertices[j+1,i]),(vertices[j,i+1],vertices[j+1,i+1],vertices[j+1,i])]:
                if max(a[2],b[2],c[2])>1/.12: continue
                x0=max(0,int(min(a[0],b[0],c[0]))); x1=min(w-1,int(max(a[0],b[0],c[0])+1))
                y0=max(0,int(min(a[1],b[1],c[1]))); y1=min(h-1,int(max(a[1],b[1],c[1])+1))
                if x0>x1 or y0>y1: continue
                area=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
                if abs(area)<.001: continue
                xx,yy=np.meshgrid(np.arange(x0,x1+1)+.5,np.arange(y0,y1+1)+.5)
                u=((b[1]-c[1])*(xx-c[0])+(c[0]-b[0])*(yy-c[1]))/area
                v=((c[1]-a[1])*(xx-c[0])+(a[0]-c[0])*(yy-c[1]))/area; q=1-u-v
                inverse=u*a[2]+v*b[2]+q*c[2]
                region=depth[y0:y1+1,x0:x1+1]
                take=(u>=0)&(v>=0)&(q>=0)&(inverse>region)
                if not take.any(): continue
                wx=(u*a[2]*a[3]+v*b[2]*b[3]+q*c[2]*c[3])/np.maximum(inverse,1e-8)
                wz=(u*a[2]*a[4]+v*b[2]*b[4]+q*c[2]*c[4])/np.maximum(inverse,1e-8)
                tx=np.clip(((wx+6.5)/13*(an-1)).astype(int),0,an-1)
                tz=np.clip(((6.5-wz)/13*(an-1)).astype(int),0,an-1)
                pixels[y0:y1+1,x0:x1+1][take]=atlas[tz,tx][take]
                region[take]=inverse[take]
Image.fromarray(pixels).save(art/f'ben-nevis-{view_name}-material-control.png')
np.savez_compressed(cache/f'material-view-{view_name}.npz',depth=depth)
print(art/f'ben-nevis-{view_name}-material-control.png')
