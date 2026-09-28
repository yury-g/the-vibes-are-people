import {ledgerRequest,acceptedClaims} from '/agents/overlay.js';
import {recipeSearchTerms} from '/connections/graph.js';
import {attachConnections,connectionData} from '/connections/connections.js';
// Supplemental provenance for B. The existing technique records and draw loop
// are still owned by ../techniques/techniques.js and are never copied or replaced.
// Portraits are optional: a slow image manifest must never block the recipes.
const portraitRequest=fetch(new URL('portrait-map.json',import.meta.url))
  .then(r=>r.ok?r.json():{}).catch(()=>({}));
const records=await fetch(new URL('technique-provenance.json',import.meta.url))
  .then(r=>{if(!r.ok)throw new Error('Provenance unavailable');return r.json()});
const agentState=await ledgerRequest;
const additions=acceptedClaims(agentState.data).filter(p=>p.kind==='contribution');
for(const p of additions){const record=records.find(r=>r.name.normalize('NFKD').toLowerCase()===p.target.name.normalize('NFKD').toLowerCase());if(record&&!record.contributors.some(c=>c.name===p.person))record.contributors.push({name:p.person,role:p.role,detail:p.claim,url:p.sources[0],source:'Source · AI reviewed',review:'checked',checked:p.at.slice(0,10)})}
let portraits={},profiles={},connectionTerms=new Map();
const profileRequest=fetch(new URL('people-profiles.json',import.meta.url)).then(r=>r.ok?r.json():{}).catch(()=>({}));
const byName=new Map(records.map(record=>[record.name,record]));
const tiles=[...document.querySelectorAll('.tile')];
const $=selector=>document.querySelector(selector);
function element(tag, className, text){const el=document.createElement(tag);el.className=className;if(text)el.textContent=text;return el}
function face(person){
  const photo=portraits[person.name];
  if(!photo){const missing=element('span','ingredient-face unavailable','Portrait not located');missing.dataset.person=person.name;missing.setAttribute('role','img');missing.setAttribute('aria-label',`Portrait not yet located for ${person.name}`);return missing}
  const img=element('img','ingredient-face');img.src=photo.src;img.alt=photo.kind==='ai-assisted-illustration'?`AI-assisted portrait illustration of ${person.name}`:'';img.dataset.person=person.name;img.dataset.portraitKind=photo.kind;img.width=96;img.height=112;img.loading='lazy';img.decoding='async';
  img.addEventListener('error',()=>{const missing=element('span','ingredient-face unavailable','Portrait unavailable');img.replaceWith(missing)},{once:true});
  return img;
}
function sourceLink(label,url,className='evidence-link'){const a=element('a',className,label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a}
const allPeople=[...new Map(records.flatMap(r=>r.contributors).map(p=>[p.name,p])).values()];
$('#human-count').textContent=String(allPeople.length);
const tileRecords=new Map();
tiles.forEach((tile,index)=>{
  const name=tile.querySelector('.tile-label').textContent;
  const record=byName.get(name);
  if(!record)return;
  tileRecords.set(tile,record);
  const band=element('span','recipe-band');band.append(element('span','',`RECIPE ${String(index+1).padStart(2,'0')}`),element('span','','MOVING STUDY'));
  tile.prepend(band);
  const label=element('span','people-preview');
  const heading=element('span','ingredient-heading','Human ingredients');
  const faces=element('span','ingredient-roster');
  record.contributors.forEach(person=>{
    const item=element('span','ingredient-mini');item.append(face(person),element('span','ingredient-name',person.name));faces.append(item);
  });
  label.append(heading,faces,element('span','label-disclosure','READ CONTRIBUTIONS & SOURCES ↗'));
  tile.append(label);
});

// Each person remains attached to a specific contribution and its evidence.
const panel=element('section','human-ingredients');panel.id='human-ingredients';panel.setAttribute('aria-labelledby','human-ingredients-title');
$('#detail-description').after(panel);
function renderLabel(){
  const record=byName.get($('#detail-title').textContent);
  if(!record || panel.dataset.technique===record.name)return;
  panel.dataset.technique=record.name;panel.replaceChildren();
  $('#detail').scrollTop=0;
  const title=element('h3','ingredient-heading','Human ingredients');title.id='human-ingredients-title';panel.append(title);
  record.contributors.forEach(person=>{
    const row=element('article','ingredient-person');
    const photo=portraits[person.name];
    const imageColumn=element('div','ingredient-photo');imageColumn.append(face(person));
    if(photo?.page)imageColumn.append(sourceLink(photo.kind==='existing'?'Portrait credit ↗':photo.kind==='ai-assisted-illustration'?'Reference photo ↗':'Photo source ↗',photo.page,'photo-credit'));
    if(photo?.kind==='ai-assisted-illustration'){imageColumn.append(element('small','portrait-treatment','AI-assisted illustration'));imageColumn.append(sourceLink('View illustration ↗',photo.src,'photo-credit'));imageColumn.append(element('small','portrait-treatment',photo.credit))}
    const copy=element('div','ingredient-copy');
    copy.append(element('h4','',person.name),element('p','ingredient-role',person.role),element('p','contribution',person.detail),sourceLink(`${person.source} ↗`,person.url));
    if((person.review||'imported')==='imported')copy.append(element('small','evidence-status','Catalog credit · source recheck pending'));
    if(profiles[person.name]){const bio=profiles[person.name];copy.append(element('p','ingredient-bio',bio.bio),sourceLink('Artist biography ↗',bio.source))}
    const wikipedia=profiles[person.name]?.wikipedia||(photo?.page?.startsWith('https://en.wikipedia.org/wiki/')?photo.page:null);
    if(wikipedia)copy.append(sourceLink('Wikipedia biography ↗',wikipedia));
    if(photo?.personId){const profile=element('a','person-profile','Open person’s study ↗');profile.href=`/notes/ingredients/people.html?person=${encodeURIComponent(photo.personId)}`;copy.append(profile)}
    attachConnections(copy,person.name,{recipe:record.name});row.append(imageColumn,copy);panel.append(row);
  });
  panel.append(element('p','provenance-note',record.caveat));
}
new MutationObserver(renderLabel).observe($('#detail-title'),{childList:true,subtree:true});
renderLabel();

const search=$('#people-search');
function applyFilter(){
  const family=$('#filters [aria-pressed="true"]')?.textContent || 'All';
  const query=search.value.trim().toLocaleLowerCase();
  let shown=0;
  tiles.forEach(tile=>{
    const record=tileRecords.get(tile);
    const name=tile.querySelector('.tile-label').textContent;
    const inFamily=family==='All'||tile.querySelector('.tile-family').textContent===family;
    const matches=!query||[name,connectionTerms.get(name)||'',...(record?.contributors||[]).map(p=>p.name)].some(value=>value.toLocaleLowerCase().includes(query));
    tile.hidden=!(inFamily&&matches);if(!tile.hidden)shown++;
  });
  $('#count').textContent=`${shown} / ${tiles.length} RECIPES`;
  $('#recipe-empty').hidden=shown!==0;
}
search.addEventListener('input',applyFilter);
$('#filters').addEventListener('click',applyFilter);
$('#clear-search').addEventListener('click',()=>{search.value='';$('#filters button').click();applyFilter();search.focus()});
search.value=new URL(location.href).searchParams.get('person')||'';
applyFilter();
document.body.dataset.provenance='ready';

portraitRequest.then(loaded=>{
  portraits=loaded;
  document.querySelectorAll('.ingredient-face.unavailable[data-person]').forEach(placeholder=>{
    const person=allPeople.find(p=>p.name===placeholder.dataset.person);
    if(person&&portraits[person.name])placeholder.replaceWith(face(person));
  });
  panel.dataset.technique='';renderLabel();
  document.body.dataset.portraits='ready';
});

profileRequest.then(loaded=>{profiles=loaded;panel.dataset.technique='';renderLabel();document.body.dataset.profiles='ready'});

connectionData.then(graph=>{
 if(!graph)return;connectionTerms=recipeSearchTerms(graph);applyFilter();document.body.dataset.connectionSearch='ready';
 const roster=document.querySelector('#eyebeam-roster');if(!roster)return;
 const rows=graph.people.filter(p=>graph.relationships.some(r=>r.person===p.id&&r.target==='entity-eyebeam'&&r.review==='checked'));
 roster.replaceChildren();
 for(const p of rows){const card=element('article','eyebeam-person');card.append(element('h3','',p.name));
 const credits=records.filter(r=>r.contributors.some(c=>c.name===p.name));
 card.append(element('p','',credits.length?'In Ingredients · '+credits.map(r=>r.name).join(' · '):p.placement));
 const a=element('a','',credits.length?'Explore recipe credits ↗':'View evidence & research ↗');a.href=credits.length?'?person='+encodeURIComponent(p.name):'/connections/?node='+encodeURIComponent(p.id)+'#people';card.append(a);attachConnections(card,p.name);roster.append(card)}
}).catch(()=>{});

// Exact recipe links open the existing animated tile, preserving its controller.
const requestedRecipe=new URL(location.href).searchParams.get('recipe');
if(requestedRecipe){const tile=tiles.find(t=>t.querySelector('.tile-label').textContent===requestedRecipe);if(tile){search.value='';document.querySelector('#filters button')?.click();applyFilter();tile.click()}}

const additionsHost=document.querySelector('#agent-additions');
if(additionsHost){additionsHost.append(element('h2','','New sourced ingredients'),element('p','',agentState.live?'Agent contributions after two AI source checks. Follow the evidence; automated review can be wrong.':'Showing the deployed snapshot; the live contribution feed is unavailable.'));
for(const p of additions){const row=element('article','');row.append(element('h3','',p.target.name),element('p','',p.person+' · '+p.role),element('p','',p.claim),sourceLink('Primary source ↗',p.sources[0]),document.createTextNode(' · '),sourceLink('Review & history ↗','/agents/'));if(!records.some(r=>r.name===p.target.name))row.append(element('small','agent-source-note','Sourced technique · animated study not yet added'));additionsHost.append(row)}
if(!additions.length)additionsHost.append(element('p','','No accepted additions yet. New people and new techniques are welcome.'));
additionsHost.append(sourceLink('Send your AI to contribute ↗','/agents/'))}
