from pathlib import Path
from html.parser import HTMLParser
import subprocess
r=Path(__file__).resolve().parents[1]; p=r/'dist/iterations/content-draft/index.html';s=p.read_text()
assert 'Open Source Hardware, Science, and Toy Design' in s
assert 'Content draft' in s and 'noindex' in s
for name in ['PulseSensor','Banana Design Lab','My Beating Heart','Noderunner','Joel Murphy','Carlos J. Gomez de Llarena','2023','2003'] :assert name in s,name
assert '>artist<' not in s and '>inventor<' not in s
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if 'id' in a:self.ids.append(a['id'])
  if t=='a':self.links.append(a.get('href',''))
x=Links();x.feed(s);
for bio in ['https://bananadesignlab.com/lab/','https://pulsesensor.com/pages/about-us']:assert bio in x.links,bio
assert len(x.ids)==len(set(x.ids));assert all(h and h!='#' for h in x.links)
for h in x.links:
 if h.startswith('#'):assert h[1:] in x.ids,h
for p in (r/'dist/iterations/content-draft').iterdir():
 if p.is_file():assert p.read_bytes()==subprocess.check_output(['/Users/mininarwhal/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/git','show','d80c9b3a3708e1bda738182e95203444b52814cc:dist/iterations/content-draft/'+p.name],cwd=r)
print('Content draft remains byte-identical to its saved V27.')
