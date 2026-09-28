import assert from 'node:assert/strict';
import {build,validate} from '../scripts/build-connections.mjs';
import {relations,indexGraph,overlaps,gaps} from '../dist/connections/graph.js';
const g=await build();
const foundation=g.entities.find(n=>n.name==='Processing Foundation');
assert.equal(foundation.type,'organization');
assert.ok(!g.people.some(p=>p.name==='Processing Foundation'));
for(const name of ['Muriel Cooper','John Maeda','Xin Xin','R. Luke DuBois','Kate Hollenbach','Cassie Tarakajian','Qianqian Ye']) {
 const matches=g.people.filter(p=>p.name===name);assert.equal(matches.length,1,name);assert.ok(matches[0].inclusion?.length>20,name+' needs a substantive inclusion reason');
}
assert.ok(!g.people.some(p=>p.name==='Roxana Hadad'));
const edge=(from,to,kind)=>g.relationships.find(r=>(r.subject||r.person)===from&&r.target===to&&r.kind===kind);
assert.ok(edge('person-muriel-cooper','person-john-maeda','research lineage'));
for(const p of ['person-casey-reas','person-ben-fry'])assert.ok(edge('person-john-maeda',p,'mentorship'));
assert.ok(edge('entity-processing','entity-p5-js','reinterpretation'));
assert.ok(edge(foundation.id,'entity-processing','stewardship'));
assert.ok(relations(g,foundation.id).some(r=>r.subject===foundation.id));
assert.ok(indexGraph(g).byPerson.get('entity-processing').some(r=>r.subject===foundation.id));
assert.ok(overlaps(g).every(n=>n.people.every(id=>g.people.some(p=>p.id===id))),'Organizations must not inflate people counts');
for(const r of g.relationships.filter(r=>r.lineage))assert.ok(r.inverseRole&&r.checked&&r.review==='checked'&&r.source.startsWith('https://'));
assert.throws(()=>validate({...g,relationships:[{subject:foundation.id,target:'missing',kind:'stewardship',role:'Supports',source:'https://processing.org',review:'checked'}]}),/reference/);
console.log('Processing lineage: inclusion, typed edges, direction, node lookup and people counts pass');

for(const id of ['person-cassie-tarakajian','person-qianqian-ye','person-r-luke-dubois','person-kate-hollenbach'])assert.ok(!gaps(g).find(x=>x.id==='languages').people.includes(id),'Documented tool work must not appear as a gap: '+id);
