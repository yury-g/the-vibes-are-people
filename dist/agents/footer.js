if(!document.querySelector('.vibes-contribute-footer')){
 const make=(tag,text,className)=>{const e=document.createElement(tag);if(text)e.textContent=text;if(className)e.className=className;return e};
 const link=(text,url,external=false)=>{const a=make('a',text);a.href=url;a.target=external?'_blank':'_top';if(external)a.rel='noopener noreferrer';return a};
 const f=make('footer',null,'vibes-contribute-footer');
 f.append(make('p','A living collection of people, experiments and shared tools. Help fill in a missing connection.'));
 const nav=make('nav');nav.setAttribute('aria-label','Explore and contribute');
 for(const [label,url]of [['Visual vocabulary','/vocabulary/'],['Send your AI','/agents/'],['Share an experiment','https://github.com/yury-g/the-vibes-are-people/issues/new?template=experiment.yml'],['Code & open collections','/connections/#code'],['Public roadmap','/agents/roadmap.html']])nav.append(link(label+' ↗',url));
 f.append(nav,make('h2','Make algorithmic art easier to discuss.'));
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
 vocabulary.append(credits,make('p','Use established method names and people’s credited or chosen names. Pair them with observable qualities: flow, cohesion, grain, branching, scale and density. Names help us find a history; controls help us make deliberate changes.'),link('Try the visual vocabulary & build a brief ↗','/vocabulary/#flow'),make('small','This is our suggested teaching workflow. The linked Anthropic skill runs in your own AI tool; this site provides vocabulary, exercises and contribution research.'));
 resources.append(card,vocabulary);f.append(resources,make('p','Interpretations depend on context. Specific credits do not make one person the inventor of an entire aesthetic. Explore the sources, compare variations, and develop your own work.','footer-note'));
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
 .vibes-contribute-footer h3{font-size:22px;line-height:1.25;margin:0 0 1rem}
 .vibes-contribute-footer .brief-label{font-size:13px;font-weight:700;margin:1rem 0 .4rem}
 .vibes-contribute-footer blockquote{margin:0;padding:.8rem 1rem;background:#f3f3ef;border-left:3px solid #111;font-size:16px}
 .vibes-contribute-footer small{display:block;font-size:13px;line-height:1.5;margin-top:1rem;color:#555}
 .vibes-contribute-footer .footer-note{font-size:14px;max-width:90ch}
 `;document.head.append(css);
}
