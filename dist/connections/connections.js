import {nodes,relations,overlaps,gaps} from './graph.js';
const data=fetch(new URL('data.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Unavailable');return r.json()}).catch(()=>null);
const el=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node};
const link=(text,url)=>{const a=el('a',text);a.href=url;if(/^https?:/.test(url)){a.target='_blank';a.rel='noopener noreferrer'}return a};
const nodeLink=node=>link(node.name,'/connections/?node='+encodeURIComponent(node.id)+'#people');
function rows(g,p){
 const list=el('div');list.className='connection-lines';
 for(const r of relations(g,p.id)){
  const target=nodes(g).find(t=>t.id===(r.target===p.id?r.person:r.target));
  const line=el('p');line.append(r.role+' · ',nodeLink(target),r.dates?' ('+r.dates+')':'');
  if(r.detail&&r.kind==='documented path')line.append('. '+r.detail);
  const source=link('source ↗',r.source);source.className='inline-source';source.setAttribute('aria-label',`${r.sourceLabel}: ${p.name}, ${r.role}, ${target.name}`);source.title=r.review==='checked'?`Checked ${r.checked}`:'Existing catalog record; not rechecked in this research pass';line.append(' · ',source);list.append(line);
 }
 if(!list.children.length)list.append(el('p','Connections still need documentation.'));
 return list;
}
export function attachConnections(container,name){
 container.querySelector(':scope > .people-connections')?.remove();
 const section=el('section');section.className='people-connections';section.setAttribute('aria-label','People, places and connections');container.append(section);
 data.then(g=>{
  if(!g){section.append(link('Explore connections ↗','/connections/'));return}
  const p=g.people.find(p=>p.name===name);if(!p)return;
  section.append(rows(g,p),link('Follow these connections ↗','/connections/?node='+encodeURIComponent(p.id)+'#people'));
 });
 if(!document.querySelector('link[data-connections-style]')){const css=el('link');css.rel='stylesheet';css.href='/connections/connections.css';css.dataset.connectionsStyle='true';document.head.append(css)}
}
if(document.querySelector('#connections-directory')){
 const g=await data,host=document.querySelector('#connections-directory');
 if(!g)host.textContent='The directory could not load. Please try again.';
 else{
  const search=document.querySelector('#connection-search'),params=new URL(location.href).searchParams;
  const selected=nodes(g).find(n=>n.id===params.get('node')),gap=gaps(g).find(x=>x.id===params.get('gap'));
  search.value=params.get('person')||'';
  const context=document.querySelector('#connection-context');
  if(selected){context.append(el('h2',selected.name),el('p','Documented links in this catalog. Shared places and tools show overlap; they do not establish collaboration.'),link('Show all people','/connections/#people'));}
  if(gap)context.append(el('h2',gap.label),el('p','A research queue based on what is recorded here, not a claim about anyone’s life or practice.'),link('Show all people','/connections/#people'));
  document.querySelector('#coverage').textContent=`${g.people.length} people · ${g.recipes.length} recipes · ${g.relationships.filter(r=>r.review==='checked').length} checked relationships · ${g.relationships.filter(r=>r.kind==='contribution').length} existing recipe credits · ${g.relationships.filter(r=>r.kind==='documented path').length} existing person-to-person paths.`;
  const pending=document.querySelector('#pending');g.people.filter(p=>p.placement==='To be assigned').forEach((p,i)=>{if(i)pending.append(', ');pending.append(nodeLink(p))});pending.append('. Their affiliations are documented; recipe placements still need evidence.');
  const overlapHost=document.querySelector('#overlap-links');
  overlaps(g).forEach(n=>{const item=el('span');item.append(nodeLink(n),` · ${n.people.length} people`);overlapHost.append(item)});
  const gapHost=document.querySelector('#gap-links');
  gaps(g).forEach(item=>{const p=el('p');p.append(link(`${item.people.length} ${item.label.toLowerCase()} →`,'/connections/?gap='+item.id+'#people'));gapHost.append(p)});
  function render(){host.replaceChildren();const query=search.value.trim().toLowerCase();
   const people=g.people.filter(p=>{
    if(gap&&!gap.people.includes(p.id))return false;
    if(selected&&p.id!==selected.id&&!relations(g,p.id).some(r=>r.person===selected.id||r.target===selected.id))return false;
    const text=[p.name,...relations(g,p.id).map(r=>[r.role,nodes(g).find(t=>t.id===(r.target===p.id?r.person:r.target)).name].join(' '))].join(' ').toLowerCase();
    return !query||text.includes(query);
   });document.querySelector('#connection-count').textContent=`${people.length} people shown`;
   for(const p of people){const card=el('article');card.className='connection-card';card.id=p.id;const heading=el('h3');heading.append(nodeLink(p));card.append(heading,el('small',p.placement),rows(g,p));if(p.study)card.append(link('Open animated study ↗','/notes/ingredients/people.html?person='+p.study));host.append(card)}
   if(!people.length)host.append(el('p','No matching records. Try a person, institution, tool or recipe.'));
  }search.addEventListener('input',render);render();
 }
}
