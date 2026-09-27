"""Source fidelity, editorial completeness, and bounded school checks."""
from pathlib import Path
from html.parser import HTMLParser
import re

ROOT = Path(__file__).resolve().parents[1]
ORIGINAL = ROOT / 'dist/history/archive/v6/iterations/ultraviolet'

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(); self.stack=[]; self.main_text=[]; self.main_links=[]; self.animated=[]; self.canvases=0
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag=='canvas': self.canvases+=1
        if tag=='a' and any(t=='main' for t,a in self.stack): self.main_links.append(attrs.get('href'))
        if tag not in {'img','meta','link','br','hr','input'}: self.stack.append((tag,attrs))
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0]==tag: self.stack=self.stack[:i]; break
    def handle_data(self,text):
        if any(t=='main' for t,a in self.stack): self.main_text.append(text)
        if any(a.get('class')=='page' for t,a in self.stack) and not any('data-refuge' in a for t,a in self.stack): self.animated.append(text)

draft=Page((ROOT/'dist/iterations/content-draft/index.html').read_text())
for route in ['ultraviolet-minimal','ultraviolet-full-copy']:
    folder=ROOT/'dist/iterations'/route
    for name in ['koi.js','school.js','skeleton.js','tank.css']:
        assert (folder/name).read_bytes()==(ORIGINAL/name).read_bytes(), (route,name)
    for name in ['studies.css','motion.js']:
        assert (folder/name).read_bytes()==(ORIGINAL.parent/name).read_bytes(), (route,name)
    assert (folder/'app.js').read_text()==(ORIGINAL/'app.js').read_text().replace("from '../motion.js'","from './motion.js'")
    html=(folder/'index.html').read_text(); page=Page(html)
    assert page.canvases==1 and 'id="brain-panel"' not in html and 'live-views.js' not in html
    school=''.join(page.animated)
    glyph_count=len(re.sub(r'\s','',school))
    assert glyph_count==50, (route,glyph_count)
    assert 'Yury Gitman.' in school and 'Open Source Hardware, Science, and Toy Design' in school
    assert 'Teaching at Parsons since 2003.' in ''.join(page.main_text)
    for relative in re.findall(r'(?:src|href)="([^"#]+)"',html):
        if ':' not in relative and not relative.startswith('/'):
            assert (folder/relative.split('#')[0]).exists(), relative
    if route.endswith('full-copy'):
        assert page.main_text==draft.main_text, 'Research copy changed or missing'
        assert page.main_links==draft.main_links, 'Source links changed or missing'
    else:
        assert len(page.main_links)==3
        assert 'Joel Murphy' in ''.join(page.main_text)
        assert 'id="press"' not in html and 'id="archive"' not in html
    print(f'{route}: original dependencies verified; {glyph_count} introduction characters; copy and links pass')
