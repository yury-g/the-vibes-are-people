import assert from 'node:assert/strict';
import {overlaps,recipeSearchTerms} from '../dist/connections/graph.js';
const g={people:[{id:'p',name:'Person'},{id:'q',name:'Other'}],entities:[{id:'e',name:'Eyebeam'},{id:'x',name:'Guessed language'}],recipes:[{id:'r',name:'Pattern'}],relationships:[{person:'p',target:'r',kind:'contribution',review:'imported'},{person:'q',target:'r',kind:'contribution',review:'imported'},{person:'p',target:'e',review:'checked'},{person:'p',target:'e',review:'checked'},{person:'q',target:'e',review:'checked'},{person:'p',target:'x',review:'inferred'}]};
assert.deepEqual(overlaps(g).map(x=>[x.id,x.people.length]),[['e',2]],'Unchecked credits are not documented overlaps, and repeated residencies count once');
assert.match(recipeSearchTerms(g).get('Pattern'),/eyebeam/);
assert.doesNotMatch(recipeSearchTerms(g).get('Pattern'),/guessed/,'Inferences must not silently enter ingredient search');
console.log('Evidence-aware overlaps and contributor connection search pass');
