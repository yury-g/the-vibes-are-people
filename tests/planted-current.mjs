import test from 'node:test';
import assert from 'node:assert/strict';
import {targetHunters} from '../dist/iterations/planted-current/hunt.js';
import {EdgeShrimp} from '../dist/iterations/planted-current/cleaners.js';
import {stepLetters} from '../dist/iterations/planted-current/physics.js';
import {stepPlants,currentAt} from '../dist/iterations/planted-current/current.js';
import {makeFish,refreshSkin} from '../dist/iterations/shared-pond/world.js';
import {letterFishContact} from '../dist/iterations/hunting-tank/solid.js';
import {LivingLinkScene} from '../dist/iterations/planted-current/scene.js';

const glyph=(x,y,group='science')=>({x,y,hx:x,hy:y,width:20,height:28,glyphWidth:12,inkHeight:18,inkOffset:0,vx:0,vy:0,group});
test('hunters leave the large planted name alone',()=>{
 const f={id:2,x:200,y:200,w:800,h:600,heading:0};
 const plant=glyph(230,200,'name');
 targetHunters([f],[plant],[],0);
 assert.equal(f.prey,null);
 const food=glyph(280,200);targetHunters([f],[plant,food],[],.1);
 assert.equal(f.prey,food);
});
test('tethered plants move continuously, stay near home and carry valid perch velocities',()=>{
 const plants=[glyph(200,250,'name'),glyph(250,250,'name')];
 for(let i=0;i<3600;i++){
  const before=plants.map(l=>({...l}));stepPlants(plants,1/120,i/120);
  for(const [j,l] of plants.entries()){
   assert.ok(Math.hypot(l.x-l.hx,l.y-l.hy)<8);
   assert.ok(Math.hypot(l.x-before[j].x,l.y-before[j].y)<.04);
   assert.ok(Math.abs((l.x-before[j].x)*120-l.vx)<1e-8);
  }
 }
 const a=currentAt(200,250,3),b=currentAt(200.01,250.01,3.001);
 assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<.001);
 assert.ok(Math.hypot(plants[0].x-200,plants[0].y-250)>.1);
});
test('pause freezes plants, fish and feeding positions without resetting them',()=>{
 const letters=[{...glyph(240,320,'name'),hx:200,hy:250},{...glyph(310,500),sinking:true}];
 const scene={letters,paused:false,draw(){}};const before=structuredClone(letters);
 LivingLinkScene.prototype.setPaused.call(scene,true);
 assert.equal(scene.paused,true);assert.deepEqual(letters,before);
});
test('crowded small-letter feeding preserves ink clearance with three fish',()=>{
 const width=763,height=1124;
 const ls=[[18,360],[7,405],[9,445]].flatMap(([n,y])=>Array.from({length:n},(_,i)=>({...glyph(18+i*18,y),glyphWidth:12+i%4,width:20+i%4,height:20,inkHeight:16})));
 const fish=[2,3,4].map((id,i)=>{const f=makeFish(id,width,height);f.x=160+i*100;f.y=330+i*40;f.heading=i?Math.PI:0;f.angles.fill(f.heading);f.articulate(0);refreshSkin(f);return f;});
 for(let tick=0;tick<240;tick++){
  stepLetters(ls,1/60,{width,height,time:tick/60,hunters:fish});
  if(tick<20)continue;
  for(const a of ls)for(const f of fish)assert.ok((letterFishContact(a,f)?.depth||0)<.05);
  for(let i=0;i<ls.length;i++)for(let j=i+1;j<ls.length;j++){
   const a=ls[i],b=ls[j];
   assert.ok(Math.abs(a.x-b.x)>=(a.glyphWidth+b.glyphWidth)/2||Math.abs(a.y-b.y)>=(a.inkHeight+b.inkHeight)/2,'ink remains separate');
  }
 }
});
test('neighboring shrimp meals are reserved with body clearance before landing',()=>{
 const w=new EdgeShrimp(800,600),a=glyph(300,500),b=glyph(320,500),c=glyph(420,500);
 for(const l of [a,b,c])l.settled=true;
 w.letters=[a,b,c];const [s,t]=w.shrimp;
 Object.assign(s,{host:a,meal:true,patch:null,...w.refugePose(a,s)});
 Object.assign(t,{x:322,y:490,patch:null});
 assert.equal(w.pickMeal(t),c);
});
test('uncontested letters settle without residual pair stacking',()=>{
 const ls=Array.from({length:12},(_,i)=>glyph(210+i*10,240));
 for(let i=0;i<120;i++)stepLetters(ls,1/120,{width:800,height:600,time:i/120});
 for(let i=0;i<ls.length;i++)for(let j=i+1;j<ls.length;j++){
  const a=ls[i],b=ls[j];assert.ok(Math.abs(a.x-b.x)>=19.99||Math.abs(a.y-b.y)>=27.99);
 }
});
