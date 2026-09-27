import test from 'node:test';
import assert from 'node:assert/strict';
import {makeFish,separateFish,overlap} from '../dist/iterations/shared-pond/world.js';
import {enterFish,squirmPose,gateGeometry} from '../dist/iterations/inflated-tank/entrance.js';
import {targetHunters,swimHunter,avoidSchool} from '../dist/iterations/hunting-tank/hunt.js';
import {articulate} from '../dist/iterations/ultraviolet-flow/body.js';
test('each fish has a distinct gate pace and course, then a distinct first interest',()=>{
 const samples=[2,3,4].map(id=>{const f=makeFish(id,1000,800);for(let n=0;n<240;n++)enterFish(f,0,n/60,1/60,[f]);return{y:f.y,speed:f.speed,age:f.entryAge};});
 assert.equal(new Set(samples.map(s=>Math.round(s.y))).size,3);
 assert.equal(new Set(samples.map(s=>Math.round(s.speed))).size,3);
 const fishes=[2,3,4].map(id=>makeFish(id,1000,800));for(const [i,f]of fishes.entries()){
  f.enteredAt=10;f.arrivalUntil=i===0?0:10+(i===1?4:2.2);
  f.arrivalGoal=i===1?{x:550,y:260}:{x:700,y:650};
  f.arrivalSpeed=i===1?43:69;
 }
 const letters=[{x:450,y:350,hx:450,hy:350,width:30,height:40}];targetHunters(fishes,letters,[],10.2);
 assert.equal(fishes[0].mode,'hunt');assert.equal(fishes[1].mode,'wander');assert.equal(fishes[2].mode,'wander');
 assert.ok(fishes[1].requestedSpeed<fishes[2].requestedSpeed);
 assert.notDeepEqual(fishes[1].target,fishes[2].target);
});
test('single-file entrance keeps every visible body apart through the handoff',()=>{
 for(const [w,h]of [[1440,900],[390,844],[844,390]]){
 const fishes=[2,3,4].map(id=>makeFish(id,w,h)),arrival=[];
 fishes.forEach((f,i)=>{enterFish(f,i,0,0,fishes);assert.ok(f.solidSkin.bounds.left>w);});
 for(let n=0;n<2700;n++){
  const t=n/60;fishes.forEach((f,i)=>{const entering=enterFish(f,i,t,1/60,fishes);if(f.solidSkin.bounds.left<w&&arrival[i]===undefined)arrival[i]=t;if(entering)assert.ok(f.solidSkin.bounds.top>h*.6);});
  const visible=fishes.filter(f=>f.mode!=='waiting'),active=visible.filter(f=>f.entered);
  targetHunters(active,[],[],t);avoidSchool(visible,1/60);for(const f of active)swimHunter(f,1/60);
  separateFish(visible,{openRightFor:f=>!f.entered,gap:8});
  const gate=gateGeometry(w,h);
  for(const f of visible)if(!f.entered)for(const p of f.envelope)if(p.x>gate.left&&p.x<w){assert.ok(p.y>gate.top+8&&p.y<gate.bottom-8,`full fish clears doorway at ${w}×${h}`);}
  for(let i=0;i<visible.length;i++)for(let j=i+1;j<visible.length;j++)assert.equal(overlap(visible[i],visible[j],2),null,`body overlap at ${w}×${h}, ${t}s`);
 }
 for(let i=1;i<3;i++)assert.ok(arrival[i]-arrival[i-1]>=1.6,'room for each tail takes priority over a fixed schedule');
 assert.ok(fishes.every(f=>f.entered));
 const f=fishes[0];f.x=100;assert.equal(enterFish(f,0,50),false);assert.equal(f.x,100,'entrance never replays after completion');
 }
});
test('startled tail bends more while retaining connected, bounded joints',()=>{
 const sweep=squirm=>{const f=makeFish(2,1000,800);f.heading=0;f.angles.fill(0);f.speed=120;f.squirmUntil=squirm?1:0;let bend=0;
 for(let n=0;n<60;n++){f.time=n/60;f.phase+=.1;squirmPose(f,1/60);articulate(f,1/60);bend+=Math.abs(f.angles[14]-f.angles[5]);for(let i=1;i<15;i++)assert.ok(Math.abs(f.angles[i]-f.angles[i-1])<=.180001);}return bend;};
 assert.ok(sweep(true)>sweep(false)*1.3);
});
