if(!document.querySelector('.vibes-contribute-footer')){
 const make=(tag,text,className)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(className)e.className=className;return e};
 const link=(text,url,external=false)=>{const a=make('a',text);a.href=url;a.target=external?'_blank':'_top';if(external)a.rel='noopener noreferrer';return a};
 const f=make('footer',null,'vibes-contribute-footer');
 f.append(make('p','A living collection of people, experiments and shared tools. Help fill in a missing connection.'));
 const nav=make('nav');nav.setAttribute('aria-label','Explore and contribute');
 for(const [label,url]of [['Make art with your AI','/skills/vibes-algorithmic-art/'],['Visual taxonomy','/taxonomy/'],['Visual vocabulary','/vocabulary/'],['Send your AI','/agents/'],['Share an experiment','https://github.com/yury-g/the-vibes-are-people/issues/new?template=experiment.yml'],['Code & open collections','/connections/#code'],['Public roadmap','/agents/roadmap.html']])nav.append(link(label+' ↗',url));
 f.append(nav,make('h2','Make algorithmic art easier to discuss.'));
 const start=make('p',null,'skill-start');start.append(link('Use Vibes Algorithmic Art →','/skills/vibes-algorithmic-art/'),document.createTextNode(' Our creation skill connects a visual brief to working controls, repeatable exports and sourced people. Try the studio or give the skill to your AI.'));f.append(start);
 const resources=make('div',null,'skill-resources');
 const card=make('article'),source=link('','https://github.com/anthropics/skills/blob/main/skills/algorithmic-art/SKILL.md',true);
 const img=make('img');img.src='/agents/resources/anthropic-algorithmic-art.png';img.alt='Anthropic’s published algorithmic-art skill on GitHub, September 28, 2026';img.width=1050;img.height=650;img.loading='lazy';
 source.append(img,make('strong','Anthropic · Algorithmic Art ↗'));card.append(source,make('p','A published skill in Anthropic’s example-skills plugin. It guides an AI to make original p5.js art with an interactive HTML viewer.'));
 const capabilities=make('ul');
 for(const text of ['Build with flow fields, particles, noise and generative rules.','Repeat a variation with the same seed; explore other seeds.','Expose controls such as particle count, noise scale and speed.'])capabilities.append(make('li',text));
 card.append(capabilities,link('Official skill & setup ↗','https://github.com/anthropics/skills#try-in-claude',true));
 const vocabulary=make('article',null,'skill-vocabulary');
 vocabulary.append(make('h3','Give yourself and your agent a shared vocabulary.'),make('p','Name what you see, choose a method, and say what should change. A shared brief gives artists, students, teachers and their agents specific decisions to test together.'));
 vocabulary.append(make('p','Starting impression','brief-label'),make('blockquote','“Make it feel more organic.”'));
 vocabulary.append(make('p','A brief you can act on','brief-label'),make('blockquote','“Build a p5.js flow field driven by Perlin noise. Use sparse, fine trails with broad, gradual changes in direction. Keep seed 42 fixed while we compare density. Expose density, noise scale and speed as separate controls.”'));
 const credits=make('p');credits.append(document.createTextNode('Keep names attached to methods: '),link('Perlin noise · Ken Perlin','/connections/?person=Ken%20Perlin#people'),document.createTextNode('; '),link('Boids · Craig Reynolds','/connections/?person=Craig%20Reynolds#people'),document.createTextNode('; '),link('L-systems · Aristid Lindenmayer','/connections/?person=Aristid%20Lindenmayer#people'),document.createTextNode('. Follow each contribution and its sources.'));
 vocabulary.append(credits,make('p','Use established method names and people’s credited or chosen names. Pair them with observable qualities: flow, cohesion, grain, branching, scale and density. Names help us find a history; controls help us make deliberate changes.'),link('Try the visual vocabulary & build a brief ↗','/vocabulary/#flow'),make('small','Use our creation skill to follow this workflow in your own AI tool. The original Anthropic skill is linked for context and comparison.'));
 resources.append(card,vocabulary);f.append(resources,make('p','Interpretations depend on context. Specific credits do not make one person the inventor of an entire aesthetic. Explore the sources, compare variations, and develop your own work.','footer-note'));
 const audit=make('section',null,'skill-audit');audit.id='algorithmic-skill-audit';audit.setAttribute('aria-labelledby','skill-audit-title');
 const auditTitle=make('h3','A closer look at the published skill');auditTitle.id='skill-audit-title';
 audit.append(auditTitle,link('Read the audit & counting method ↗','/research/project/files/ANTHROPIC-SKILL-AUDIT.md'));f.append(audit);
 fetch('/agents/skill-audit.json').then(r=>{if(!r.ok)throw new Error('Audit unavailable');return r.json()}).then(data=>{
  const summary=make('p',`${data.counts.explicitHumanNameCredits} explicit human-name credits · ${data.counts.surnamesInMethodNames} surnames in technique names · ${data.counts.selectedMethodFamilies} selected method families`,'audit-counts');
  const scope=make('p','Counts cover SKILL.md: Perlin and Voronoi appear as method names, without explicit person credits. The 12 families are overlapping editorial groupings, not an exhaustive algorithm count.','footer-note');
  audit.append(summary,scope);
  const table=make('table'),caption=make('caption','Instruction audit · September 28, 2026 · source revision '+data.revision.slice(0,7));table.append(caption);
  const head=make('thead'),hr=make('tr');for(const title of ['Area','What it gets right','Opportunity to improve']){const th=make('th',title);th.scope='col';hr.append(th)}head.append(hr);table.append(head);
  const body=make('tbody');for(const row of data.matrix){const tr=make('tr'),topic=make('th');topic.scope='row';topic.append(link(row.topic+' ↗',row.source,true));const strength=make('td',row.strength),opportunity=make('td',row.opportunity);strength.dataset.label='What it gets right';opportunity.dataset.label='Opportunity to improve';if(row.comparisonSource)opportunity.append(document.createTextNode(' '),link('Viewer evidence ↗',row.comparisonSource,true));tr.append(topic,strength,opportunity);body.append(tr)}table.append(body);audit.append(table);
  audit.append(make('p','This reviews the instructions and bundled templates, not the quality of generated art. A missing credit is a research opportunity; it does not establish copying or model training history.','footer-note'));
 }).catch(()=>{});
 document.body.append(f);
 const css=make('style');css.textContent=`
 .vibes-contribute-footer{display:block;box-sizing:border-box;padding:1.5rem max(1rem,4vw);border-top:1px solid #888;font:16px/1.6 system-ui,sans-serif;background:#fff;color:#151515;clear:both}
 .vibes-contribute-footer a{color:inherit;text-underline-offset:3px;overflow-wrap:anywhere}
 .vibes-contribute-footer nav a{display:inline-block;margin-right:1.2rem}
 .vibes-contribute-footer h2{font-size:clamp(24px,3vw,36px);line-height:1.2;margin:2rem 0 1rem}
 .vibes-contribute-footer .skill-resources{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:1rem;max-width:1200px}
 .vibes-contribute-footer .skill-resources article{border:1px solid #bbb;padding:1rem;min-width:0}
 .vibes-contribute-footer .skill-resources img{display:block;width:100%;height:auto;margin-bottom:.75rem}
 .vibes-contribute-footer .skill-resources strong{font-size:20px}
 .vibes-contribute-footer .skill-start{max-width:1166px;border:2px solid #111;padding:1rem}.vibes-contribute-footer .skill-start a{font-weight:700;margin-right:.5rem}
 .vibes-contribute-footer h3{font-size:22px;line-height:1.25;margin:0 0 1rem}
 .vibes-contribute-footer .brief-label{font-size:13px;font-weight:700;margin:1rem 0 .4rem}
 .vibes-contribute-footer blockquote{margin:0;padding:.8rem 1rem;background:#f3f3ef;border-left:3px solid #111;font-size:16px}
 .vibes-contribute-footer small{display:block;font-size:13px;line-height:1.5;margin-top:1rem;color:#555}
 .vibes-contribute-footer .footer-note{font-size:14px;max-width:90ch}
 .vibes-contribute-footer .skill-audit{max-width:1200px;margin-top:2rem;border-top:2px solid #111;padding-top:1.5rem}
 .vibes-contribute-footer .audit-counts{font-weight:700}
 .vibes-contribute-footer .skill-audit table{width:100%;border-collapse:collapse;font-size:14px;line-height:1.5;text-align:left;table-layout:fixed}
 .vibes-contribute-footer .skill-audit caption{text-align:left;font-size:12px;margin:.6rem 0;color:#555}
 .vibes-contribute-footer .skill-audit th,.vibes-contribute-footer .skill-audit td{padding:.75rem;border-bottom:1px solid #bbb;vertical-align:top;overflow-wrap:anywhere}
 .vibes-contribute-footer .skill-audit th:first-child{width:22%}
 .vibes-contribute-footer .skill-audit thead{background:#f3f3ef}
 @media(max-width:600px){.vibes-contribute-footer .skill-audit table,.vibes-contribute-footer .skill-audit tbody,.vibes-contribute-footer .skill-audit tr,.vibes-contribute-footer .skill-audit td,.vibes-contribute-footer .skill-audit th{display:block;width:auto!important}.vibes-contribute-footer .skill-audit thead{display:none}.vibes-contribute-footer .skill-audit tr{border-bottom:1px solid #888;padding:.6rem 0}.vibes-contribute-footer .skill-audit td,.vibes-contribute-footer .skill-audit th{border:0;padding:.3rem 0}.vibes-contribute-footer .skill-audit td::before{content:attr(data-label) ': ';font-weight:700}}
 `;document.head.append(css);
}
