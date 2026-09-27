import test from 'node:test';
import assert from 'node:assert/strict';
import {makeFish,refreshSkin,separateFish} from '../dist/iterations/shared-pond/world.js';
import {scaleFish} from '../dist/iterations/behavior-lab/scale.js';
import {swimHunter,advanceSpeed,targetHunters} from '../dist/iterations/behavior-lab/hunt.js';

test('two fish have 80 percent bodies and collision hulls; the marker stays full size',()=>{
 for(const id of [2,3,4]){
  const f=makeFish(id,900,700);f.refugeScale=.9;f.articulate(0);refreshSkin(f);
  const before={segment:f.segmentLength,radius:f.boundRadius},factor=id===2?1:.8;scaleFish(f);
  assert.ok(Math.abs(f.segmentLength/before.segment-factor)<1e-10);assert.ok(Math.abs(f.boundRadius/before.radius-factor)<.01);
  scaleFish(f);assert.ok(Math.abs(f.segmentLength/before.segment-factor)<1e-10,'resize never compounds the scale');
 }
});
test('small fish abandon prey near the large fish; the large fish is not frightened',()=>{
 const fs=[2,3,4].map(id=>{const f=makeFish(id,1000,800);scaleFish(f);f.x=400+(id-2)*65;f.y=400;f.heading=0;f.angles.fill(0);f.articulate(0);refreshSkin(f);return f;});
 const food={x:560,y:400,group:'science'};targetHunters(fs,[food],[],1);
 for(const f of fs.slice(1)){assert.equal(f.mode,'evade');assert.equal(f.prey,null);assert.equal(f.fearThreat,fs[0]);}
 assert.notEqual(fs[0].mode,'evade');
});
test('fear has hysteresis, then settles after the large fish leaves',()=>{
 const big=makeFish(2,1000,800),small=makeFish(3,1000,800);scaleFish(big);scaleFish(small);
 Object.assign(big,{center:{x:350,y:350},boundRadius:60});Object.assign(small,{x:480,y:350,center:{x:480,y:350},boundRadius:48});
 targetHunters([big,small],[],[],1);assert.equal(small.mode,'evade');
 big.center.x=300;targetHunters([big,small],[],[],1.2);assert.equal(small.mode,'evade');
 big.center.x=10;targetHunters([big,small],[],[],3);assert.equal(small.mode,'recover');
 targetHunters([big,small],[],[],5);assert.notEqual(small.mode,'evade');assert.notEqual(small.mode,'recover');assert.equal(small.fearThreat,null);
});
test('fear creates physical separation with eased movement',()=>{
 const big=makeFish(2,1000,800),small=makeFish(3,1000,800);scaleFish(big);scaleFish(small);
 for(const [f,x,heading]of [[big,430,0],[small,490,Math.PI]]){f.x=x;f.y=400;f.heading=heading;f.angles.fill(heading);f.articulate(0);refreshSkin(f);}
 const initial=Math.hypot(small.center.x-big.center.x,small.center.y-big.center.y);let farthest=initial,sawFear=false;
 for(let i=0;i<720;i++){
  targetHunters([big,small],[],[],i/120);sawFear||=small.mode==='evade';const speed=small.speed;
  swimHunter(small,1/120);separateFish([big,small]);
  assert.ok(Math.abs(small.speed-speed)<1,'ordinary acceleration remains bounded');
  farthest=Math.max(farthest,Math.hypot(small.center.x-big.center.x,small.center.y-big.center.y));
 }
 assert.ok(sawFear);assert.ok(farthest>initial+100);
});
test('smaller fish scale acceleration and speed while preserving turn timing',()=>{
 const full=makeFish(2,900,700),small=makeFish(3,900,700);scaleFish(full);scaleFish(small);
 for(const [f,factor] of [[full,1],[small,.8]])Object.assign(f,{x:450,y:350,speed:40*factor,acceleration:0,heading:0,angles:Array(15).fill(0),yaw:0,requestedSpeed:90,personality:{turn:1,tempo:1,phase:0,hand:1},target:{x:800,y:350}});
 for(let i=0;i<100;i++){swimHunter(full,1/120);swimHunter(small,1/120);}
 assert.ok(Math.abs(small.speed/full.speed-.8)<.002);
 assert.ok(Math.abs((small.x-450)/(full.x-450)-.8)<.002);
 const a={speed:30,mode:'hunt',sizeFactor:1},b={speed:24,mode:'hunt',sizeFactor:.8};advanceSpeed(a,90,1/60);advanceSpeed(b,72,1/60);assert.ok(Math.abs(b.acceleration/a.acceleration-.8)<1e-10);
});
test('scaled fish stay inside the 90 percent tank through turns',()=>{
 const fs=[2,3,4].map(id=>{const f=makeFish(id,520,760*.9);scaleFish(f);return f;});
 for(let i=0;i<1200;i++){
  for(const f of fs){f.target={x:260+220*Math.sin(i*.015+f.id),y:330+300*Math.cos(i*.012+f.id)};f.requestedSpeed=100;swimHunter(f,1/120);}separateFish(fs);
  for(const f of fs){const b=f.solidSkin.bounds;assert.ok(b.top>=5.9&&b.bottom<=760*.9-5.9);assert.ok(Number.isFinite(f.speed+f.heading));}
 }
});
test('reserving the bottom strip preserves the requested sizes in landscape',()=>{
 for(const id of [2,3,4]){
  const original=makeFish(id,800,400);original.refugeScale=.9;original.articulate(0);
  const lab=makeFish(id,800,360);scaleFish(lab,400);
  assert.ok(Math.abs(lab.segmentLength/original.segmentLength-(id===2?1:.8))<1e-10);
 }
});
