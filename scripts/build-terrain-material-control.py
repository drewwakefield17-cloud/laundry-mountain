"""Generate a north-up numeric terrain/land-cover guide for an illustrated material.
This is an art input, not a scene background or new geography source.
"""
from pathlib import Path
import json, math
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
data = json.loads((root/'public/data/ben-nevis.json').read_text())
n = data['grid']['size']; step = data['grid']['stepKm']; start = data['grid']['minKm']
heights = data['heights']; size = 1024
mask = Image.new('RGB',(size,size)); draw = ImageDraw.Draw(mask)
def position(p):
    return ((p[0]-start)/13*(size-1),(start+13-p[1])/13*(size-1))
for feature in data['features']:
    if feature['kind'] in ['wood','water']:
        draw.polygon([position(p) for p in feature['points']], fill=(0,255,0) if feature['kind']=='wood' else (0,0,255))
def height(i,j):
    return heights[max(0,min(n-1,j))*n+max(0,min(n-1,i))]/1000
guide=Image.new('RGB',(n,n)); pixels=guide.load()
for j in range(n):
    for i in range(n):
        elevation=height(i,j)
        nx=(height(i+1,j)-height(i-1,j))/(step*2)
        nz=(height(i,j+1)-height(i,j-1))/(step*2)
        light=max(0,min(1,(.6+nx*.8+nz*.4)/math.sqrt(1+nx*nx+nz*nz)))
        terrain=max(0,min(1,(elevation-.45)*3))
        base=[(23,74,58),(160,184,101)]
        rock=[(24,64,84),(226,210,157)]
        colour=[round((base[0][k]*(1-light)+base[1][k]*light)*(1-terrain)+(rock[0][k]*(1-light)+rock[1][k]*light)*terrain) for k in range(3)]
        biome=mask.getpixel((round(i/(n-1)*(size-1)),round((1-j/(n-1))*(size-1))))
        if biome[1]>100: colour=[22+round(light*40),61+round(light*50),52+round(light*24)]
        if biome[2]>100: colour=[37,137,164]
        pixels[i,n-1-j]=tuple(colour)
out=root/'docs/design/source-art/ben-nevis-material-control.png'
guide.resize((size,size),Image.Resampling.BICUBIC).save(out)
print(out)
