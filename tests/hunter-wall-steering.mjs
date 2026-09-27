import test from 'node:test';
import assert from 'node:assert/strict';
import {makeFish,refreshSkin,separateFish} from '../dist/iterations/shared-pond/world.js';
import {targetHunters,swimHunter} from '../dist/iterations/hunting-tank/hunt.js';

test('a startled fish turns before its body repeatedly meets the glass',()=>{
 for(const [x,y,heading,target] of [
  [250,300,Math.PI,{x:35,y:300}],
  [550,300,0,{x:765,y:300}],
  [400,210,-Math.PI/2,{x:400,y:35}],
  [400,390,Math.PI/2,{x:400,y:565}],
 ]){
  const f=makeFish(2,800,600);Object.assign(f,{x,y,heading,speed:145,fleeUntil:5,fleeTarget:target});f.angles.fill(heading);f.articulate(0);refreshSkin(f);
  let contacts=0;
  for(let i=0;i<240;i++){
   targetHunters([f],[],[],i/120);swimHunter(f,1/120);separateFish([f]);
   const b=f.solidSkin.bounds;
   if(Math.min(b.left-6,794-b.right,b.top-6,594-b.bottom)<1)contacts++;
  }
  assert.ok(contacts<12,`fish heading ${heading} touched glass for ${contacts} frames`);
 }
});

test('a quiet fish without prey wanders rather than fleeing food',()=>{
 const f=makeFish(2,800,600),food={x:f.x+45,y:f.y,hx:f.x+45,hy:f.y,width:20,height:30};
 targetHunters([f],[food],[],10);
 assert.equal(f.mode,'wander');
 assert.equal(f.prey,null);
 assert.notEqual(f.target,food);
});
