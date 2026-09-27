import assert from 'node:assert/strict';
import {schoolSnapshot,letterSnapshot} from '../dist/iterations/ultraviolet-best/live-state.js';
const letters=[{id:1,ch:'Y',state:'home',visible:true,x:10,y:20,hx:10,hy:20,vx:0,vy:0,size:100},{id:2,ch:'u',state:'fleeing',visible:true,x:30,y:40,hx:10,hy:20,vx:30,vy:40,size:40},{id:3,ch:'r',state:'returning',visible:false,x:10,y:60,hx:10,hy:20,vx:0,vy:-20,size:20},{id:4,ch:'y',state:'home',visible:false,eaten:true,size:20}];
const e={letters,time:8,prey:letters[1],mode:'hunt',skin:{query:()=>({clearance:2})},pursuitMemory:new Map()};
const s=schoolSnapshot(e);assert.equal(s.total,4);assert.equal(s.home+s.fleeing+s.returning+s.eaten,4);assert.equal(s.visible+s.offscreen+s.eaten,4);assert.equal(s.moving,1);assert.equal(s.offscreen,1);
const l=letterSnapshot(e,letters[1]);assert.equal(l.speed,50);assert.equal(l.target,true);assert.equal(l.state,'fleeing');assert.deepEqual(l.home,{x:10,y:20});assert.equal(l.clearance,2);assert.equal(letterSnapshot(e,letters[0]).target,false);assert.equal(letterSnapshot(e,letters[3]).state,'eaten');
const before=JSON.stringify(letters);schoolSnapshot(e);letterSnapshot(e,letters[1]);assert.equal(JSON.stringify(letters),before,'Readouts cannot alter simulation');
console.log('Whole school reconciles including eaten/offscreen; real selected-letter velocity, home, target and clearance; read-only snapshots pass.');
const {drawFishCamera}=await import('../dist/iterations/ultraviolet-best/live-views.js');
const ctx=new Proxy({}, {get:()=>()=>{}});let draws=0;const fish={w:1280,h:720,x:450,y:200,heading:.3,phase:2,time:5,eyes:[],drawFish(c){assert.equal(c,ctx);assert.equal(this,fish);draws++;}};
drawFishCamera(ctx,fish,300,150);
assert.equal(draws,1);assert.equal(fish.time,5);assert.equal(fish.phase,2);console.log('Retained eye camera draws the actual fish without stepping time or pose.');

const {letterViewState}=await import('../dist/iterations/ultraviolet-best/live-views.js');
const cheap={...e,skin:{query(){throw new Error('Removed collision diagnostics must not run');}}};
for(const letter of letters){const actual=letterViewState(cheap,letter),full=letterSnapshot(e,letter);assert.deepEqual(actual,{state:full.state,visible:full.visible,target:full.target});}
console.log('Compact letter view matches actual state without removed collision/stat calculations.');
