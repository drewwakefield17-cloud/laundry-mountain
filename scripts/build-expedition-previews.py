"""Small real-elevation datasets for the five locked expedition previews."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import urllib.request, math, json, hashlib
from PIL import Image
root=Path(__file__).resolve().parent.parent
cache=root/'artifacts/geography'; cache.mkdir(exist_ok=True)
configs=[
 dict(id='fuji',name='Mount Fuji',region='Japan',elevation=3776,lat=35.3606,lon=138.7274,span=20,zoom=11,heading=180,datum=800,snow=3150,forest=1900),
 dict(id='matterhorn',name='Matterhorn',region='Swiss & Italian Alps',elevation=4478,lat=45.9763,lon=7.6586,span=10,zoom=12,heading=225,datum=1800,snow=3100,forest=2100),
 dict(id='kilimanjaro',name='Kilimanjaro',region='Tanzania',elevation=5895,lat=-3.0674,lon=37.3556,span=30,zoom=11,heading=0,datum=1600,snow=5700,forest=3000),
 dict(id='denali',name='Denali',region='Alaska',elevation=6190,lat=63.0695,lon=-151.0074,span=28,zoom=10,heading=0,datum=800,snow=1900,forest=700),
 dict(id='everest',name='Everest',region='Himalayas',elevation=8849,lat=27.9881,lon=86.9250,span=18,zoom=11,heading=180,datum=4700,snow=5800,forest=0),
]
manifest=[]
for conf in configs:
 n=129; span=conf['span']; z=conf['zoom']; factor=256*2**z
 positions=[]; tiles=set()
 for j in range(n):
  for i in range(n):
   lat=conf['lat']+(j/(n-1)-.5)*span/111.195
   lon=conf['lon']+(i/(n-1)-.5)*span/(111.195*math.cos(math.radians(conf['lat'])))
   x=(lon+180)/360*factor-.5;y=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*factor-.5
   positions.append((x,y))
   for px,py in [(math.floor(x),math.floor(y)),(math.floor(x)+1,math.floor(y)+1)]:tiles.add((px//256,py//256))
 def load(key):
  x,y=key;url=f'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';p=cache/f'terrarium-{z}-{x}-{y}.png'
  if not p.exists():
   with urllib.request.urlopen(url,timeout=35) as r:p.write_bytes(r.read())
  return key,Image.open(p).convert('RGB'),{'url':url,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
 with ThreadPoolExecutor(max_workers=4) as pool:loaded=list(pool.map(load,sorted(tiles)))
 imgs={key:im for key,im,_ in loaded}
 def height(x,y):
  r,g,b=imgs[x//256,y//256].getpixel((x%256,y%256));return r*256+g+b/256-32768
 heights=[]
 for x,y in positions:
  ix,iy=math.floor(x),math.floor(y);a,b=x-ix,y-iy
  heights.append(round((height(ix,iy)*(1-a)+height(ix+1,iy)*a)*(1-b)+(height(ix,iy+1)*(1-a)+height(ix+1,iy+1)*a)*b))
 data={**conf,'size':n,'heights':heights}
 (root/f'public/data/{conf["id"]}.json').write_text(json.dumps(data,separators=(',',':')),encoding='utf-8')
 manifest.append({'id':conf['id'],'gridSpacingMetres':span*1000/(n-1),'verticalScale':1,'sourceTiles':[m for _,_,m in loaded]})
 print(conf['name'],'saved',len(heights),'samples; range',min(heights),max(heights),flush=True)
(root/'docs/design/expedition-preview-sources.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
