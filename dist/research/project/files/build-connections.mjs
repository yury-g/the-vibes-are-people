import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {people as studies,connections} from '../dist/notes/living/data.js';
const root=new URL('../',import.meta.url);
const read=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
export const slug=name=>name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function validate(g){
 const ids=new Set([...g.people,...g.entities,...g.recipes].map(x=>x.id));
 if(ids.size!==g.people.length+g.entities.length+g.recipes.length)throw Error('Identifier collision');
 for(const r of g.relationships){
  if(!ids.has(r.person)||!ids.has(r.target))throw Error('Dangling reference');
  if(!/^https?:\/\//.test(r.source)||!r.role)throw Error('Missing source or role');
  if(!['imported','checked','inferred','tentative'].includes(r.review))throw Error('Invalid review status');
  if(r.kind==='language/tool'){
   if(![1,2,3].includes(r.confidence)||r.review!==({1:'tentative',2:'inferred',3:'checked'})[r.confidence])throw Error('Invalid confidence or review status');
   if(!r.rationale?.trim()||!r.context?.trim())throw Error('Missing rationale or scope');
   if(!r.evidence?.length||r.evidence.some(e=>!/^https?:\/\//.test(e.url)||!e.label))throw Error('Missing evidence source');
   if(!g.entities.some(t=>t.id===r.target&&t.category))throw Error('Missing technology category');
  }
 }
 return g;
}
export async function build(){
 const recipes=await read('dist/notes/ingredients/technique-provenance.json');
 const checked=await read('research/checked-relationships.json');
 const eyebeam=await read('research/eyebeam-connections.json');
 const languages=await read('research/language-tools.json');
 const persons=new Map(),entities=new Map(),relationships=[];
 function person(name){if(!persons.has(name)){const study=studies.find(p=>p.name===name);persons.set(name,{id:'person-'+slug(name),name,study:study?.id||null,placement:eyebeam.artists.find(p=>p.name===name)?.status|| (study?'In the collection':'Existing recipe credit')})}return persons.get(name).id}
 for(const p of studies)person(p.name);
 for(const recipe of recipes)for(const c of recipe.contributors)relationships.push({person:person(c.name),target:'recipe-'+slug(recipe.name),kind:'contribution',role:c.role,detail:c.detail,source:c.url,sourceLabel:c.source,dates:null,checked:c.checked||null,review:c.review||'imported'});
 for(const c of connections)relationships.push({person:person(studies.find(p=>p.id===c.a).name),target:person(studies.find(p=>p.id===c.b).name),kind:'documented path',role:c.type,detail:c.label,source:c.url,sourceLabel:c.source,dates:null,checked:null,review:'imported'});
 for(const r of checked){const target='entity-'+slug(r.target);entities.set(target,{id:target,name:r.target});relationships.push({...r,person:person(r.person),target,review:'checked'})}
 for(const t of languages.technologies){if(entities.has(t.id)&&entities.get(t.id).name!==t.name)throw Error('Technology identifier collision');entities.set(t.id,t)}
 for(const r of languages.relationships){if(!persons.has(r.person))throw Error('Unknown language-layer person');relationships.push({...r,person:person(r.person),kind:'language/tool',review:({1:'tentative',2:'inferred',3:'checked'})[r.confidence]})}
 for(const p of persons.values()){
  if(relationships.some(r=>r.person===p.id&&r.kind==='contribution'))p.placement='In Ingredients';
  else if(p.name==='Tega Brain')p.placement='To be assigned';
 }
 persons.get('Yury Gitman').placement='Project author';
 const g={checked:'2026-09-28',people:[...persons.values()].sort((a,b)=>a.name.localeCompare(b.name,'en')),entities:[...entities.values()],recipes:recipes.map(r=>({id:'recipe-'+slug(r.name),name:r.name})),relationships};
 return validate(g);
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const g=await build();await writeFile(new URL('dist/connections/data.json',root),JSON.stringify(g,null,2)+'\n');
 const report={peopleWithoutDocumentedLanguageLinks:g.people.filter(p=>!g.relationships.some(r=>r.person===p.id&&r.kind==='language/tool'&&r.confidence===3)).map(p=>p.name),peopleWithoutCheckedAffiliations:g.people.filter(p=>!g.relationships.some(r=>r.person===p.id&&r.review==='checked'&&['residency','education','teaching','research','service'].includes(r.kind))).map(p=>p.name),people:g.people.length,recipes:g.recipes.length,recipeContributors:new Set(g.relationships.filter(r=>r.kind==='contribution').map(r=>r.person)).size,importedCredits:g.relationships.filter(r=>r.kind==='contribution'&&r.review==='imported').length,checkedRecipeCredits:g.relationships.filter(r=>r.kind==='contribution'&&r.review==='checked').length,importedPaths:g.relationships.filter(r=>r.kind==='documented path').length,checkedRelationships:g.relationships.filter(r=>r.review==='checked').length,languageRelationships:g.relationships.filter(r=>r.kind==='language/tool').length,inferredLanguageRelationships:g.relationships.filter(r=>r.kind==='language/tool'&&r.confidence<3).length,technologiesWithoutArtistEvidence:g.entities.filter(t=>t.category&&!g.relationships.some(r=>r.target===t.id&&r.kind==='language/tool')).map(t=>t.name),toBeAssigned:g.people.filter(p=>p.placement==='To be assigned').map(p=>p.name),peopleWithoutCheckedRelationships:g.people.filter(p=>!g.relationships.some(r=>r.person===p.id&&r.review==='checked')).map(p=>p.name)};
 await writeFile(new URL('research/connections-coverage.json',root),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
