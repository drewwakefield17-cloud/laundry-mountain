"""Compose reference/current evidence, without altering application artwork."""
from pathlib import Path
import shutil, sys, tempfile
from PIL import Image, ImageOps, ImageDraw, ImageFont

root=Path(__file__).resolve().parent.parent
out=root/'docs/design/review/illustrated-pass'; out.mkdir(parents=True,exist_ok=True)
temp=Path(tempfile.gettempdir()); reference=Image.open(sys.argv[1]).convert('RGB')
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',12)
screens=[
 ('Welcome','painted-welcome',(113,197,310,591)),
 ('Home','painted-home',(369,197,565,592)),
 ('Setup','painted-setup',(629,197,822,592)),
 ('Camera off','painted-camera',(885,197,1076,592)),
 ('Live — synthetic','game-live-portrait-synthetic',(1144,197,1334,591)),
 ('Results — synthetic','game-results-synthetic',(114,695,307,1013)),
 ('Ben Nevis','painted-route',(368,693,566,1020)),
 ('Mountains','painted-mountains',(628,693,820,1019)),
 ('Badges','painted-badges',(878,694,1074,1014)),
 ('Demo community','painted-community',(1141,695,1333,1015))
]
board=Image.new('RGB',(1280,1090),'#eff3e9'); bd=ImageDraw.Draw(board)
comparison=Image.new('RGB',(2100,1000),'#eff3e9'); cd=ImageDraw.Draw(comparison)
for i,(label,filename,box) in enumerate(screens):
    source=temp/f'laundry-mountain-{filename}.png'; shutil.copyfile(source,out/f'{filename}.png')
    actual=Image.open(source).convert('RGB')
    x=16+(i%5)*252; y=16+(i//5)*535
    bd.text((x,y),label,font=font,fill='#16374a')
    board.paste(ImageOps.contain(actual,(236,490)),(x,y+30))
    x=(i%5)*420; y=(i//5)*500
    cd.text((x+8,y+8),label+' · reference / current',font=small,fill='#16374a')
    comparison.paste(ImageOps.contain(reference.crop(box),(196,450)),(x+8,y+31))
    comparison.paste(ImageOps.contain(actual,(196,450)),(x+218,y+31))
board.save(out/'screens.jpg',quality=94)
comparison.save(out/'reference-current.jpg',quality=94)
# Larger comparison for the previously rejected scenery, inner dial and badges.
detail=Image.new('RGB',(1600,1000),'#eff3e9'); dd=ImageDraw.Draw(detail)
for column,index in enumerate([1,6,4,8]):
    label,filename,box=screens[index]; x=column*400
    dd.text((x+12,8),label+' — reference',font=font,fill='#16374a')
    detail.paste(ImageOps.contain(reference.crop(box),(225,455)),(x+87,35))
    dd.text((x+12,497),label+' — current',font=font,fill='#16374a')
    detail.paste(ImageOps.contain(Image.open(out/f'{filename}.png').convert('RGB'),(225,455)),(x+87,530))
detail.save(out/'focused-comparison.jpg',quality=95)
for name in ['game-live-synthetic','painted-route-landscape']:
    shutil.copyfile(temp/f'laundry-mountain-{name}.png',out/f'{name}.png')
print(out)
