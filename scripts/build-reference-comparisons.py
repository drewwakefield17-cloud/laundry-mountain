from pathlib import Path
from PIL import Image,ImageOps,ImageDraw,ImageFont
import argparse
root=Path(__file__).resolve().parents[1]
a=root/'docs/design/review/coordinated-implementation';ref=a.parent/'coordinated-proposal'
rows={
'welcome':('01-foundation-approved.png',(18,134,408,950)), 'home':('01-foundation-approved.png',(425,134,800,950)),
'mountains':('01-foundation-approved.png',(817,134,1192,950)),'badges':('01-foundation-approved.png',(1208,134,1603,950)),
'ben-nevis-overview':('02-trail-proposal.png',(18,132,410,947)), 'ben-nevis-climb':('02-trail-proposal.png',(425,132,801,947)),
'session':('02-trail-proposal.png',(818,132,1192,947)), 'profile':('02-trail-proposal.png',(1208,132,1601,947)),
'batch':('03-rewards-proposal.png',(18,132,404,947)), 'checkpoint':('03-rewards-proposal.png',(421,132,799,947)),
'badge-reveal':('03-rewards-proposal.png',(817,132,1195,947)), 'results':('03-rewards-proposal.png',(1210,132,1603,947)),
'history':('04-responsive-proposal.png',(20,127,428,969)), 'session-landscape':('04-responsive-proposal.png',(450,128,1567,520))}
args=argparse.ArgumentParser();args.add_argument('screens',nargs='*');selected=args.parse_args().screens or list(rows)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',21)
for name in selected:
    board,box=rows[name];w,h=(800,390) if 'landscape' in name else (390,856)
    canvas=Image.new('RGB',(w*2+36,h+65),'#e7eef5');d=ImageDraw.Draw(canvas)
    d.text((12,12),'Approved reference',font=font,fill='#10294c');d.text((w+24,12),'Actual app · fresh capture',font=font,fill='#10294c')
    for i,img in enumerate([Image.open(ref/board).crop(box),Image.open(a/(name+'.jpg'))]):
        img=ImageOps.contain(img.convert('RGB'),(w,h));canvas.paste(img,(12+i*(w+12)+(w-img.width)//2,49))
    canvas.save(a/(name+'-comparison.jpg'),quality=94)
print('Updated comparisons: '+', '.join(selected))
