import assert from 'node:assert/strict';
import {people,lifespan} from '../dist/notes/living/data.js';
import {unmix} from '../dist/notes/living/unmix.js';
import {portraitSources} from '../dist/notes/living/portrait-sources.js';
assert.equal(people.length,21);
for(const id of ['mccarthy','brain','kogan']){const p=people.find(p=>p.id===id);assert.ok(p?.bio&&p?.study&&p?.sources.length);assert.ok(unmix[id]?.length===2);assert.ok(portraitSources[id]);assert.equal(lifespan(p),'')}
console.log('Three complete People records without guessed birth dates');
