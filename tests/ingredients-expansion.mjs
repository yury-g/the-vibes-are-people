import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {build} from '../scripts/build-connections.mjs';
const read=async p=>JSON.parse(await readFile(new URL('../'+p,import.meta.url),'utf8'));
const records=await read('dist/notes/ingredients/technique-provenance.json');
const baseline=await read('research/ingredients-baseline.json');
assert.equal(baseline.length,108);
for(const {recipe,contributor} of baseline)assert.ok(records.find(r=>r.name===recipe)?.contributors.some(c=>JSON.stringify(c)===JSON.stringify(contributor)),`Preserve original credit: ${recipe} / ${contributor.name}`);
assert.equal(new Set(records.flatMap(r=>r.contributors.map(c=>c.name))).size,105);
const graph=await build(),profiles=await read('dist/notes/ingredients/people-profiles.json');
for(const name of ['Golan Levin','Tega Brain','Lauren Lee McCarthy','Gene Kogan','Zach Lieberman']){
 const p=graph.people.find(p=>p.name===name);assert.equal(p.placement,'In Ingredients');
 assert.ok(graph.relationships.some(r=>r.person===p.id&&r.kind==='contribution'&&r.review==='checked'&&r.checked));
 assert.ok(graph.relationships.some(r=>r.person===p.id&&r.target==='entity-eyebeam'&&r.review==='checked'));
 assert.ok(profiles[name].bio&&/^https:/.test(profiles[name].source));
}
assert.equal(graph.relationships.filter(r=>r.kind==='contribution'&&r.review==='checked').length,8);
const portraits=await read('dist/notes/ingredients/portrait-map.json');
for(const name of ['Lauren Lee McCarthy','Tega Brain']){const p=portraits[name];assert.equal(p.kind,'photograph');assert.ok(p.original&&p.credit);await access(new URL('../dist'+p.src,import.meta.url))}
assert.match(graph.relationships.find(r=>r.person==='person-gene-kogan'&&r.target==='entity-eyebeam').role,/Lisa Kori/);
assert.equal(graph.relationships.find(r=>r.person==='person-zach-lieberman'&&r.target==='entity-cpp').confidence,3);
console.log('105 recipe contributors; eight sourced additions; original credits, biographies, portraits and joint residency verified');
