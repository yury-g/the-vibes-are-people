"""Build the small, reproducible public creation-skill package (stdlib only)."""
from pathlib import Path
import hashlib, json, zipfile
from urllib.parse import quote
root=Path(__file__).resolve().parent.parent
skill=root/'dist/skills/vibes-algorithmic-art'
graph=json.loads((root/'dist/connections/data.json').read_text())
names=['Curl noise','Vector fields from math','L-systems','Moiré','Dithering as art','Voronoi/Delaunay operated on','fBm + ridged / turbulent']
people={p['id']:p for p in graph['people']}
methods=[]
for name in names:
 recipe=next(r for r in graph['recipes'] if r['name']==name)
 contributions=[{'person':people[r['person']]['name'],'role':r['role'],'claim':r.get('detail',''),'source':r['source'],'sourceLabel':r.get('sourceLabel',''),'review':r['review']} for r in graph['relationships'] if r['kind']=='contribution' and r['target']==recipe['id']]
 methods.append({'name':name,'catalog':'https://thevibesarepeople.com/notes/ingredients/techniques.html?recipe='+quote(name),'contributions':contributions})
snapshot={'catalogChecked':graph['checked'],'source':'https://thevibesarepeople.com/connections/data.json','note':'Selected catalog records, not an exhaustive method list. Preserve each review status and follow its source.','methods':methods}
(skill/'references/methods.json').write_text(json.dumps(snapshot,ensure_ascii=False,indent=2)+'\n')
files=['SKILL.md','agents/openai.yaml','references/visual-language.md','references/taxonomy.md','references/methods.json','assets/studio.html']
archive=skill/'vibes-algorithmic-art.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_STORED) as z:
 for file in files:
  info=zipfile.ZipInfo('vibes-algorithmic-art/'+file,date_time=(2026,9,28,0,0,0));info.compress_type=zipfile.ZIP_STORED;info.external_attr=0o644<<16
  z.writestr(info,(skill/file).read_bytes())
manifest={'version':'1.0.0','file':archive.name,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'bytes':archive.stat().st_size,'files':files}
(skill/'package.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Packaged creation skill:',len(files),'files,',manifest['bytes'],'bytes')
