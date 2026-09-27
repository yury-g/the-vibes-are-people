import test from 'node:test';
import assert from 'node:assert/strict';
import {makeFish,refreshSkin} from '../dist/iterations/shared-pond/world.js';
import {fishWake,coralGrowth,coralRoot,coralBounds,coralSteering,separateCoral,reefWanderTarget} from '../dist/iterations/coral-reef/reef.js';
import {CoralArt} from '../dist/iterations/coral-reef/art.js';
import {markNameSurvivors} from '../dist/iterations/hunting-tank/prey.js';
import {nibble} from '../dist/iterations/hunting-tank/nibbles.js';

test('Yury G stays protected while itman remains biteable',()=>{
 const letters=[...'YuryGitman'].map(ch=>({ch,group:'name'}));markNameSurvivors(letters);
 assert.equal(letters.filter(l=>l.uncatchable).map(l=>l.ch).join(''),'YuryG');
 assert.equal(letters.filter(l=>!l.uncatchable).map(l=>l.ch).join(''),'itman');
});

test('the reef grows upward over time while leaving the lower swim lane open',()=>{
 const letter={x:300,y:270,glyphWidth:58,inkHeight:64,reefGrowth:coralGrowth(0)};
 const young=coralBounds(letter);letter.reefGrowth=coralGrowth(100);const mature=coralBounds(letter);
 assert.ok(mature.top<young.top-30);assert.equal(mature.bottom,young.bottom);
 assert.ok(mature.right-young.right<25);
});

test('coral stems attach to actual ink on letters with low tops',()=>{
 const letter={maskWidth:40,maskHeight:80,glyphWidth:40,inkHeight:55,inkPixels:[{x:8,y:24},{x:10,y:27},{x:30,y:25},{x:32,y:28}]};
 const left=coralRoot(letter,-1),right=coralRoot(letter,1);
 for(const root of [left,right])assert.ok(letter.inkPixels.some(p=>p.x===root.x+20&&p.y===root.y+38));
 assert.ok(left.x<0&&right.x>0);
});

test('a close mouth contact can bite a reef bubble letter',()=>{
 const fish={x:45,y:50,heading:0,nextNibble:0,nibbles:0};
 const letter={x:50,y:50,width:20,height:20,maskWidth:20,maskHeight:20,inkHeight:20,inkPixels:[{x:12,y:10}],group:'name',bites:[]};
 assert.equal(nibble(fish,letter,1),null);
 assert.ok(nibble(fish,letter,1,7));
 assert.equal(fish.nibbles,1);
});

test('passing koi stir nearby anemones while distant fish leave them calm',()=>{
 const near=fishWake([{center:{x:35,y:30},vx:100,vy:0}],0,0);
 const far=fishWake([{center:{x:400,y:30},vx:100,vy:0}],0,0);
 assert.ok(near.x>.5);assert.deepEqual(far,{x:0,y:0});
});

test('sheltered shrimp leave shell growth on the coral',()=>{
 const letter={x:100,y:100,glyphWidth:42,inkHeight:58,maskWidth:42,maskHeight:80,inkPixels:[{x:8,y:22},{x:34,y:23}]};
 const art=new CoralArt(letter,1),builder={host:letter,meal:false,x:100,y:99};
 for(let i=0;i<8;i++)art.update(.5,[],[builder]);
 assert.ok(art.buildAge>0);assert.ok(art.shells.length>=2);assert.ok(art.anemones.length>=2);
});

test('koi turn away from coral and cannot pass through its body',()=>{
 const letter={x:380,y:260,glyphWidth:70,inkHeight:100},f=makeFish(2,800,600);
 Object.assign(f,{x:470,y:260,heading:Math.PI,speed:95,vx:-95,vy:0});f.angles.fill(Math.PI);f.articulate(0);refreshSkin(f);
 const force=coralSteering(f,[letter]);assert.ok(force.x>0,'approaching from the right produces an outward turn');
 f.x=390;f.y=260;f.articulate(0);refreshSkin(f);separateCoral(f,[letter]);
 const a=f.solidSkin.bounds,b=coralBounds(letter,7);
 assert.ok(a.right<=b.left||a.left>=b.right||a.bottom<=b.top||a.top>=b.bottom);
});

test('reef guidance turns a fish beside the top glass into open water',()=>{
 const letter={x:200,y:180,glyphWidth:100,inkHeight:100,reefGrowth:1};
 const fish={center:{x:240,y:28},vx:0,vy:0,boundRadius:50,w:800,h:600,solidSkin:{bounds:{left:190,right:290,top:4,bottom:58}}};
 const force=coralSteering(fish,[letter]);
 assert.ok(force.x>0);assert.equal(force.y,0);
});

test('fish can pass between separated words without hitting an invisible reef bridge',()=>{
 const letters=[{x:200,y:300,glyphWidth:40,inkHeight:50,reefCluster:'Yury'},{x:600,y:300,glyphWidth:40,inkHeight:50,reefCluster:'Gitman'}];
 const f=makeFish(2,800,600);Object.assign(f,{x:400,y:300,heading:Math.PI/2,vx:0,vy:40});f.angles.fill(Math.PI/2);f.articulate(0);refreshSkin(f);
 const before={x:f.x,y:f.y};assert.equal(separateCoral(f,letters),false);assert.deepEqual({x:f.x,y:f.y},before);assert.deepEqual(coralSteering(f,letters),{x:0,y:0});
});

test('a reef contact beside either glass wall never sends a fish to a different face',()=>{
 for(const right of [false,true]){
  const f=makeFish(2,390,844);Object.assign(f,{x:right?368:22,y:422,heading:Math.PI/2});f.angles.fill(Math.PI/2);f.articulate(0);refreshSkin(f);
  const b=f.solidSkin.bounds;
  // Two pixels of contact on the outer reef face, with only six pixels of
  // water to the glass. The old safe-face filter picked the far side instead.
  const offset=right?384-b.right:6-b.left;f.x+=offset;f.articulate(0);refreshSkin(f);
  const edge=right?f.solidSkin.bounds.left+2:f.solidSkin.bounds.right-2;
  const letter={x:right?edge-18-35:edge+18+35,y:422,glyphWidth:70,inkHeight:100};
  const before={x:f.x,y:f.y};separateCoral(f,[letter]);
  assert.ok(Math.hypot(f.x-before.x,f.y-before.y)<5,'contact must stay on the same side of the reef');
 }
});


test('wandering visits left, right, above and below the centered name',()=>{
 for(const [w,h] of [[1440,900],[390,844],[844,390]]){
  const f=makeFish(2,w,h),points=Array.from({length:180},(_,time)=>reefWanderTarget(f,time));
  assert.ok(Math.min(...points.map(p=>p.x))<w*.16);assert.ok(Math.max(...points.map(p=>p.x))>w*.84);
  assert.ok(Math.min(...points.map(p=>p.y))<h*.2);assert.ok(Math.max(...points.map(p=>p.y))>h*.8);
 }
});

test('reef correction has a shared movement budget even inside multiple islands',()=>{
 const f=makeFish(2,800,600),letters=[{x:f.center.x,y:f.center.y,glyphWidth:70,inkHeight:100,reefCluster:1},{x:f.center.x+10,y:f.center.y,glyphWidth:70,inkHeight:100,reefCluster:2}],before={x:f.x,y:f.y};
 separateCoral(f,letters,1);assert.ok(Math.hypot(f.x-before.x,f.y-before.y)<=1.00001);
});
