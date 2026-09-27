from pathlib import Path
import json,subprocess,re
root=Path(__file__).resolve().parents[1];G='/Users/mininarwhal/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/git'
data=json.loads((root/'dist/history/manifest.json').read_text());provenance=json.loads((root/'notes/history-provenance.json').read_text());count=0
assert len(provenance['versions'])==20 and len(data['designs'])==47
assert len({d['id'] for d in data['designs']})==len(data['designs']), 'Each history route must have a unique design ID'
for v in provenance['versions']:
 prefix=root/'dist/history/archive'/('v'+str(v['version']))
 for p in prefix.rglob('*'):
  if p.is_file():
   rel=p.relative_to(prefix);original=subprocess.check_output([G,'show',v['commit']+':dist/'+str(rel)],cwd=root)
   assert p.read_bytes()==original,p
   assert p.suffix in ['.html','.css','.js','.jpg','.png'],p
   count+=1
 for p in prefix.rglob('*.js'):
  for rel in re.findall(r'(?:from\s*|import\s*)[\'\"](\.[^\'\"]+)[\'\"]',p.read_text()): assert (p.parent/rel).is_file(),(p,rel)
for d in data['designs']: assert (root/'dist'/d['source'].lstrip('/')/'index.html').exists()
print(f'Passed: {count} archived assets exactly match twenty commits; forty-seven targets exist and local module imports resolve.')
# The visible contact sheet must include each manifest entry exactly once.
from html.parser import HTMLParser
class ContactSheet(HTMLParser):
 def __init__(self):super().__init__();self.designs=[];self.previews=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a' and a.get('href','').startswith('view.html?design='):self.designs.append(a['href'].split('=',1)[1])
  if tag=='div' and 'data-source' in a:self.previews.append(a['data-source'].split('?',1)[0])
sheet=ContactSheet();sheet.feed((root/'dist/history/index.html').read_text())
assert sheet.designs==[d['id'] for d in data['designs']],'Visible history must match manifest order without missing or duplicate designs'
assert sheet.previews==[d['source'] for d in data['designs']],'Miniatures must show their matching source'
gallery=(root/'dist/gallery/index.html').read_text()
assert gallery.count('data-url="/iterations/tank/"')==1 and gallery.count('data-url="/iterations/brain/"')==1
assert gallery.index('data-url="/iterations/tank/"')<gallery.index('data-url="/iterations/brain/"')<gallery.index('data-url="/iterations/soft-rubber/"')
print('Visible history and latest-first gallery match current records without duplicates.')

assert gallery.count('data-url="/iterations/ultraviolet-best/"')==1
assert gallery.index('data-url="/iterations/ultraviolet-best/"')<gallery.index('data-url="/iterations/tank/"')

assert 'versions' not in data and all('commit' not in d for d in data['designs']), 'Public manifest excludes source provenance'

assert gallery.count('data-url="/iterations/ultraviolet-contour/"')==1
assert gallery.index('data-url="/iterations/ultraviolet-best/"')<gallery.index('data-url="/iterations/ultraviolet-contour/"')

assert gallery.count('data-url="/iterations/content-draft/"')==1

for route in ["ultraviolet-minimal","ultraviolet-full-copy"]:assert gallery.count(f'data-url="/iterations/{route}/"')==1

assert gallery.count('data-url="/iterations/ultraviolet-flow/"')==1
assert gallery.index('data-url="/iterations/ultraviolet-flow/"')<gallery.index('data-url="/iterations/ultraviolet-minimal/"')

for style in ["soft-rubber","scribble","marker","riso","sketchbook"]:
 assert gallery.count(f'data-url="/iterations/{style}-flow/"')==1
 assert gallery.index(f'data-url="/iterations/{style}-flow/"')<gallery.index(f'data-url="/iterations/{style}/"')

assert gallery.count('data-url="/iterations/shared-pond/"')==1
assert gallery.index('data-url="/iterations/shared-pond/"')<gallery.index('data-url="/iterations/soft-rubber-flow/"')

assert gallery.count('data-url="/iterations/cleaner-shrimp/"')==1
assert gallery.index('data-url="/iterations/cleaner-shrimp/"')<gallery.index('data-url="/iterations/shared-pond/"')

assert gallery.count('data-url="/iterations/centered-reef/"')==1
