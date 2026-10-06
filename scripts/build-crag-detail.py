"""Sourced 25 m refinement around Ben Nevis's summit and North Face only."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request, json, math, hashlib
from PIL import Image
root=Path(__file__).resolve().parent.parent
cache=root/'artifacts/geography'; cache.mkdir(parents=True,exist_ok=True)
lat0,lon0=56.803,-5.036
kmLat=111.195; kmLon=kmLat*math.cos(math.radians(lat0))
n,step,minX,minZ,zoom=141,.025,0,-1.5,13
factor=256*2**zoom; positions=[]; tiles=set()
for j in range(n):
    for i in range(n):
        lat=lat0+(minZ+j*step)/kmLat; lon=lon0+(minX+i*step)/kmLon
        x=(lon+180)/360*factor-.5
        y=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*factor-.5
        positions.append((x,y))
        for xx,yy in [(math.floor(x),math.floor(y)),(math.floor(x)+1,math.floor(y)+1)]: tiles.add((xx//256,yy//256))
def load(key):
    x,y=key; url=f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{zoom}/{x}/{y}.png'
    path=cache/f'terrarium-{zoom}-{x}-{y}.png'
    if not path.exists():
        with urllib.request.urlopen(url,timeout=40) as response: path.write_bytes(response.read())
    return key,Image.open(path).convert('RGB'),{'url':url,'sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
with ThreadPoolExecutor(max_workers=4) as pool: loaded=list(pool.map(load,sorted(tiles)))
images={key:image for key,image,_ in loaded}
def height(x,y):
    r,g,b=images[x//256,y//256].getpixel((x%256,y%256)); return r*256+g+b/256-32768
heights=[]
for x,y in positions:
    ix,iy=math.floor(x),math.floor(y); a,b=x-ix,y-iy
    heights.append(round((height(ix,iy)*(1-a)+height(ix+1,iy)*a)*(1-b)+(height(ix,iy+1)*(1-a)+height(ix+1,iy+1)*a)*b))
data={'grid':{'size':n,'stepKm':step,'minX':minX,'minZ':minZ},'heights':heights}
(root/'public/data/ben-nevis-crags.json').write_text(json.dumps(data,separators=(',',':')),encoding='utf-8')
(root/'docs/design/crag-detail-sources.json').write_text(json.dumps({'gridSpacingMetres':25,'verticalScale':1,'sourceTiles':[source for _,_,source in loaded]},indent=2),encoding='utf-8')
print(f'Saved {len(heights)} samples, range {min(heights)}–{max(heights)} m')
