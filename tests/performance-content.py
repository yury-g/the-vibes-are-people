from pathlib import Path
from html.parser import HTMLParser
class Check(HTMLParser):
 def __init__(self):super().__init__();self.canvases=0;self.text=[];self.scripts=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='canvas':self.canvases+=1
  if tag=='script':self.scripts.append(a.get('src',''))
 def handle_data(self,s):self.text.append(s)
p=Path('dist/iterations/ultraviolet-flow');c=Check();c.feed((p/'index.html').read_text())
assert c.canvases==1
text=' '.join(c.text)
for phrase in ['Yury Gitman.','Open Source Hardware, Science, and Toy Design','Joel Murphy','Teaching at Parsons since 2003.']:assert phrase in text
assert 'Banana Design Lab' in text and 'My Beating Heart' in text
assert 'gitmany@newschool.edu' in (p/'index.html').read_text()
for f in ['body.js','turns.js','motion.js','skin.js','appetite.js','koi.js']:
 assert (p/f).read_bytes()==(Path('dist/iterations/ultraviolet-best')/f).read_bytes(),f
app=(p/'app.js').read_text();assert 'createLiveViews' not in app and 'applyWater' not in app
print('One canvas, curated approved content, modern behavior byte-identical, no live cameras or page ripple')
