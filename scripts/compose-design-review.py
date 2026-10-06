"""Compose QA evidence: python scripts/compose-design-review.py REFERENCE_BOARD.png"""
import sys
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw,ImageFont
root=Path('docs/design/review'); font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',18); small=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',13)
rows=[('Welcome','welcome.jpg'),('Home','home.jpg'),('Setup','setup.jpg'),('Camera off','camera.jpg'),('Live (synthetic)','live-portrait-synthetic.png'),('Results (synthetic)','results-synthetic.png'),('Ben Nevis','mountain.jpg'),('Mountains','mountains.jpg'),('Badges','badges.jpg'),('Demo community','community.jpg')]
def board(entries,columns,width,out):
 height=round(width*786/390);result=Image.new('RGB',((width+16)*columns+16,(height+46)*((len(entries)+columns-1)//columns)+16),'#eff3e9');d=ImageDraw.Draw(result)
 for i,(label,filename) in enumerate(entries):
  x=16+(i%columns)*(width+16);y=16+(i//columns)*(height+46)
  d.text((x,y),label,font=font,fill='#16374a');im=Image.open(root/filename).convert('RGB');im=ImageOps.contain(im,(width,height));result.paste(im,(x,y+29))
 result.save(root/out,quality=94)
board(rows,5,240,'current-screens.jpg')
board([rows[i] for i in [1,6,8,4]],4,270,'focused-pass.jpg')
ref=Image.open(sys.argv[1]).convert('RGB')
pairs=[('home',(369,197,565,592),'home.jpg'),('setup',(629,197,822,592),'setup.jpg'),('mountain',(368,693,566,1020),'mountain.jpg'),('badges',(878,694,1074,1014),'badges.jpg'),('community',(1141,695,1333,1015),'community.jpg'),('results',(114,695,307,1013),'results-synthetic.png')]
combined=Image.new('RGB',(1266,980),'#eff3e9')
for n,(label,box,current) in enumerate(pairs):
 pair=Image.new('RGB',(422,490),'#eff3e9');d=ImageDraw.Draw(pair);d.text((8,8),f'Reference / Current: {label}',font=small,fill='#16374a')
 for x,im in [(8,ref.crop(box)),(218,Image.open(root/current).convert('RGB'))]:
  im=ImageOps.contain(im,(196,455));pair.paste(im,(x,30))
 pair.save(root/f'comparison-{label}.png');combined.paste(pair,((n%3)*422,(n//3)*490))
combined.save(root/'reference-vs-current.jpg',quality=94)
