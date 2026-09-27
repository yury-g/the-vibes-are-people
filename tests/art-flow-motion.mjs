import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {articulate,swim,angleDelta} from '../dist/iterations/ultraviolet-flow/body.js';
import {MAX_TURN} from '../dist/iterations/ultraviolet-flow/turns.js';
import {profiles,warpSprite,artSkin,knotPoint} from '../dist/iterations/art-flow/geometry.js';
import {ArtFlowKoi} from '../dist/iterations/art-flow/engine.js';
import {UltravioletKoi} from '../dist/iterations/ultraviolet-flow/koi.js';
const fixtures=JSON.parse(readFileSync(new URL('./art-flow-sprites.json',import.meta.url)));
globalThis.scrollY=0;
assert.equal(ArtFlowKoi.prototype.steer,UltravioletKoi.prototype.steer);
assert.equal(ArtFlowKoi.prototype.capture,UltravioletKoi.prototype.capture);
assert.equal(ArtFlowKoi.prototype.selectTarget,UltravioletKoi.prototype.selectTarget);
const classes={add(){},remove(){}};
const eater=Object.assign(Object.create(ArtFlowKoi.prototype),{x:200,y:200,w:1280,h:720,heading:0,time:1,speed:74,eaten:0,letters:[{x:201.6,y:200,visible:true,ch:'A',size:16,el:{classList:classes}}],school:{visible:[],needsMeasure:false}});
eater.capture();assert.equal(eater.eaten,1);assert.equal(eater.speed,74,'capture preserves momentum');assert.equal(eater.coastSpeed,74);assert.equal(eater.captureEffects.length,1,'actual mouth capture emits visible effect');
const results=[];
for(const [style,sprite] of Object.entries(fixtures))for(const [w,h] of [[320,640],[390,844],[1280,720]]){
 const scale=Math.min(1,w/600,h/600),e={x:w/2,y:h/2,w,h,heading:0,speed:56*scale,vx:56*scale,vy:0,phase:0,requestedSpeed:108,navBounds:{left:45,right:w-45,top:45,bottom:h-45},sprite,profile:profiles[style]};
 articulate(e,0);let minClear=Infinity;
 for(let frame=0;frame<60*35;frame++){
  const corners=[[w-20,20],[20,h-20],[w-20,h-20],[20,20]],g=corners[Math.floor(frame/300)%4];e.target={x:g[0],y:g[1]};e.requestedSpeed=frame%900>720?56:108;
  const previous={x:e.x,y:e.y,speed:e.speed,yaw:e.yaw||0};swim(e,1/60);articulate(e,1/60);warpSprite(e);
  assert(Math.abs(Math.hypot(e.x-previous.x,e.y-previous.y)-e.speed/60)<1e-8,'continuous forward momentum');
  assert(Math.abs(e.yaw-previous.yaw)<=3/60+1e-8,'bounded yaw acceleration');
  assert(Math.abs(angleDelta(e.body[1].a,e.heading))<1e-10,'joined head and neck');
  for(let i=1;i<15;i++)assert(Math.abs(Math.hypot(e.body[i].x-e.body[i-1].x,e.body[i].y-e.body[i-1].y)-e.segmentLength)<1e-8,'fixed physical links');
  assert(e.turnLedger.used<=MAX_TURN+1e-8,'2.5 rotation cap');
  const skin=artSkin(e),b=skin.bounds,clear=Math.min(b.left,w-b.right,b.top,h-b.bottom);minClear=Math.min(minClear,clear);assert(clear>=0,`${style} full alpha viewport ${w}: ${clear}`);
  if(frame%120===0){
   // Every alpha interval in both triangles lies in this convex band envelope.
   for(let i=0;i<48;i++){const band=sprite.bands[i];for(const y of [band.lo,band.hi,(band.lo+band.hi)/2])for(const k of [e.knots[i],e.knots[i+1]]){const p=knotPoint(k,y,sprite.height);assert(skin.query(p.x,p.y).clearance<1e-7,'rendered alpha in collision envelope');}}
   ArtFlowKoi.prototype.updateMinnows.call(e,0);const p=e.body[6],outside=e.skin.project(p.x,p.y,9);assert(outside.clearance>=.1,'letter radius projected beyond alpha');
  }
 }
 results.push({style,w,h,fit:e.spriteFit,length:129.92*e.spriteFit,minClear});
}
console.table(results);console.log('525 simulated seconds: alpha containment, full viewport, letter keepout, fixed neck/links, inertia and turn cap passed.');
