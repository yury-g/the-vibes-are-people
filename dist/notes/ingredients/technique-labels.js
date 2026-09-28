import {attachConnections} from '/connections/connections.js';
// Supplemental provenance for B. The existing technique records and draw loop
// are still owned by ../techniques/techniques.js and are never copied or replaced.
// Portraits are optional: a slow image manifest must never block the recipes.
const portraitRequest=fetch(new URL('portrait-map.json',import.meta.url))
  .then(r=>r.ok?r.json():{}).catch(()=>({}));
const records=await fetch(new URL('technique-provenance.json',import.meta.url))
  .then(r=>{if(!r.ok)throw new Error('Provenance unavailable');return r.json()});
let portraits={};
const byName=new Map(records.map(record=>[record.name,record]));
const tiles=[...document.querySelectorAll('.tile')];
const $=selector=>document.querySelector(selector);
function element(tag, className, text){const el=document.createElement(tag);el.className=className;if(text)el.textContent=text;return el}
function face(person){
  const photo=portraits[person.name];
  if(!photo){const missing=element('span','ingredient-face unavailable','Portrait not located');missing.dataset.person=person.name;missing.setAttribute('role','img');missing.setAttribute('aria-label',`Portrait not yet located for ${person.name}`);return missing}
  const img=element('img','ingredient-face');img.src=photo.src;img.alt='';img.dataset.person=person.name;img.width=96;img.height=112;img.loading='lazy';img.decoding='async';
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
    if(photo?.page)imageColumn.append(sourceLink(photo.kind==='existing'?'Portrait credit ↗':'Photo source ↗',photo.page,'photo-credit'));
    const copy=element('div','ingredient-copy');
    copy.append(element('h4','',person.name),element('p','ingredient-role',person.role),element('p','contribution',person.detail),sourceLink(`${person.source} ↗`,person.url));
    if(photo?.personId){const profile=element('a','person-profile','Open person’s study ↗');profile.href=`/notes/ingredients/people.html?person=${encodeURIComponent(photo.personId)}`;copy.append(profile)}
    attachConnections(copy,person.name);row.append(imageColumn,copy);panel.append(row);
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
    const matches=!query||[name,...(record?.contributors||[]).map(p=>p.name)].some(value=>value.toLocaleLowerCase().includes(query));
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
