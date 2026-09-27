import assert from 'node:assert/strict';
import {selectLivePreviews} from '../dist/gallery/preview-policy.js';
const entries=[{id:'a',visible:true,distance:200},{id:'b',visible:true,distance:20},{id:'c',visible:false,distance:0},{id:'d',visible:true,distance:40}];
assert.deepEqual(selectLivePreviews(entries),['b','d']);
assert.deepEqual(selectLivePreviews(entries,{paused:true}),[]);
assert.deepEqual(selectLivePreviews(entries,{hidden:true}),[]);
assert.deepEqual(selectLivePreviews([{id:'a',visible:true,distance:0}]),['a']);
assert.deepEqual(selectLivePreviews(entries.map(e=>({...e,visible:false}))),[]);
console.log('At most two visible previews animate; pause/hidden stop all, and offscreen entries never run.');
