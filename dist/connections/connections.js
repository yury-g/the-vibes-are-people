import {attachCodeProjects} from './code-projects.js';
import {nodes,relations,overlaps,gaps,indexGraph,origin} from './graph.js';
import {ledgerRequest,mergeLedger} from '/agents/overlay.js';
import {confidenceMeter} from './confidence.js';
export const connectionData=fetch(new URL('data.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Unavailable');return r.json()}).then(async g=>mergeLedger(g,(await ledgerRequest).data)).catch(()=>null);
const el=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node};
const link=(text,url)=>{const a=el('a',text);a.href=url;if(/^https?:/.test(url)){a.target='_blank';a.rel='noopener noreferrer'}return a};
const nodeLink=node=>link(node.name,'/connections/?node='+encodeURIComponent(node.id)+'#people');
function rows(g,p,{languageOnly=false,includeInferred=true,excludeRecipe=null,compact=false,entityOnly=false}={}){
 const list=el('div');list.className='connection-lines';
 let visible=(indexGraph(g).byPerson.get(p.id)||[]).filter(r=>r.target!==excludeRecipe&&(!entityOnly||!!r.subject)&&(!languageOnly||r.kind==='language/tool')&&(includeInferred||!['inferred','tentative'].includes(r.review)));
 if(compact)visible=[...visible.filter(r=>r.target==='entity-eyebeam').slice(0,2),...visible.filter(r=>r.lineage&&r.target==='entity-processing-foundation').slice(0,1),...visible.filter(r=>r.kind==='language/tool').slice(0,2)];
 const ordinary=visible.filter(r=>r.kind!=='language/tool'),languages=visible.filter(r=>r.kind==='language/tool');
 for(const r of [...ordinary,...languages]){
  if(r===languages[0]){const heading=el('h4','Languages & tools');list.append(heading)}
  const target=indexGraph(g).byId.get(r.target===p.id?origin(r):r.target);
  const line=el('p');line.className=r.kind==='language/tool'?'language-relationship':'';
  const role=r.target===p.id&&r.inverseRole?r.inverseRole:r.role;
  line.append(role+' · ',nodeLink(target),r.dates?' ('+r.dates+')':'');
  if(r.agentReview){line.append(' · ',link('AI reviewed · evidence 3/3','/agents/'));line.append('. '+r.detail)}
  if(r.kind==='contribution'&&!target.agentAdded)line.append(' · ',link('View recipe ↗','/notes/ingredients/techniques.html?recipe='+encodeURIComponent(target.name)));
  if(r.review==='imported'){const status=el('small','Catalog credit · source recheck pending');status.className='evidence-status';line.append(status)}
  if(r.detail&&r.kind!=='language/tool'&&!r.agentReview)line.append('. '+r.detail);
  if(r.kind==='language/tool'){
   line.append(' ',confidenceMeter(r));
   const scope=el('span',r.context);scope.className='language-context';line.append(scope);
   if(r.confidence<3){const reason=el('span','Why this is inferred: '+r.rationale);reason.className='inference-reason';line.append(reason)}
   r.evidence.forEach((e,i)=>{if(i)line.append(' · ');const a=link(e.label+' ↗',e.url);a.className='inline-source';line.append(a)});
  }else{
   const source=link('source ↗',r.source);source.className='inline-source';source.setAttribute('aria-label',`${r.sourceLabel}: ${p.name}, ${role}, ${target.name}`);source.title=r.review==='checked'?`Checked ${r.checked}`:'Existing catalog record; not rechecked in this research pass';line.append(' · ',source);
  }
  list.append(line);
 }
 if(!list.children.length)list.append(el('p',languageOnly?'No language or tool evidence recorded at this confidence level.':'No additional connections recorded.'));
 if(!entityOnly)attachCodeProjects(list,p.name,{compact});
 return list;
}
export function attachConnections(container,name,{recipe=null,compact=false}={}){
 container.querySelector(':scope > .people-connections')?.remove();
 const section=el('section');section.className='people-connections';section.setAttribute('aria-label','People, places and connections');container.append(section);
 connectionData.then(g=>{
  if(!g){section.append(link('Explore connections ↗','/connections/'));return}
  const p=g.people.find(p=>p.name===name);if(!p)return;
  section.append(rows(g,p,{compact,excludeRecipe:g.recipes.find(r=>r.name===recipe)?.id}),link('Follow these connections ↗','/connections/?node='+encodeURIComponent(p.id)+'#people'));
  if(p.study&&!compact){const note=el('p','This site’s animated study uses JavaScript. Language links above describe the cited work or practice, not our animation.');note.className='study-language-note';section.append(note)}
 });
 if(!document.querySelector('link[data-connections-style]')){const css=el('link');css.rel='stylesheet';css.href='/connections/connections.css';css.dataset.connectionsStyle='true';document.head.append(css)}
}
if(document.querySelector('#connections-directory')){
 const g=await connectionData,host=document.querySelector('#connections-directory');
 if(!g)host.textContent='The directory could not load. Please try again.';
 else{
  const portraitMap=await fetch('/notes/ingredients/portrait-map.json?v=nav-20260928c').then(r=>r.ok?r.json():{}).catch(()=>({}));
 const geography=await fetch('/connections/institutions.json').then(r=>r.ok?r.json():[]).catch(()=>[]);
 const search=document.querySelector('#connection-search'),params=new URL(location.href).searchParams;
  const includeGuesses=document.querySelector('#include-inferred');
  const languageOnly=params.get('layer')==='languages';
  const selected=nodes(g).find(n=>n.id===params.get('node')),gap=gaps(g).find(x=>x.id===params.get('gap'));
  search.value=params.get('person')||'';
  const context=document.querySelector('#connection-context');
  if(selected){context.append(el('h2',selected.name),el('p','Documented links in this catalog. Shared places and tools show overlap; they do not establish collaboration.'),link('Show all people','/connections/#people'));}
  if(selected&&!g.people.some(p=>p.id===selected.id)){
   if(selected.type)context.append(el('p',selected.type+(selected.note?' · '+selected.note:'')));
   if(relations(g,selected.id).some(r=>r.subject)){context.append(rows(g,selected,{entityOnly:true}));}
  }
  if(selected?.category){context.append(el('p',selected.category+(!selected.type&&selected.note?' · '+selected.note:'')));}
  if(languageOnly)context.append(el('h2','People connected to languages & tools'),link('Show all relationships','/connections/#people'));
  if(gap)context.append(el('h2',gap.label),el('p','A research queue based on what is recorded here, not a claim about anyone’s life or practice.'),link('Show all people','/connections/#people'));
  document.querySelector('#coverage').textContent=`${g.people.length} people · ${g.recipes.length} recipes · ${g.relationships.filter(r=>r.review==='checked').length} checked relationships · ${g.relationships.filter(r=>r.kind==='contribution').length} recipe credits · ${g.relationships.filter(r=>r.kind==='documented path').length} existing person-to-person paths.`;
  const pending=document.querySelector('#pending');g.people.filter(p=>p.placement==='To be assigned').forEach((p,i)=>{if(i)pending.append(', ');pending.append(nodeLink(p))});pending.append('. Their affiliations are documented; recipe placements still need evidence.');
  const languageHost=document.querySelector('#language-links');
  const techs=g.entities.filter(t=>t.category);
  const languageRecords=g.relationships.filter(r=>r.kind==='language/tool');
  document.querySelector('#language-coverage').textContent=`${new Set(languageRecords.map(r=>r.person)).size} people · ${languageRecords.filter(r=>r.confidence===3).length} documented links · ${languageRecords.filter(r=>r.confidence<3).length} inferred links. A starting survey, not a complete inventory.`;
  for(const category of [...new Set(techs.map(t=>t.category))]){
   const group=el('div');group.className='technology-group';group.append(el('h3',category));
   for(const t of techs.filter(t=>t.category===category)){
    const related=languageRecords.filter(r=>r.target===t.id),direct=new Set(related.filter(r=>r.confidence===3).map(r=>r.person)).size,guesses=new Set(related.filter(r=>r.confidence<3).map(r=>r.person)).size;
    const item=el('p');item.append(nodeLink(t),` · ${direct} documented${guesses?` + ${guesses} inferred`:''}`);if(!related.length)item.append(' · research gap');group.append(item);
   }languageHost.append(group);
  }
  const institutionHost=document.querySelector('#institution-links');
  if(institutionHost){const inst=g.entities.filter(t=>!t.category&&g.relationships.some(r=>r.target===t.id&&['education','teaching','research','residency','service','funding','exhibition'].includes(r.kind)));for(const region of ['United States','Canada','Europe','Other networks']){const group=inst.filter(t=>(geography.find(x=>x.name===t.name)?.region||'Other networks')===region);if(!group.length)continue;institutionHost.append(el('h3',region));for(const t of group){const rs=g.relationships.filter(r=>r.target===t.id&&r.person&&r.review==='checked'),geo=geography.find(x=>x.name===t.name),line=el('p');line.append(nodeLink(t),` · ${new Set(rs.map(r=>r.person)).size} people${geo&&geo.region!==geo.country?' · '+geo.country:''}`);institutionHost.append(line)}}}
  const overlapHost=document.querySelector('#overlap-links');
  overlaps(g).forEach(n=>{const item=el('span');item.append(nodeLink(n),` · ${n.people.length} people`);overlapHost.append(item)});
  const gapHost=document.querySelector('#gap-links');
  gaps(g).forEach(item=>{const p=el('p');p.append(link(`${item.people.length} ${item.label.toLowerCase()} →`,'/connections/?gap='+item.id+'#people'));gapHost.append(p)});
  function render(){host.replaceChildren();const query=search.value.trim().toLowerCase();
   const people=g.people.filter(p=>{
    const eligible=relations(g,p.id).filter(r=>(includeGuesses.checked||!['inferred','tentative'].includes(r.review))&&(!languageOnly||r.kind==='language/tool'));
    if(languageOnly&&!eligible.length)return false;
    if(gap&&!gap.people.includes(p.id))return false;
    if(selected&&p.id!==selected.id&&!eligible.some(r=>origin(r)===selected.id||r.target===selected.id))return false;
    const text=[p.name,...eligible.map(r=>[r.role,indexGraph(g).byId.get(r.target===p.id?origin(r):r.target).name].join(' '))].join(' ').toLowerCase();
    return !query||text.includes(query);
   });document.querySelector('#connection-count').textContent=`${people.length} people shown`;
   for(const p of people){const card=el('article');card.className='connection-card';card.id=p.id;const portrait=portraitMap[p.name];if(portrait){const img=el('img');img.src=portrait.src;img.alt=(portrait.kind==='ai-assisted-illustration'?'AI-assisted illustration of ':portrait.kind==='photograph'?'Photograph of ':portrait.kind==='dithered-photograph'?'Dithered portrait of ':'Illustrated portrait of ')+p.name;img.dataset.portraitKind=portrait.kind;img.width=120;img.height=120;img.loading='lazy';img.className='connection-portrait';card.append(img);const credit=link(portrait.kind==='ai-assisted-illustration'?'AI-assisted · reference photo ↗':'Portrait source ↗',portrait.page);credit.className='connection-portrait-credit';card.append(credit);if(portrait.kind==='photograph'&&portrait.credit){const attribution=el('small',portrait.credit);attribution.className='connection-portrait-credit';card.append(attribution)}}const heading=el('h3');heading.append(nodeLink(p));card.append(heading,el('small',p.placement));if(p.inclusion)card.append(el('p',p.inclusion));card.append(rows(g,p,{languageOnly,includeInferred:includeGuesses.checked}));if(p.study)card.append(link('Open animated study ↗','/notes/ingredients/people.html?person='+p.study));host.append(card)}
   if(!people.length)host.append(el('p','No matching records. Try a person, institution, tool or recipe.'));
  }search.addEventListener('input',render);includeGuesses.addEventListener('change',render);render();
 }
}
