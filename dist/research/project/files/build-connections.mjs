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
  if(!['imported','checked'].includes(r.review))throw Error('Invalid review status');
 }
 return g;
}
export async function build(){
 const recipes=await read('dist/notes/ingredients/technique-provenance.json');
 const checked=await read('research/checked-relationships.json');
 const eyebeam=await read('research/eyebeam-connections.json');
 const persons=new Map(),entities=new Map(),relationships=[];
 function person(name){if(!persons.has(name)){const study=studies.find(p=>p.name===name);persons.set(name,{id:'person-'+slug(name),name,study:study?.id||null,placement:eyebeam.artists.find(p=>p.name===name)?.status|| (study?'In the collection':'Existing recipe credit')})}return persons.get(name).id}
 for(const p of studies)person(p.name);
 for(const recipe of recipes)for(const c of recipe.contributors)relationships.push({person:person(c.name),target:'recipe-'+slug(recipe.name),kind:'contribution',role:c.role,detail:c.detail,source:c.url,sourceLabel:c.source,dates:null,checked:null,review:'imported'});
 for(const c of connections)relationships.push({person:person(studies.find(p=>p.id===c.a).name),target:person(studies.find(p=>p.id===c.b).name),kind:'documented path',role:c.type,detail:c.label,source:c.url,sourceLabel:c.source,dates:null,checked:null,review:'imported'});
 for(const r of checked){const target='entity-'+slug(r.target);entities.set(target,{id:target,name:r.target});relationships.push({...r,person:person(r.person),target,review:'checked'})}
 for(const name of ['Tega Brain'])persons.get(name).placement='To be assigned';
 persons.get('Yury Gitman').placement='Project author';
 const g={checked:'2026-09-27',people:[...persons.values()].sort((a,b)=>a.name.localeCompare(b.name,'en')),entities:[...entities.values()],recipes:recipes.map(r=>({id:'recipe-'+slug(r.name),name:r.name})),relationships};
 return validate(g);
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const g=await build();await writeFile(new URL('dist/connections/data.json',root),JSON.stringify(g,null,2)+'\n');
 const report={people:g.people.length,recipes:g.recipes.length,importedCredits:g.relationships.filter(r=>r.kind==='contribution').length,importedPaths:g.relationships.filter(r=>r.kind==='documented path').length,checkedRelationships:g.relationships.filter(r=>r.review==='checked').length,toBeAssigned:g.people.filter(p=>p.placement==='To be assigned').map(p=>p.name),peopleWithoutCheckedRelationships:g.people.filter(p=>!g.relationships.some(r=>r.person===p.id&&r.review==='checked')).map(p=>p.name)};
 await writeFile(new URL('research/connections-coverage.json',root),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
}
