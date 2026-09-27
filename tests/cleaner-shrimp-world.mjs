import assert from 'node:assert/strict';
import {makeFish,stepFish,refreshSkin,separateFish,unionSkin,captureAll} from '../dist/iterations/cleaner-shrimp/world.js';
globalThis.scrollY=0;
const fishes=Array.from({length:6},(_,i)=>makeFish(i,1280,900));
assert.equal(new Set(fishes.map(f=>f.style)).size,6);
assert.equal(fishes[5].eyes.length,2,'ultraviolet retains both moving eyes');
const initialGaze=fishes[5].eyes[0].gaze.x;
for(const f of fishes){f.letters=[];f.target={x:640,y:450};stepFish(f,1/60);assert(f.body.length===15);assert(Math.abs(f.body[1].a-f.heading)<1e-9);}
assert.notEqual(fishes[5].eyes[0].gaze.x,initialGaze,'ultraviolet gaze updates with motion');
const a=fishes[0],b=fishes[1];b.x=a.x;b.y=a.y;b.heading=a.heading;b.angles=[...a.angles];b.articulate(0);refreshSkin(b);separateFish([a,b]);
assert(!a.contactOverlap,'fish hulls separate');
const el={classList:{add(){},remove(){}}},l={x:a.x+Math.cos(a.heading)*2,y:a.y+Math.sin(a.heading)*2,ch:'A',size:20,width:12,height:20,font:'20px Arial',baseline:7,el,visible:true,state:'home'};
a.letters=b.letters=[l];b.x=a.x;b.y=a.y;b.heading=a.heading;a.time=b.time=4;captureAll([a,b]);assert.equal((a.eaten||0)+(b.eaten||0),1,'one shared letter can be captured only once');
console.log('Six independent fish, connected neck, separation, shared single capture passed.');
const {readFileSync}=await import('node:fs');
const sprites=JSON.parse(readFileSync(new URL('./art-flow-sprites.json',import.meta.url)));
const {chooseTargets,styles,overlap}=await import('../dist/iterations/cleaner-shrimp/world.js');
for(const [w,h] of [[320,640],[390,844],[1280,900]]){
 const fs=Array.from({length:6},(_,i)=>makeFish(i,w,h,sprites[styles[i]]));let maxOverlap=0,maxLink=0,maxYaw=0,maxCorrection=0;const travel=fs.map(()=>0);separateFish(fs);
 for(let k=0;k<1800;k++){
  const dt=[.0161,.0172,.0154,.018,.0333][k%5];
  chooseTargets(fs,[],k/60,{x:w/2,y:h/2,until:k%600<180?k/60+1:0});
  for(const f of fs){const x=f.x,y=f.y,heading=f.heading;stepFish(f,dt);travel[f.id]+=Math.hypot(f.x-x,f.y-y);maxYaw=Math.max(maxYaw,Math.abs(f.heading-heading)/dt);}
  const before=fs.map(f=>({x:f.x,y:f.y}));separateFish(fs);
  for(const f of fs){const b=f.solidSkin.bounds;assert(b.left>=37.9&&b.right<=w-37.9&&b.top>=37.9&&b.bottom<=h-37.9);assert(Math.abs(f.body[0].x-f.x)<1e-8);assert(Math.abs(f.body[1].a-f.heading)<1e-8);for(let i=1;i<15;i++)maxLink=Math.max(maxLink,Math.abs(Math.hypot(f.body[i].x-f.body[i-1].x,f.body[i].y-f.body[i-1].y)-f.segmentLength));maxCorrection=Math.max(maxCorrection,Math.hypot(f.x-before[f.id].x,f.y-before[f.id].y));assert((f.turnLedger?.used||0)<=5*Math.PI+1e-7);}
  for(let i=0;i<6;i++)for(let j=i+1;j<6;j++)maxOverlap=Math.max(maxOverlap,overlap(fs[i],fs[j])?.depth||0);
 }
 assert(maxOverlap<.01);assert(maxLink<1e-8);assert(maxYaw<=1.500001);assert(travel.every(d=>d>300));console.log({w,h,maxOverlap,maxLink,maxYaw,maxCorrection,minTravel:Math.min(...travel)});
}
