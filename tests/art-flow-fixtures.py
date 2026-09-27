from PIL import Image
import json,math
from pathlib import Path
root=Path(__file__).resolve().parents[1]
out={}
for p in (root/'dist/iterations/art-koi').glob('*.png'):
 im=Image.open(p);a=im.getchannel('A').point(lambda p: p if p>32 else 0);left,top,right,bottom=a.getbbox();pix=a.load();mouth=[y for y in range(top,bottom) if pix[right-1,y]];width=right-left;sw=width/48;bands=[]
 for i in range(48):
  sx=left+i*sw;ys=[y for x in range(max(0,math.floor(sx)-1),min(im.width,math.ceil(sx+sw)+2)) for y in range(top,bottom) if pix[x,y]]
  bands.append(dict(sx=sx,sw=sw,lo=min(ys)-1,hi=max(ys)+1,t=1-(i+.5)/48))
 out[p.stem]=dict(bands=bands,cy=(min(mouth)+max(mouth))/2,width=width,height=im.height)
(root/'tests/art-flow-sprites.json').write_text(json.dumps(out))
